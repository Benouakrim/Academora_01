import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, DollarSign, Users, Briefcase } from 'lucide-react'
import type { UniversityDetail } from '@/hooks/useUniversityDetail'
import ReviewList from '@/components/reviews/ReviewList'
import CareerHeatmap from '@/components/visualizations/CareerHeatmap'

// Helper for formatting currency
const fmtMoney = (val: number | null) => val ? `$${val.toLocaleString()}` : 'N/A'
const fmtPct = (val: number | null) => val ? `${(val * 100).toFixed(1)}%` : 'N/A'

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b last:border-0 border-border/50">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}

export default function UniversityTabs({ university }: { university: UniversityDetail }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start">
          <TabsTrigger value="overview" className="h-10 px-6 rounded-md">Overview</TabsTrigger>
          <TabsTrigger value="admissions" className="h-10 px-6 rounded-md">Admissions</TabsTrigger>
          <TabsTrigger value="costs" className="h-10 px-6 rounded-md">Costs & Aid</TabsTrigger>
          <TabsTrigger value="outcomes" className="h-10 px-6 rounded-md">Outcomes</TabsTrigger>
          <TabsTrigger value="reviews" className="h-10 px-6 rounded-md">Reviews</TabsTrigger>
        </TabsList>

        {/* --- OVERVIEW TAB --- */}
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{university.description || "No description available."}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Majors</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {university.popularMajors.map(m => (
                  <Badge key={m} variant="secondary" className="px-3 py-1 text-sm">{m}</Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> Student Body
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StatRow label="Total Students" value={university.studentPopulation?.toLocaleString()} />
                <StatRow label="Student/Faculty Ratio" value={`1:${university.studentFacultyRatio || '?'}`} />
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Male ({fmtPct(university.percentMale)})</span>
                    <span>Female ({fmtPct(university.percentFemale)})</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <div className="bg-blue-500 h-full" style={{ width: `${(university.percentMale || 0.5) * 100}%` }} />
                    <div className="bg-pink-500 h-full" style={{ width: `${(university.percentFemale || 0.5) * 100}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- ADMISSIONS TAB --- */}
        <TabsContent value="admissions" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /> Selectivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/10">
                <div className="text-4xl font-black text-primary">{fmtPct(university.acceptanceRate)}</div>
                <div className="text-sm text-muted-foreground mt-1">Acceptance Rate</div>
              </div>
              <StatRow label="Application Deadline" value={university.applicationDeadline ? new Date(university.applicationDeadline).toLocaleDateString() : 'N/A'} />
              <StatRow label="Common App" value={university.commonAppAccepted ? "Accepted" : "No"} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Scores (25th - 75th %)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>SAT Math</span>
                  <span>{university.satMath25} - {university.satMath75}</span>
                </div>
                <div className="h-2 bg-muted rounded-full relative">
                  <div 
                    className="absolute h-full bg-primary rounded-full opacity-50"
                    style={{ left: `${((university.satMath25 || 400)-400)/12}%`, width: `${((university.satMath75 || 800)-(university.satMath25 || 400))/12}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>SAT Verbal</span>
                  <span>{university.satVerbal25} - {university.satVerbal75}</span>
                </div>
                <div className="h-2 bg-muted rounded-full relative">
                  <div 
                    className="absolute h-full bg-secondary rounded-full opacity-50"
                    style={{ left: `${((university.satVerbal25 || 400)-400)/12}%`, width: `${((university.satVerbal75 || 800)-(university.satVerbal25 || 400))/12}%` }}
                  />
                </div>
              </div>
              <StatRow label="Average GPA" value={university.avgGpa || 'N/A'} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- COSTS TAB --- */}
        <TabsContent value="costs" className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" /> Yearly Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StatRow label="In-State Tuition" value={fmtMoney(university.tuitionInState)} />
              <StatRow label="Out-of-State" value={fmtMoney(university.tuitionOutState)} />
              <StatRow label="International" value={fmtMoney(university.tuitionInternational)} />
              <StatRow label="Room & Board" value={fmtMoney(university.roomAndBoard)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Financial Aid</CardTitle>
            </CardHeader>
            <CardContent>
              <StatRow label="Avg Net Price" value={fmtMoney(university.averageNetPrice)} />
              <StatRow label="Students w/ Aid" value={fmtPct(university.percentReceivingAid)} />
              <StatRow label="Avg Grant" value={fmtMoney(university.averageGrantAid)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- OUTCOMES TAB --- */}
        <TabsContent value="outcomes" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" /> Employment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatRow label="Graduation Rate" value={fmtPct(university.graduationRate)} />
                <StatRow label="Employment Rate" value={fmtPct(university.employmentRate)} />
                <StatRow label="Starting Salary" value={fmtMoney(university.averageStartingSalary)} />
              </CardContent>
            </Card>
            {/* Legacy Feature Restored: Career Heatmap */}
            {university.averageStartingSalary && (
              <CareerHeatmap startingSalary={university.averageStartingSalary} />
            )}
          </div>
        </TabsContent>

        {/* --- REVIEWS TAB --- */}
        <TabsContent value="reviews">
          <ReviewList universityId={university.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
