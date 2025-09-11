"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"
import { tmdbClient } from "@/lib/tmdb"
import { PageLayout } from "@/components/PageLayout"
import { ITMDBMovie } from "@/types/api/ITMDBMovie"
import { ITMDBMovieDetails }  from "@/types/api/ITMDBMovieDetails"
import { ITopRatedMovie } from "@/types/ITopRatedMovie"

// TMDB Genre ID mappings for horror subgenres
const GENRE_MAPPINGS: Record<number, string[]> = {
  27: ['Horror'], // Horror
  53: ['Thriller'], // Thriller
  18: ['Drama'], // Drama
  878: ['Sci-Fi'], // Science Fiction
  14: ['Fantasy'], // Fantasy
  9648: ['Mystery'], // Mystery
  // 80: ['Crime'], // Crime
  // 35: ['Comedy'] // Comedy
}

// Convert TMDB movie to TopRatedMovie format
function tmdbMovieToTopRatedMovie(movie: ITMDBMovie, details?: ITMDBMovieDetails): ITopRatedMovie {
  const year = new Date(movie.release_date).getFullYear()
  const genres = movie.genre_ids.flatMap(id => GENRE_MAPPINGS[id] || [])
  const director = details?.credits?.crew.find(person => person.job === 'Director')?.name || 'Unknown'
  const duration = details?.runtime ? `${details.runtime} min` : 'Unknown'
  
  return {
    id: movie.id,
    title: movie.title,
    description: movie.overview || 'No description available.',
    posterUrl: movie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    rating: Number(movie.vote_average.toFixed(1)),
    year,
    duration,
    director,
    genre: genres.length > 0 ? genres : ['Horror'],
    genreIds: movie.genre_ids,
    slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    originalLanguage: movie.original_language
  }
}

export default function TopRatedPage() {
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedDecade, setSelectedDecade] = useState("All")
  const [sortBy, setSortBy] = useState<"rating" | "date" | "title" | "score" | "popularity">("rating")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [allTopRatedMovies, setAllTopRatedMovies] = useState<ITopRatedMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique genres and decades for filters
  const availableGenres = useMemo(() => {
    const genres = new Set<string>(["All"])
    allTopRatedMovies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g))
    })
    return Array.from(genres).sort()
  }, [allTopRatedMovies])

  const availableDecades = useMemo(() => {
    const decades = new Set<string>(["All"])
    allTopRatedMovies.forEach(movie => {
      if (movie.year) {
        const decade = `${Math.floor(movie.year / 10) * 10}s`
        decades.add(decade)
      }
    })
    return Array.from(decades).sort((a, b) => b.localeCompare(a))
  }, [allTopRatedMovies])

  // Fetch movies with error handling and loading states
  const fetchMovies = async (page: number, reset: boolean = false) => {
    try {
      if (reset) setLoading(true)
      else setLoadingMore(true)
      
      const moviesResponse = await tmdbClient.getTopRatedHorrorMovies(page)
      const moviesWithDetails = await Promise.all(
        moviesResponse.results.map(async (movie) => {
          try {
            const details = await tmdbClient.getMovieDetails(movie.id)
            return tmdbMovieToTopRatedMovie(movie, details)
          } catch (error) {
            console.error(`Error fetching details for movie ${movie.id}:`, error)
            return tmdbMovieToTopRatedMovie(movie)
          }
        })
      )
      
      setAllTopRatedMovies(prev => 
        reset ? moviesWithDetails : [...prev, ...moviesWithDetails]
      )
      setHasMorePages(moviesResponse.page < moviesResponse.total_pages)
      setError(null)
    } catch (err) {
      console.error("Error fetching top rated movies:", err)
      setError("Failed to load movies. Please try again later.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchMovies(1, true)
  }, [])

  // Filter and sort movies
  const filteredAndSortedMovies = useMemo(() => {
    return allTopRatedMovies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre)
        const matchesDecade = selectedDecade === "All" || 
                            movie.year.toString().startsWith(selectedDecade.slice(0, 3))
        return matchesSearch && matchesGenre && matchesDecade
      })
      .sort((a, b) => {
        let comparison = 0
        
        if (sortBy === "rating") {
          comparison = a.rating - b.rating
        } else if (sortBy === "date") {
          comparison = (a.year || 0) - (b.year || 0)
        } else if (sortBy === "title") {
          comparison = a.title.localeCompare(b.title)
        }
        
        return sortOrder === "desc" ? -comparison : comparison
      })
  }, [allTopRatedMovies, searchTerm, selectedGenre, selectedDecade, sortBy, sortOrder])

  // Handle loading more
  const handleLoadMore = () => {
    if (!loadingMore && hasMorePages) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchMovies(nextPage)
    }
  }

  return (
    <PageLayout
      title="Top Rated Horror Movies"
      description="Discover the most highly rated horror movies of all time"
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      selectedGenre={selectedGenre}
      onGenreChange={setSelectedGenre}
      selectedYear={selectedDecade}
      onYearChange={setSelectedDecade}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      sortOrder={sortOrder}
      onSortOrderChange={setSortOrder}
      availableGenres={availableGenres}
      availableYears={availableDecades}
      showFilters={showFilters}
      onToggleFilters={() => setShowFilters(!showFilters)}
    >
      {loading && !loadingMore ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => fetchMovies(1, true)}>Retry</Button>
        </div>
      ) : filteredAndSortedMovies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAndSortedMovies.map((movie) => (
              <Link key={movie.id} href={`/details/movie/${movie.id}`}>
                <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-primary transition-colors h-full flex flex-col">
                  <div className="relative aspect-[2/3] w-full">
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <CardHeader className="flex-1 p-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold line-clamp-2">
                        {movie.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {movie.year}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{movie.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {movie.genre.slice(0, 2).map((g) => (
                        <Badge key={g} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                      {movie.genre.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{movie.genre.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{movie.duration}</span>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {movie.director}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {movie.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {hasMorePages && !loading && (
            <div className="mt-8 text-center">
              <Button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                variant="outline"
                className="mx-auto"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No movies found. Try adjusting your filters.</p>
        </div>
      )}
    </PageLayout>
  )
}
