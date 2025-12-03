import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

type Review = {
  id: string
  content: string
  rating: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  university: { name: string }
  user: { firstName: string; lastName: string; email: string; avatarUrl: string }
}

export default function ReviewModerationPage() {
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const queryClient = useQueryClient()

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews', statusFilter],
    queryFn: async () => {
      const { data } = await api.get<{ data: Review[] }>(`/admin/reviews?status=${statusFilter}`)
      return data.data
    }
  })

  const moderate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/reviews/${id}/status`, { status })
    },
    onSuccess: () => {
      toast.success('Review status updated')
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
    },
    onError: () => toast.error('Failed to update status')
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Review Moderation</h2>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="PENDING" className="px-6">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED" className="px-6">Approved</TabsTrigger>
          <TabsTrigger value="REJECTED" className="px-6">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          {isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : reviews?.length === 0 ? (
            <div className="text-center py-20 border border-dashed rounded-xl bg-muted/10">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">No {statusFilter.toLowerCase()} reviews found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews?.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatarUrl} />
                        <AvatarFallback>{review.user.firstName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          {review.university.name}
                          <Badge variant="outline" className="ml-2">{review.rating}/5</Badge>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          by {review.user.firstName} {review.user.lastName} • {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {review.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          onClick={() => moderate.mutate({ id: review.id, status: 'APPROVED' })}
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => moderate.mutate({ id: review.id, status: 'REJECTED' })}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-md border border-border/50">
                      {review.content}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
