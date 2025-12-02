import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { reviewSchema, type ReviewFormValues } from '@/lib/validations/review'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import StarRating from './StarRating'

type Props = {
  universityId: string
  isOpen: boolean
  onClose: () => void
}

export default function ReviewForm({ universityId, isOpen, onClose }: Props) {
  const queryClient = useQueryClient()
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', content: '' }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: ReviewFormValues) => {
      await api.post('/reviews', { ...values, universityId })
    },
    onSuccess: () => {
      toast.success('Review submitted successfully')
      queryClient.invalidateQueries({ queryKey: ['reviews', universityId] })
      form.reset()
      onClose()
    },
    onError: (err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toast.error(message || 'Failed to submit review')
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit((v) => mutate(v))} className="space-y-4 py-2">
          {/* Overall Rating */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <span className="text-sm font-medium">Overall Rating</span>
            <Controller
              control={form.control}
              name="rating"
              render={({ field }) => (
                <StarRating value={field.value} onChange={field.onChange} size="lg" />
              )}
            />
            {form.formState.errors.rating && (
              <p className="text-xs text-destructive">Please select a rating</p>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            {['academicRating', 'campusRating', 'socialRating', 'careerRating'].map((name) => (
              <div key={name} className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground capitalize">
                  {name.replace('Rating', '')}
                </span>
                <Controller
                  control={form.control}
                  name={name as keyof ReviewFormValues}
                  render={({ field }) => (
                    <StarRating value={field.value as number} onChange={field.onChange} size="sm" />
                  )}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Review Title</label>
            <Input {...form.register('title')} placeholder="e.g., Great academics, tough winters" />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Experience</label>
            <Textarea 
              {...form.register('content')} 
              placeholder="Share your detailed experience..." 
              className="min-h-[100px]"
            />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
