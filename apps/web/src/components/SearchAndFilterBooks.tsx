'use client'

import { useState } from 'react';
import { Check, ChevronsUpDown, Filter, X, BookOpen, Calendar, User, Star, ArrowUpDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Constants for default values
export const ALL_VALUE = 'all'

// Book specific types
type SortOption = 'rating.desc' | 'first_publish_year.desc' | 'title.asc' | 'author.asc'
type FormatOption = 'all' | 'hardcover' | 'paperback' | 'ebook' | 'audiobook'

export interface SearchAndFilterBooksProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedDecade: string
  onDecadeChange: (value: string) => void
  selectedAuthor: string
  onAuthorChange: (value: string) => void
  selectedFormat: FormatOption
  onFormatChange: (value: FormatOption) => void
  sortBy: SortOption
  onSortByChange: (value: SortOption) => void
  availableDecades: string[]
  availableAuthors: string[]
  isLoadingAuthors?: boolean
  className?: string
}

export function SearchAndFilterBooks({
  searchTerm,
  onSearchChange,
  selectedDecade,
  onDecadeChange,
  selectedAuthor,
  onAuthorChange,
  selectedFormat,
  onFormatChange,
  sortBy,
  onSortByChange,
  availableDecades = [],
  availableAuthors = [],
  isLoadingAuthors = false,
  className,
}: SearchAndFilterBooksProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const sortOptions = [
    { value: 'rating.desc' as const, label: 'Highest Rated', icon: <Star className="h-4 w-4 mr-2" /> },
    { value: 'first_publish_year.desc' as const, label: 'Newest First', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { value: 'title.asc' as const, label: 'Title A-Z', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { value: 'author.asc' as const, label: 'Author A-Z', icon: <User className="h-4 w-4 mr-2" /> },
  ]

  const formatOptions = [
    { value: 'all' as const, label: 'All Formats' },
    { value: 'hardcover' as const, label: 'Hardcover' },
    { value: 'paperback' as const, label: 'Paperback' },
    { value: 'ebook' as const, label: 'E-book' },
    { value: 'audiobook' as const, label: 'Audiobook' },
  ]

  const fallbackAuthors = [
    'Stephen King', 'Clive Barker', 'Anne Rice', 'H.P. Lovecraft', 'Shirley Jackson', 'Edgar Allan Poe', 'Bram Stoker', 'Mary Shelley', 'Robert R. McCammon', 'Peter Straub', 'Richard Matheson', 'Joe Hill', 'Ramsey Campbell', 'Brian Keene', 'Paul Tremblay', 'Grady Hendrix', 'Alma Katsu', 'V.C. Andrews', 'Thomas Ligotti', 'Laird Barron', 'Kathe Koja', 'Adam Nevill', 'Graham Masterton', 'John Langan', 'Sarah Pinborough', 'Josh Malerman', 'Caitlín R. Kiernan', 'Tananarive Due', 'Victor LaValle', 'Gemma Files', 'Michael McDowell', 'Elizabeth Hand', 'Christopher Golden', 'David Wong', 'Scott Smith', 'Mark Z. Danielewski', 'Dan Simmons', 'William Peter Blatty', 'Robert Bloch', 'Jack Ketchum', 'Poppy Z. Brite', 'Riley Sager', 'Alex Michaelides', 'Simone St. James', 'Silvia Moreno-Garcia', 'Stephen Graham Jones', 'Eric LaRocca', 'Hailey Piper', 'Gwendolyn Kiste', 'Rachel Harrison', 'Andrew Michael Hurley', 'Craig Davidson', 'Nick Cutter', 'Ania Ahlborn', 'Ronald Malfi', 'Tim Waggoner', 'Jonathan Janz', 'Hunter Shea', 'Kealan Patrick Burke', 'Kristopher Triana', 'Wrath James White', 'Edward Lee', 'Bentley Little', 'Lisa Tuttle', 'Lisa Morton', 'Lisa Unger', 'Lisa Jewell', 'Lisa Regan', 'Lisa Scottoline', 'Lisa Gardner', 'Lisa Genova', 'Lisa See', 'Lisa Wingate', 'Lisa Kleypas', 'Lisa Jackson', 'Lisa Renee Jones', 'Lisa Edmonds', 'Lisa Henry', 'Lisa Marie Rice', 'Lisa Shearin', 'Lisa Swallow', 'Lisa Mondello', 'Lisa Rayns', 'Lisa Ann Verge', 'Lisa Plumley', 'Lisa Bergren', 'Lisa Samson', 'Lisa Harris', 'Lisa Childs', 'Lisa Bingham', 'Lisa G. Riley', 'Lisa Cach', 'Lisa Alther', 'Lisa Tucker', 'Lisa D. Smith', 'Lisa McMann', 'Lisa Mangum', 'Lisa Desrochers', 'Lisa Schroeder', 'Lisa Papademetriou', 'Lisa Yee', 'Lisa Graff', 'Lisa Ann Sandell', 'Lisa Klein', 'Lisa Williams Kline', 'Lisa Rowe Fraustino', 'Lisa Jahn-Clough', 'Lisa Harkrader', 'Lisa Doan', 'Lisa Fiedler', 'Lisa Trumbauer', 'Lisa Campbell Ernst', 'Lisa Wheeler', 'Lisa Westberg Peters', 'Lisa Passen', 'Lisa McCourt', 'Lisa Tawn Bergren', 'Lisa Shulman', 'Lisa Moser', 'Lisa Broadie Cook', 'Lisa Kopelke', 'Lisa Jahn-Clough', 'Lisa Wheeler', 'Lisa Westberg Peters', 'Lisa Passen', 'Lisa McCourt', 'Lisa Tawn Bergren', 'Lisa Shulman', 'Lisa Moser', 'Lisa Broadie Cook', 'Lisa Kopelke'
  ];
  const isFallback = availableAuthors.length === 0 || (availableAuthors.length > 0 && availableAuthors.every(a => fallbackAuthors.includes(a)));

  return (
    <div className={`space-y-4 mt-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          {showFilters ? (
            <>
              <X className="h-4 w-4" />
              Hide Filters
            </>
          ) : (
            <>
              <Filter className="h-4 w-4" />
              Show Filters
            </>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          {/* Decade Filter */}
          <div className="space-y-2">
            <Label htmlFor="decade-filter" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Publication Decade
            </Label>
            <Select
              value={selectedDecade || ALL_VALUE}
              onValueChange={(value) => onDecadeChange(value === ALL_VALUE ? '' : value)}
            >
              <SelectTrigger id="decade-filter" className="w-full">
                <SelectValue placeholder="Select decade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All Decades</SelectItem>
                {availableDecades.map((decade) => (
                  <SelectItem key={decade} value={decade}>
                    {decade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Author Filter */}
          <div className="space-y-2">
            <Label htmlFor="author-filter" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Author
            </Label>
            <div className="flex flex-col gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedAuthor === 'all' 
                      ? "All Authors" 
                      : availableAuthors.find((author) => author === selectedAuthor) || "Select author..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Search authors..." 
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandEmpty>No author found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          onAuthorChange('all')
                          setOpen(false)
                          setSearchValue('')
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedAuthor === 'all' ? "opacity-100" : "opacity-0"
                          )}
                        />
                        All Authors
                      </CommandItem>
                      {availableAuthors.map((author) => (
                        <CommandItem
                          key={author}
                          value={author}
                          onSelect={(currentValue) => {
                            onAuthorChange(currentValue)
                            setOpen(false)
                            setSearchValue('')
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedAuthor === author ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {author}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Format Filter */}
          <div className="space-y-2">
            <Label htmlFor="format-filter" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Format
            </Label>
            <Select
              value={selectedFormat}
              onValueChange={(value: FormatOption) => onFormatChange(value)}
            >
              <SelectTrigger id="format-filter" className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {formatOptions.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-filter" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort By
            </Label>
            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => onSortByChange(value)}
            >
              <SelectTrigger id="sort-filter" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {option.icon}
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
