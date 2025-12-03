import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }: Props) {
  const stars = [1, 2, 3, 4, 5]
  
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  }

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 active:scale-95'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= Math.round(value) 
                ? 'fill-accent text-accent drop-shadow-sm' 
                : 'fill-muted text-muted-foreground/20'
            )}
          />
        </button>
      ))}
    </div>
  )
}
