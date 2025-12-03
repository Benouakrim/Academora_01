import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { Plus } from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdminStats'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import StatsOverview from './components/StatsOverview'

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!data) return <div>Failed to load dashboard</div>

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">System overview and recent activity.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/universities/new">
            <Button className="bg-gradient-brand shadow-lg border-0">
              <Plus className="mr-2 h-4 w-4" /> Add University
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsOverview stats={data.counts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback>{user.firstName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.createdAt))} ago
                  </div>
                </div>
              ))}
              <Link to="/admin/users" className="block">
                <Button variant="outline" className="w-full">View All Users</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{review.university.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Rated <span className="text-amber-500 font-bold">{review.rating}/5</span> by {review.user.firstName}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt))} ago
                  </div>
                </div>
              ))}
              <Link to="/admin/reviews" className="block">
                <Button variant="outline" className="w-full">Manage Reviews</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
