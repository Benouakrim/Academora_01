import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Reply, ThumbsUp, ThumbsDown } from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'

type CommentAuthor = {
  id: string
  firstName: string | null
  lastName: string | null
  avatarUrl: string | null
}

type Comment = {
  id: string
  content: string
  createdAt: string
  upvotes: number
  downvotes: number
  author: CommentAuthor
  replies?: Comment[]
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const { isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', articleId],
    queryFn: async () => {
      const res = await api.get<Comment[]>(`/comments/${articleId}`)
      return res.data
    }
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: { content: string; parentId?: string }) => {
      await api.post('/comments', {
        articleId,
        content: payload.content,
        parentId: payload.parentId
      })
    },
    onSuccess: () => {
      toast.success('Comment posted')
      setNewComment('')
      setReplyTo(null)
      setReplyContent('')
      queryClient.invalidateQueries({ queryKey: ['comments', articleId] })
    },
    onError: () => toast.error('Failed to post comment')
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    mutate({ content: newComment })
  }

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return
    mutate({ content: replyContent, parentId })
  }

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    console.log(`Vote ${voteType} on comment ${commentId}`)
    toast.info('Voting feature coming soon!')
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6" />
        Discussion
      </h3>

      {/* New Comment Box */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <Textarea 
            placeholder="Share your thoughts..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-4"
          />
          <Button type="submit" disabled={isPending || !newComment.trim()}>
            {isPending ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <div className="bg-muted/50 p-6 rounded-lg text-center mb-10">
          <p className="text-muted-foreground mb-4">Join the conversation to share your thoughts.</p>
          <Link to="/sign-in">
            <Button variant="outline">Sign In to Comment</Button>
          </Link>
        </div>
      )}

      {/* List */}
      <div className="space-y-8">
        {isLoading && <p>Loading comments...</p>}
        {comments?.length === 0 && <p className="text-muted-foreground italic">No comments yet. Be the first!</p>}
        
        {comments?.map((comment) => (
          <div key={comment.id} className="group">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.author.avatarUrl || undefined} />
                <AvatarFallback>{comment.author.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">
                      {comment.author.firstName} {comment.author.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                </div>
                
                {/* Engagement Row */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => handleVote(comment.id, 'up')}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {comment.upvotes}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2 text-xs"
                      onClick={() => handleVote(comment.id, 'down')}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {comment.downvotes}
                    </Button>
                  </div>
                  
                  {isSignedIn && (
                    <button 
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 font-medium"
                    >
                      <Reply className="h-3 w-3" /> Reply
                    </button>
                  )}
                </div>

                {/* Reply Input */}
                {replyTo === comment.id && (
                  <div className="mt-3 ml-2 flex gap-3">
                    <Textarea 
                      placeholder="Write a reply..." 
                      className="min-h-[60px]"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                      disabled={isPending}
                    >
                      Reply
                    </Button>
                  </div>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-6 pl-4 border-l-2 border-muted space-y-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={reply.author.avatarUrl || undefined} />
                            <AvatarFallback>{reply.author.firstName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-muted/20 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-xs">
                                  {reply.author.firstName} {reply.author.lastName}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.createdAt))} ago
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed">{reply.content}</p>
                            </div>
                            
                            {/* Reply Engagement */}
                            <div className="flex items-center gap-2 mt-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-1.5 text-[10px]"
                                onClick={() => handleVote(reply.id, 'up')}
                              >
                                <ThumbsUp className="h-2.5 w-2.5 mr-0.5" />
                                {reply.upvotes}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-1.5 text-[10px]"
                                onClick={() => handleVote(reply.id, 'down')}
                              >
                                <ThumbsDown className="h-2.5 w-2.5 mr-0.5" />
                                {reply.downvotes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
