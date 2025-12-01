import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type ChartDatum = Record<string, number | string | null>
type ChartProps = {
  title: string
  data: ChartDatum[]
  dataKey: string
  labelKey?: string
  unit?: string
}

const COLORS = ['hsl(221, 83%, 53%)', 'hsl(262, 83%, 58%)', 'hsl(38, 92%, 50%)']

export default function ComparisonChart({ title, data, dataKey, labelKey = 'name', unit = '' }: ChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey={labelKey} 
                type="category" 
                width={100} 
                tick={{ fontSize: 12 }} 
                interval={0}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                formatter={(value: number) => [`${unit}${value.toLocaleString()}`, '']}
              />
              <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} barSize={32}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
