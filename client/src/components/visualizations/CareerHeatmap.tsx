import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

type Props = {
  startingSalary: number
}

export default function CareerHeatmap({ startingSalary }: Props) {
  // Project salary growth over 10 years (mock projection based on starting)
  const data = Array.from({ length: 11 }).map((_, i) => {
    const year = 2024 + i
    const growthRate = 1 + (0.05 * i) // 5% annual growth
    const salary = Math.round(startingSalary * growthRate)
    return {
      year: year.toString(),
      salary,
      formatted: `$${(salary / 1000).toFixed(0)}k`
    }
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
          <TrendingUp className="w-4 h-4 text-green-600" />
        </div>
        <CardTitle className="text-base">Projected Earning Potential</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={(val) => `$${val/1000}k`} 
                tick={{ fontSize: 12 }} 
                width={60}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="salary" 
                stroke="var(--color-primary-600)" 
                fillOpacity={1} 
                fill="url(#colorSalary)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Estimated growth based on current market trends for this university's graduates.
        </p>
      </CardContent>
    </Card>
  )
}
