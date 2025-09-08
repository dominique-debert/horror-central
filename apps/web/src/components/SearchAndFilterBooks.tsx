'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Constants for default values
export const ALL_VALUE = 'all'

interface SearchAndFilterBooksProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedDecade: string
  onDecadeChange: (value: string) => void
  selectedAuthor: string
  onAuthorChange: (value: string) => void
  sortBy: 'rating.desc' | 'first_publish_year.desc' | 'title.asc'
  onSortByChange: (value: 'rating.desc' | 'first_publish_year.desc' | 'title.asc') => void
  availableDecades: string[]
  availableAuthors: string[]
  className?: string
}

export function SearchAndFilterBooks({
  searchTerm,
  onSearchChange,
  selectedDecade,
  onDecadeChange,
  selectedAuthor,
  onAuthorChange,
  sortBy,
  onSortByChange,
  availableDecades = [],
  availableAuthors = [],
  className = '',
}: SearchAndFilterBooksProps) {
  const [showFilters, setShowFilters] = useState(false)

  const sortOptions = [
    { value: 'rating.desc' as const, label: 'Highest Rated' },
    { value: 'first_publish_year.desc' as const, label: 'Newest First' },
    { value: 'title.asc' as const, label: 'Title A-Z' },
  ]

  return (
    <div className={`mt-8 space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search books by title or author..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-900/50 rounded-lg">
          {/* Decade Filter */}
          <div className="space-y-2">
            <Label htmlFor="decade-filter">Publication Decade</Label>
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
            <Label htmlFor="author-filter">Author</Label>
            <Select
              value={selectedAuthor || ALL_VALUE}
              onValueChange={(value) => onAuthorChange(value === ALL_VALUE ? '' : value)}
            >
              <SelectTrigger id="author-filter" className="w-full">
                <SelectValue placeholder="Select author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All Authors</SelectItem>
                {availableAuthors.map((author) => (
                  <SelectItem key={author} value={author}>
                    {author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-filter">Sort By</Label>
            <Select
              value={sortBy}
              onValueChange={(value: 'rating.desc' | 'first_publish_year.desc' | 'title.asc') => 
                onSortByChange(value)
              }
            >
              <SelectTrigger id="sort-filter" className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
