'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, X, BookOpen, Calendar, User, Star, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'

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
  className = '',
}: SearchAndFilterBooksProps) {
  const [showFilters, setShowFilters] = useState(false)

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

  return (
    <div className={`space-y-4 ${className}`}>
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
