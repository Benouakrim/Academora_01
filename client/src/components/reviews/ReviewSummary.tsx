import { Card, CardContent } from '@/components/ui/card'
import StarRating from './StarRating'

function SimpleProgress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
      <div className="h-full bg-accent transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  )
}

type Stats = {
  count: number
  avgRating: number
  breakdown: {
    academic: number
    campus: number
    social: number
    career: number
  }
}

export default function ReviewSummary({ stats }: { stats: Stats }) {
  return (
    <Card className="bg-primary-50/50 dark:bg-primary-950/20 border-primary/10 mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Overall Score */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="text-5xl font-black text-primary tracking-tight">
              {stats.avgRating.toFixed(1)}
            </div>
            <div className="my-2">
              <StarRating value={stats.avgRating} size="lg" readOnly />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Based on {stats.count} student review{stats.count !== 1 && 's'}
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {[
              { label: 'Academics', val: stats.breakdown.academic },
              { label: 'Campus Life', val: stats.breakdown.campus },
              { label: 'Social Scene', val: stats.breakdown.social },
              { label: 'Career Support', val: stats.breakdown.career },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{item.label}</span>
                  <span className="font-bold text-foreground">{item.val.toFixed(1)}</span>
                </div>
                <SimpleProgress value={(item.val / 5) * 100} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
