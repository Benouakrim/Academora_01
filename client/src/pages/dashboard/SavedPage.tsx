import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSavedUniversities } from '@/hooks/useSavedUniversities'
import SavedUniversityCard from './components/SavedUniversityCard'
import EditNoteDialog from './components/EditNoteDialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Bookmark, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function SavedPage() {
  const { data: saved, isLoading, remove, updateNote } = useSavedUniversities()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const current = saved?.find((s) => s.university.id === activeId) || null
  
  const filtered = saved?.filter(s => 
    s.university.name.toLowerCase().includes(search.toLowerCase()) || 
    s.university.city?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const onSaveNote = async (text: string) => {
    if (!activeId) return
    await updateNote(activeId, text)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bookmark className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Saved Universities</h1>
            <p className="text-muted-foreground text-sm">Manage your college list</p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Filter list..." 
            className="pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <SavedUniversityCard
              key={s.id}
              data={s}
              onRemove={remove}
              onEditNote={(id) => setActiveId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border-2 border-dashed border-border rounded-2xl bg-muted/10">
          <Bookmark className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No universities found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {search ? "Try adjusting your search filter." : "Start exploring to add universities to your collection."}
          </p>
          {!search && (
            <Link to="/search">
              <Button className="bg-gradient-brand">Explore Universities</Button>
            </Link>
          )}
        </div>
      )}

      <EditNoteDialog
        isOpen={Boolean(activeId)}
        onClose={() => setActiveId(null)}
        initialNote={current?.notes ?? ''}
        onSave={onSaveNote}
      />
    </div>
  )
}
