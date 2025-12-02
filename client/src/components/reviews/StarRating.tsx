import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md' }: Props) {
  const stars = [1, 2, 3, 4, 5]
  const sizeClasses = { sm: 'h-3 w-3', md: 'h-5 w-5', lg: 'h-6 w-6' }

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= value ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'
            )}
          />
        </button>
      ))}
    </div>
  )
}
