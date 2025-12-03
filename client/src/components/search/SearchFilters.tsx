import { Search, MapPin, DollarSign, BookOpen, Sun, Building, Shield, PartyPopper, GraduationCap, ClipboardCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { SearchFilters } from '@/hooks/useUniversitySearch'

type Props = {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}

export default function SearchFilters({ filters, onChange }: Props) {
  const update = (key: keyof SearchFilters, value: any) => {
    onChange({ ...filters, [key]: value })
  }
  
  const formatPct = (val: number | undefined) => val ? `${(val * 100).toFixed(0)}%` : 'Any'
  const formatSat = (val: number | undefined) => val ? `${val}` : 'Any'

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name..." 
          value={filters.search || ''} 
          onChange={(e) => update('search', e.target.value)}
          className="pl-9 bg-white dark:bg-neutral-900"
        />
      </div>

      <Accordion type="multiple" defaultValue={['location', 'academics', 'costs']} className="w-full">
        
        {/* --- 1. LOCATION SECTION --- */}
        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-semibold">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Location</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs">Country</Label>
              <Select value={filters.country || 'all'} onValueChange={(v) => update('country', v === 'all' ? undefined : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Country</SelectItem>
                  <SelectItem value="USA">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
             
            <div className="space-y-2">
              <Label className="text-xs flex gap-2 items-center"><Building className="h-3 w-3" /> Setting</Label>
              <Select value={filters.setting || 'all'} onValueChange={(v) => update('setting', v === 'all' ? undefined : v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Any Setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Setting</SelectItem>
                  <SelectItem value="URBAN">Urban City</SelectItem>
                  <SelectItem value="SUBURBAN">Suburban</SelectItem>
                  <SelectItem value="RURAL">Rural / College Town</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* --- 2. ACADEMICS SECTION (ENHANCED) --- */}
        <AccordionItem value="academics">
          <AccordionTrigger className="text-sm font-semibold">
            <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600" /> Academics</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span>Max Acceptance Rate</span>
                <span className="font-medium text-primary">{formatPct(filters.minAcceptanceRate)}</span>
              </div>
              <Slider
                min={0.05}
                max={0.9}
                step={0.05}
                value={[filters.minAcceptanceRate || 0.9]}
                onValueChange={(v) => update('minAcceptanceRate', v[0])}
                className="[&>.bg-primary]:bg-blue-600"
              />
              <p className="text-xs text-muted-foreground">Sets the maximum selectivity (e.g., 20% excludes schools with 10% rate)</p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span>Min GPA Required</span>
                <span className="font-medium text-primary">{filters.minGpa?.toFixed(1) || 'Any'}</span>
              </div>
              <Slider
                min={2.0}
                max={4.0}
                step={0.1}
                value={[filters.minGpa || 2.0]}
                onValueChange={(v) => update('minGpa', v[0] === 2.0 ? undefined : v[0])}
                className="[&>.bg-primary]:bg-blue-600"
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span>Min Average SAT Score</span>
                <span className="font-medium text-primary">{formatSat(filters.minAvgSat)}</span>
              </div>
              <Slider
                min={1000}
                max={1600}
                step={50}
                value={[filters.minAvgSat || 1000]}
                onValueChange={(v) => update('minAvgSat', v[0] === 1000 ? undefined : v[0])}
                className="[&>.bg-primary]:bg-blue-600"
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs">
                <span>Min Required IELTS</span>
                <span className="font-medium text-primary">{filters.requiredIelts?.toFixed(1) || 'Any'}</span>
              </div>
              <Slider
                min={5.0}
                max={8.5}
                step={0.5}
                value={[filters.requiredIelts || 5.0]}
                onValueChange={(v) => update('requiredIelts', v[0] === 5.0 ? undefined : v[0])}
                className="[&>.bg-primary]:bg-blue-600"
              />
              <p className="text-xs text-muted-foreground">Filters by schools that typically accept scores at or above this level.</p>
            </div>

          </AccordionContent>
        </AccordionItem>
        
        {/* --- 3. COSTS SECTION --- */}
        <AccordionItem value="costs">
          <AccordionTrigger className="text-sm font-semibold">
            <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600" /> Financials</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 px-1">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span>Max Tuition (Out-of-State/Intl)</span>
                <span className="font-medium text-primary">${((filters.maxTuition || 80000) / 1000).toFixed(0)}k</span>
              </div>
              <Slider
                min={5000}
                max={80000}
                step={5000}
                value={[filters.maxTuition || 80000]}
                onValueChange={(v) => update('maxTuition', v[0])}
                className="[&>.bg-primary]:bg-green-600"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* --- 4. CAMPUS LIFE & SAFETY SECTION (EXISTING) --- */}
        <AccordionItem value="campuslife">
          <AccordionTrigger className="text-sm font-semibold">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Campus Life & Safety</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 pt-4 px-1">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> Min Safety Rating</span>
                <span className="font-medium text-primary">{filters.minSafetyRating ? `${filters.minSafetyRating.toFixed(1)}/5.0` : 'Any'}</span>
              </div>
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filters.minSafetyRating || 0]}
                onValueChange={(v) => update('minSafetyRating', v[0] === 0 ? undefined : v[0])}
                className="[&>.bg-primary]:bg-purple-600"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1.5"><PartyPopper className="h-3 w-3" /> Min Party Scene</span>
                <span className="font-medium text-primary">{filters.minPartySceneRating ? `${filters.minPartySceneRating.toFixed(1)}/5.0` : 'Any'}</span>
              </div>
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={[filters.minPartySceneRating || 0]}
                onValueChange={(v) => update('minPartySceneRating', v[0] === 0 ? undefined : v[0])}
                className="[&>.bg-primary]:bg-purple-600"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button 
        variant="outline" 
        className="w-full text-xs"
        onClick={() => onChange({})}
      >
        Reset Filters
      </Button>
    </div>
  )
}
