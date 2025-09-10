'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import Link from 'next/link'
import { tmdbClient, getImageUrl } from '@/lib/tmdb'
import type { ITMDBMovie, ITMDBTVShow } from '@/types'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationButton, PaginationEllipsis } from '@/components/ui/pagination'
import { PageHeader } from '@/components/PageHeader'
import { SearchAndFilter, ALL_VALUE } from '@/components/SearchAndFilter'
import { Badge } from '@/components/ui/badge'

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
  const [availableGenres, setAvailableGenres] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<string[]>([])

  // Extract unique genres from the items
  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    comingSoonItems.forEach(item => {
      item.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [comingSoonItems]);

  // Generate years for the next 10 years
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => (currentYear + i).toString());
  }, []);

  // Update available genres and years when data loads
  useEffect(() => {
    setAvailableGenres(allGenres);
    setAvailableYears(years);
  }, [allGenres, years]);

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

  // Filter items
  const filteredItems = useMemo(() => {
    return comingSoonItems.filter(item => {
      // Filter by search term
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by genre
      if (selectedGenre && selectedGenre !== ALL_VALUE && !item.genre.includes(selectedGenre)) {
        return false;
      }
      
      // Filter by year
      if (selectedYear && selectedYear !== ALL_VALUE) {
        const itemYear = new Date(item.releaseDate).getFullYear().toString();
        if (itemYear !== selectedYear) {
          return false;
        }
      }
      
      // Filter by type
      if (selectedType !== 'all' && item.type !== selectedType) {
        return false;
      }
      
      return true;
    });
  }, [comingSoonItems, searchTerm, selectedGenre, selectedYear, selectedType]);

  // Sort items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'score':
          comparison = a.anticipationScore - b.anticipationScore;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredItems, sortBy, sortOrder]);

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
        <PageHeader 
          title="Coming Soon" 
          description="Discover upcoming horror movies and TV shows that will send chills down your spine."
        />
        
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          availableGenres={availableGenres}
          availableYears={availableYears}
          className="mb-8"
        />

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : sortedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.type === 'movie' ? `/details/movie/${item.originalData.id}` : `/tv/${item.originalData.id}`}
                  className="group relative cursor-pointer transition-all duration-300 hover:scale-105 block"
                >
                  <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-primary transition-colors h-full flex flex-col">
                    <div className="relative aspect-[2/3] w-full">
                      <Image
                        src={item.poster || '/placeholder.svg'}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    <Badge variant="secondary" className="text-xs absolute top-2 right-2">
                    { item.type.toUpperCase() }
                  </Badge>
                  </div>
                  <CardHeader className="flex-1 p-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold line-clamp-2">
                        {item.title}
                      </CardTitle>

                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.genre.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="outline" className="bg-slate-800 text-xs">
                          { genre }
                        </Badge>
                      ))}
                      {/* {item.genre.length > 2 && (
                        <Badge variant="outline" className="bg-slate-800 text-xs">
                        +{item.genre.length - 2}
                        </Badge>
                        )} */}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      {/* <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{item.anticipationScore}% Anticipation</span>
                        </div> */}
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      { item.description }
                    </p>
                    <div className="flex gap-1 mt-6 text-xs">
                      <Calendar className="h-4 w-4" />
                      <span>{formatReleaseDate(item.releaseDate)}</span>
                    </div>
                  </CardContent>
                </Card>
                </Link>
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
          <div className="text-center py-12">
            <p className="text-gray-400">No results found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
