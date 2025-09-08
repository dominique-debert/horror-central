'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Filter, Calendar, Clock, Film, Tv, SortAsc, SortDesc, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { tmdbClient, getImageUrl } from '@/lib/tmdb'
import type { ITMDBMovie, ITMDBTVShow } from '@/types'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationButton, PaginationEllipsis } from '@/components/ui/pagination'

interface ComingSoonItem {
  id: string
  title: string
  releaseDate: string
  genre: string[]
  poster: string
  anticipationScore: number
  description: string
  type: 'movie' | 'tv'
  originalData: ITMDBMovie | ITMDBTVShow
}

export default function ComingSoonPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const [comingSoonItems, setComingSoonItems] = useState<ComingSoonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(page)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'tv'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'score'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchComingSoonContent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch data for the current page
        const [moviesResponse, tvShowsResponse, movieGenres, tvGenres] = await Promise.all([
          tmdbClient.getUpcomingHorrorMovies(currentPage),
          tmdbClient.getUpcomingHorrorTVShows(currentPage),
          tmdbClient.getMovieGenres(),
          tmdbClient.getTVGenres()
        ])

        // Calculate total pages based on the total results from the API
        const totalResults = Math.max(moviesResponse.total_results, tvShowsResponse.total_results)
        setTotalPages(Math.ceil(totalResults / 20)) // 20 items per page is TMDB's default

        // Convert movies to ComingSoonItem format
        const today = new Date().toISOString().split('T')[0] // Get today's date in YYYY-MM-DD format
        
        const movieItems: ComingSoonItem[] = moviesResponse.results
          .filter(movie => 
            movie.genre_ids.includes(27) && // Must be horror
            !movie.genre_ids.includes(16) && // Must not be animation
            movie.poster_path && // Must have a poster path
            movie.release_date >= today // Must be released today or in the future
          )
          .map(movie => {
            const movieGenreNames = movieGenres.genres
              .filter(genre => movie.genre_ids.includes(genre.id))
              .map(g => g.name)
            
            return {
              id: `movie-${movie.id}`,
              title: movie.title,
              releaseDate: movie.release_date,
              genre: movieGenreNames.length > 0 ? movieGenreNames : ['Horror'],
              poster: getImageUrl(movie.poster_path),
              anticipationScore: Math.round(movie.vote_average * 10),
              description: movie.overview,
              type: 'movie' as const,
              originalData: movie
            }
          })

        // Convert TV shows to ComingSoonItem format with more lenient filtering
        const tvItems: ComingSoonItem[] = tvShowsResponse.results
          .filter(show => {
            const overview = show.overview?.toLowerCase() || ''
            const name = show.name?.toLowerCase() || ''
            const horrorKeywords = ['horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 'haunted', 'scary', 'terror', 'evil', 'dark', 'sinister', 'mystery', 'thriller', 'crime', 'fantasy', 'sci-fi', 'suspense', 'psychological', 'drama', 'action']
            const hasKeyword = horrorKeywords.some(keyword => overview.includes(keyword) || name.includes(keyword))
            const hasHorrorGenre = show.genre_ids.some(id => [10765, 9648, 18, 80].includes(id))
            
            return (hasKeyword || hasHorrorGenre) && 
                   show.poster_path && // Must have a poster path
                   show.first_air_date && // Must have an air date
                   show.first_air_date >= today // Must be airing today or in the future
          })
          .map(show => {
            const showGenreNames = tvGenres.genres
              .filter(genre => show.genre_ids.includes(genre.id))
              .map(g => g.name)
            
            return {
              id: `tv-${show.id}`,
              title: show.name,
              releaseDate: show.first_air_date,
              genre: showGenreNames.length > 0 ? showGenreNames : ['Horror'],
              poster: getImageUrl(show.poster_path),
              anticipationScore: Math.round(show.vote_average * 10),
              description: show.overview,
              type: 'tv' as const,
              originalData: show
            }
          })

        // Filter out any items with invalid poster URLs
        const validItems = [...movieItems, ...tvItems].filter(item => 
          item.poster && !item.poster.includes('null') && item.poster !== '/null'
        )
        
        setComingSoonItems(validItems)
      } catch (err) {
        console.error('Error fetching coming soon content:', err)
        setError('Failed to load coming soon content. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchComingSoonContent()
  }, [currentPage])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Update the URL with the new page number
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Get unique genres and years for filtering
  const availableGenres = useMemo(() => {
    const genres = new Set<string>()
    comingSoonItems.forEach(item => {
      item.genre.forEach(g => genres.add(g))
    })
    return Array.from(genres).sort()
  }, [comingSoonItems])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    comingSoonItems.forEach(item => {
      if (item.releaseDate) {
        years.add(new Date(item.releaseDate).getFullYear().toString())
      }
    })
    return Array.from(years).sort()
  }, [comingSoonItems])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    const filtered = comingSoonItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = !selectedGenre || item.genre.includes(selectedGenre)
      const matchesYear = !selectedYear || (item.releaseDate && new Date(item.releaseDate).getFullYear().toString() === selectedYear)
      const matchesType = selectedType === 'all' || item.type === selectedType
      
      return matchesSearch && matchesGenre && matchesYear && matchesType
    })

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.releaseDate || '').getTime() - new Date(b.releaseDate || '').getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'score':
          comparison = a.anticipationScore - b.anticipationScore
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [comingSoonItems, searchTerm, selectedGenre, selectedYear, selectedType, sortBy, sortOrder])

  const getDaysUntilRelease = (releaseDate: string) => {
    const today = new Date()
    const release = new Date(releaseDate)
    const diffTime = release.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatReleaseDate = (releaseDate: string) => {
    return new Date(releaseDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
            <p className="text-gray-400 text-lg">Loading upcoming horror content...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Coming Soon</h1>
            <p className="text-gray-400">Upcoming horror movies and TV shows</p>
          </div>
          
          {/* Search and filter UI */}
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search coming soon..."
                className="pl-10 w-full md:w-64 bg-gray-900 border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Button
            variant="outline"
            size="sm"
            className="mr-2 mb-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-900 rounded-lg">
              <div>
                <Label className="block mb-2">Genre</Label>
                <select
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">All Genres</option>
                  {availableGenres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label className="block mb-2">Release Year</Label>
                <select
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label className="block mb-2">Type</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={selectedType === 'movie' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('movie')}
                  >
                    Movies
                  </Button>
                  <Button
                    variant={selectedType === 'tv' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('tv')}
                  >
                    TV Shows
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredAndSortedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedItems.map((item) => (
                <Card key={item.id} className="bg-gray-900 border-gray-800 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[2/3] bg-gray-800">
                    {item.poster ? (
                      <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                        <Film className="h-16 w-16" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs">
                      {item.type.toUpperCase()}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{item.releaseDate ? formatReleaseDate(item.releaseDate) : 'TBA'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                      {item.genre.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.genre.length - 2}
                        </Badge>
                      )}
                    </div>
                    {item.anticipationScore > 0 && (
                      <div className="flex items-center text-sm text-amber-400">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{item.anticipationScore}% Anticipation</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {(() => {
                      const pages = []
                      const maxVisiblePages = 5
                      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                      
                      // Adjust startPage if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1)
                      }
                      
                      // Always show first page
                      if (startPage > 1) {
                        pages.push(
                          <PaginationItem key={1}>
                            <PaginationButton 
                              isActive={1 === currentPage}
                              onClick={() => handlePageChange(1)}
                            >
                              1
                            </PaginationButton>
                          </PaginationItem>
                        )
                        
                        if (startPage > 2) {
                          pages.push(
                            <PaginationItem key="ellipsis-start">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                      }
                      
                      // Add visible pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationButton 
                              isActive={i === currentPage}
                              onClick={() => handlePageChange(i)}
                            >
                              {i}
                            </PaginationButton>
                          </PaginationItem>
                        )
                      }
                      
                      // Always show last page
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <PaginationItem key="ellipsis-end">
                              <PaginationEllipsis />
                            </PaginationItem>
                          )
                        }
                        
                        pages.push(
                          <PaginationItem key={totalPages}>
                            <PaginationButton 
                              isActive={totalPages === currentPage}
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </PaginationButton>
                          </PaginationItem>
                        )
                      }
                      
                      return pages
                    })()}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p>No results found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
