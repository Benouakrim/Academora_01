import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { HardHat, RefreshCw, AlertTriangle, CheckCircle, Database, Zap, Cpu } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import api from '@/lib/api'

interface CacheStats {
  type: string
  size: number
  expired: number
  hitRate: number
  missRate: number
  isReady: boolean
}

interface SyncStatus {
  healthy: boolean
  missingInNeon: number
  missingInClerk: number
  roleMismatches: number
  sample: Array<{ clerkId: string; neonUser?: { email: string; role?: string }; clerkUser?: { email?: string; role?: string }; issue?: string }>
}

// --- 1. HOOKS ---

function useCacheStats() {
  return useQuery<CacheStats>({
    queryKey: ['adminHealthCache'],
    queryFn: async () => {
      const { data } = await api.get('/admin/health/cache')
      return data.data
    },
    refetchInterval: 15000, // Refresh every 15 seconds
  })
}

function useSyncStatus() {
  return useQuery<SyncStatus>({
    queryKey: ['adminHealthSync'],
    queryFn: async () => {
      const { data } = await api.get('/admin/health/sync-status')
      return data.data
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

function useCacheClearer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/admin/health/cache/clear')
    },
    onSuccess: () => {
      toast.success('Cache cleared successfully.')
      queryClient.invalidateQueries({ queryKey: ['adminHealthCache'] })
    },
    onError: () => {
      toast.error('Failed to clear cache.')
    },
  })
}

function useReconciler() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/admin/health/reconcile')
      return data.data
    },
    onSuccess: (data) => {
      toast.success('Reconciliation started.', {
        description: `Created: ${data.created}, Updated: ${data.updated}. Check status shortly.`,
      })
      queryClient.invalidateQueries({ queryKey: ['adminHealthSync'] })
    },
    onError: () => {
      toast.error('Failed to start reconciliation.')
    },
  })
}

// --- 2. COMPONENTS ---

// Mock function for CPU/Memory (Real implementation requires server-side OS module access)
const getMockSystemStats = () => ({
    cpuUsage: Math.floor(Math.random() * (15 - 3) + 3), // 3% to 15%
    memoryUsage: Math.floor(Math.random() * (60 - 30) + 30), // 30% to 60%
    uptime: Math.floor(Math.random() * 8 + 1) // 1 to 8 days
})

function SystemStatsCard() {
    const stats = getMockSystemStats();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-secondary" /> System Load
                </CardTitle>
                <Badge variant="outline">Mock Data</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">{stats.cpuUsage}% <span className="text-base text-muted-foreground font-normal">CPU</span></div>
                <div className="text-lg font-semibold">{stats.memoryUsage}% <span className="text-sm text-muted-foreground font-normal">RAM</span></div>
                <p className="text-xs text-muted-foreground">Uptime: {stats.uptime} days</p>
            </CardContent>
        </Card>
    )
}

function CacheCard() {
  const { data, isLoading, refetch } = useCacheStats()
  const { mutate, isPending } = useCacheClearer()

  if (isLoading) return <Skeleton className="h-[250px] w-full" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" /> Cache Management ({data?.type})
        </CardTitle>
        <CardDescription>
            Current cache type: {data?.type || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Entries</span>
            <span className="font-bold">{data?.size.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Expired</span>
            <span className="font-bold">{data?.expired.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={data?.isReady ? 'success' : 'destructive'}>
                {data?.isReady ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Hit Rate</span>
            <span className="font-bold">{data?.hitRate || 0}%</span>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
            <Button onClick={() => mutate()} disabled={isPending || !data?.isReady} variant="destructive" size="sm">
                {isPending ? 'Clearing...' : 'Clear Cache'}
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SyncStatusCard() {
  const { data, isLoading, refetch } = useSyncStatus()
  const { mutate, isPending } = useReconciler()

  if (isLoading) return <Skeleton className="h-[250px] w-full" />
  
  const isSynced = data?.healthy === true
  const icon = isSynced ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertTriangle className="h-5 w-5 text-red-500" />
  const statusText = isSynced ? 'Synced' : 'Inconsistent'

  return (
    <Card className={isSynced ? 'border-green-500/50' : 'border-red-500/50'}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" /> DB Sync Integrity
        </CardTitle>
        <CardDescription>Clerk ↔ Neon consistency status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
            {icon}
            <span className="text-lg font-semibold">{statusText}</span>
        </div>
        
        {!isSynced && (
            <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col p-2 border rounded bg-red-50">
                        <span className="text-xs text-muted-foreground">Missing in Neon</span>
                        <span className="font-bold text-red-600">{data?.missingInNeon || 0}</span>
                    </div>
                    <div className="flex flex-col p-2 border rounded bg-red-50">
                        <span className="text-xs text-muted-foreground">Missing in Clerk</span>
                        <span className="font-bold text-red-600">{data?.missingInClerk || 0}</span>
                    </div>
                    <div className="flex flex-col p-2 border rounded bg-red-50">
                        <span className="text-xs text-muted-foreground">Role Mismatches</span>
                        <span className="font-bold text-red-600">{data?.roleMismatches || 0}</span>
                    </div>
                </div>
                
                {data?.sample && data.sample.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto border p-3 rounded-md bg-red-500/10 text-sm">
                        <p className="font-medium text-red-600">Sample Issues ({data.sample.length}):</p>
                        {data.sample.map((item, index) => (
                            <p key={index} className="text-xs">{item.issue}</p>
                        ))}
                    </div>
                )}
            </div>
        )}

        <div className="flex gap-2 pt-2">
            <Button onClick={() => mutate()} disabled={isPending} variant="default" size="sm">
                {isPending ? 'Reconciling...' : 'Trigger Reconcile'}
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" /> Check Status
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}


// --- 3. MAIN PAGE ---

export default function AdminHealthPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                    <HardHat className="w-6 h-6 text-secondary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">System Health & Admin Tools</h1>
                    <p className="text-muted-foreground text-sm">
                        Monitor cache performance, sync status, and system metrics
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SystemStatsCard />
                <CacheCard />
            </div>
            
            <div className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2">Database Sync Status</h2>
                <SyncStatusCard />
            </div>
        </div>
    )
}
