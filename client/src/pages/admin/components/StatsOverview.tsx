import { Users, School, FileText, Star, Bookmark, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  stats: import('@/hooks/useAdminStats').AdminStats['counts']
}

export default function StatsOverview({ stats }: Props) {
  const items = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Universities', value: stats.universities, icon: School, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Published Articles', value: stats.articles, icon: FileText, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Reviews', value: stats.reviews, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Saved Items', value: stats.savedItems, icon: Bookmark, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="border-l-4" style={{ borderLeftColor: 'currentColor' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
            <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
