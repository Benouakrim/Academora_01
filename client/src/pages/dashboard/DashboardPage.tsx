import WelcomeHeader from './components/WelcomeHeader'
import RecommendedWidget from './components/RecommendedWidget'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/user/dashboard')
      return res.data
    }
  })

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WelcomeHeader />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      ) : data ? (
        <ActivityFeed data={data} />
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecommendedWidget />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold mb-2">Next Steps</h3>
            <p className="text-sm text-muted-foreground">Complete your profile to get better recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
