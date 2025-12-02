import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { format } from 'date-fns'
import { Trash2, MessageSquarePlus } from 'lucide-react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import StarRating from './StarRating'
import ReviewForm from './ReviewForm'

type ReviewUser = { id: string; firstName?: string | null; lastName?: string | null; avatarUrl?: string | null }
type Review = {
  id: string
  user: ReviewUser
  createdAt: string
  rating: number
  title: string
  content: string
  academicRating?: number | null
  campusRating?: number | null
  socialRating?: number | null
  careerRating?: number | null
}

export default function ReviewList({ universityId }: { universityId: string }) {
  const { isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['reviews', universityId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/${universityId}`)
      return data.data as Review[]
    }
  })

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/${id}`)
    },
    onSuccess: () => {
      toast.success('Review deleted')
      queryClient.invalidateQueries({ queryKey: ['reviews', universityId] })
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(message || 'Failed to delete review')
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Student Reviews</h3>
        {isSignedIn ? (
          <Button onClick={() => setIsFormOpen(true)}>
            <MessageSquarePlus className="mr-2 h-4 w-4" /> Write a Review
          </Button>
        ) : (
          <Button variant="outline" disabled>Sign in to Review</Button>
        )}
      </div>

      {isLoading ? <p>Loading reviews...</p> : (
        <div className="grid gap-6">
          {reviews?.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border rounded-lg bg-muted/10">
              No reviews yet. Be the first to share your experience!
            </div>
          )}
          
          {reviews?.map((review) => (
            <div key={review.id} className="border rounded-xl p-6 bg-card relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.user?.avatarUrl ?? undefined} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{review.user?.firstName || 'Student'}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} readOnly size="sm" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => {
                        if (confirm('Delete this review?')) deleteReview.mutate(review.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <h4 className="font-bold mb-2">{review.title}</h4>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{review.content}</p>

              {/* Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t text-xs">
                {[
                  ['Academic', review.academicRating],
                  ['Campus', review.campusRating],
                  ['Social', review.socialRating],
                  ['Career', review.careerRating],
                ].map(([label, score]) => (
                  score && (
                    <div key={label as string} className="flex flex-col gap-1">
                      <span className="text-muted-foreground">{label}</span>
                      <StarRating value={score as number} readOnly size="sm" />
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ReviewForm 
        universityId={universityId} 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  )
}
