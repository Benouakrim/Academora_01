import { Link } from 'react-router-dom'
import { X, Plus, ArrowRight } from 'lucide-react'
import { useCompareStore, useCompareData } from '@/hooks/useCompare'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ComparisonChart from '@/components/compare/ComparisonChart'

export default function ComparePage() {
  const { selectedSlugs, removeUniversity } = useCompareStore()
  const { data: universities, isLoading } = useCompareData()

  if (selectedSlugs.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4">Compare Universities</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Select universities while searching to see them here side-by-side.
        </p>
        <Link to="/search">
          <Button size="lg" className="bg-gradient-brand">
            Start Searching <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Comparison</h1>
        <div className="flex gap-2">
          {selectedSlugs.length < 3 && (
            <Link to="/search">
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Another
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Header Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {universities?.map((u) => (
              <div key={u.id} className="relative rounded-xl border bg-card p-6 shadow-sm">
                <button
                  onClick={() => removeUniversity(u.slug)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="h-16 w-16 mb-4 rounded-lg bg-muted flex items-center justify-center p-2">
                  {u.logoUrl ? <img src={u.logoUrl} alt={u.name} className="h-full w-full object-contain" /> : 'Logo'}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2 h-14">{u.name}</h3>
                <div className="mt-2 text-sm text-muted-foreground">{u.city}, {u.state}</div>
                <Link to={`/university/${u.slug}`} className="mt-4 block text-sm text-primary hover:underline">
                  View Full Profile
                </Link>
              </div>
            ))}
          </div>

          {/* Charts Row 1: Money */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComparisonChart 
              title="Tuition (Out-of-State)" 
              data={(universities || []).map(u => ({ name: u.name, tuitionOutState: u.tuitionOutState ?? 0 }))} 
              dataKey="tuitionOutState" 
              unit="$" 
            />
            <ComparisonChart 
              title="Average Net Price" 
              data={(universities || []).map(u => ({ name: u.name, averageNetPrice: u.averageNetPrice ?? 0 }))} 
              dataKey="averageNetPrice" 
              unit="$" 
            />
          </div>

          {/* Charts Row 2: Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComparisonChart 
              title="Acceptance Rate (%)" 
              data={(universities || []).map(u => ({ name: u.name, acceptanceRatePct: (u.acceptanceRate || 0) * 100 }))} 
              dataKey="acceptanceRatePct" 
              unit="%" 
            />
            <ComparisonChart 
              title="Graduation Rate (%)" 
              data={(universities || []).map(u => ({ name: u.name, gradRatePct: (u.graduationRate || 0) * 100 }))} 
              dataKey="gradRatePct" 
              unit="%" 
            />
          </div>

          {/* Data Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 font-medium">Feature</th>
                  {universities?.map(u => <th key={u.id} className="p-4 font-medium">{u.name}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { label: 'Student Population', render: (u: import('@/hooks/useUniversityDetail').UniversityDetail) => u.studentPopulation?.toLocaleString() || '—' },
                  { label: 'Student/Faculty Ratio', render: (u: import('@/hooks/useUniversityDetail').UniversityDetail) => u.studentFacultyRatio ? `1:${u.studentFacultyRatio}` : '—' },
                  { label: 'Avg Starting Salary', render: (u: import('@/hooks/useUniversityDetail').UniversityDetail) => u.averageStartingSalary ? `$${u.averageStartingSalary.toLocaleString()}` : '—' },
                  { label: 'Setting', render: (u: import('@/hooks/useUniversityDetail').UniversityDetail) => u.setting || '—' },
                  { label: 'Type', render: (u: import('@/hooks/useUniversityDetail').UniversityDetail) => u.type || '—' },
                ].map((row, idx) => (
                  <tr key={idx} className="bg-card">
                    <td className="p-4 text-muted-foreground">{row.label}</td>
                    {universities?.map((u) => (
                      <td key={u.id} className="p-4 font-medium">
                        {row.render(u)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
