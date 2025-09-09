'use client'

import { useState } from 'react';
import { Check, ChevronsUpDown, Filter, X, Calendar, User, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { ISearchAndFilterBooksProps } from '@/types'

// Constants for default values
export const ALL_VALUE = 'all'

export function SearchAndFilterBooks({
  searchTerm,
  onSearchChange,
  selectedDecade,
  onDecadeChange,
  selectedAuthor,
  onAuthorChange,
  availableDecades = [],
  availableAuthors = [],
  // isLoadingAuthors = false,
  className,
}: ISearchAndFilterBooksProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Decade Filter */}
          <div className="space-y-2">
            <Label htmlFor="decade-filter" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Publication Decade
            </Label>
            <Select
              value={selectedDecade || ALL_VALUE}
              onValueChange={(value) => onDecadeChange(value === ALL_VALUE ? 'all' : value)}
            >
              <SelectTrigger id="decade-filter" className="w-full">
                <SelectValue placeholder="Select decade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All Decades</SelectItem>
                {availableDecades.map((decade) => (
                  <SelectItem key={decade} value={decade}>
                    {decade.endsWith('s') ? decade.slice(0, -1) : decade}
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
                <PopoverContent 
                  className="p-0"
                  style={{ width: 'var(--radix-popover-trigger-width)' }}
                >
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
        </div>
      )}
    </div>
  )
}
