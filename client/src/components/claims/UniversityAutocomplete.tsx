import { useState, useEffect, useRef } from 'react';
import { Search, Building2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface University {
  id: string;
  name: string;
  location?: string;
  country?: string;
}

interface UniversityAutocompleteProps {
  value?: string;
  universityName?: string;
  onChange: (universityId: string, universityName: string) => void;
  placeholder?: string;
  error?: string;
}

export function UniversityAutocomplete({
  value,
  universityName,
  onChange,
  placeholder = 'Search for a university...',
  error,
}: UniversityAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<University[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(
    value && universityName ? { id: value, name: universityName } : null
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search universities when user types at least 3 characters
  useEffect(() => {
    const searchUniversities = async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get('/universities/search', {
          params: {
            q: searchTerm,
            limit: 5,
          },
        });
        setSuggestions(response.data.data || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Failed to search universities:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUniversities, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSelect = (university: University) => {
    setSelectedUniversity(university);
    setSearchTerm('');
    setIsOpen(false);
    onChange(university.id, university.name);
  };

  const handleClear = () => {
    setSelectedUniversity(null);
    setSearchTerm('');
    setSuggestions([]);
    onChange('', '');
  };

  return (
    <div ref={wrapperRef} className="relative space-y-2">
      <Label>University *</Label>
      
      {selectedUniversity ? (
        <div className="flex items-center gap-2 p-3 border rounded-lg bg-primary/5 border-primary">
          <Building2 className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="font-medium text-primary">{selectedUniversity.name}</p>
            {(selectedUniversity.location || selectedUniversity.country) && (
              <p className="text-xs text-muted-foreground">
                {[selectedUniversity.location, selectedUniversity.country]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="pl-9"
          />
          
          {isOpen && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
              {suggestions.map((university) => (
                <button
                  key={university.id}
                  type="button"
                  onClick={() => handleSelect(university)}
                  className="w-full text-left px-4 py-3 hover:bg-accent transition-colors flex items-start gap-3 border-b last:border-b-0"
                >
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{university.name}</p>
                    {(university.location || university.country) && (
                      <p className="text-xs text-muted-foreground truncate">
                        {[university.location, university.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {isOpen && searchTerm.length >= 3 && suggestions.length === 0 && !isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg p-4 text-center text-muted-foreground text-sm">
              No universities found. Try a different search term.
            </div>
          )}
          
          {isLoading && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg p-4 text-center text-muted-foreground text-sm">
              Searching...
            </div>
          )}
        </div>
      )}
      
      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <p className="text-xs text-muted-foreground">
        Type at least 3 characters to search
      </p>
    </div>
  );
}
