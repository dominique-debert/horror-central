"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { tmdbClient, TMDBMovie, TMDBMovieDetails } from "@/lib/tmdb"

interface TopRatedMovie {
  id: number
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  duration: string
  director: string
  genre: string[]
  genreIds: number[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
  originalLanguage: string
}

// TMDB Genre ID mappings for horror subgenres
const GENRE_MAPPINGS: Record<number, string[]> = {
  27: ['Horror'], // Horror
  53: ['Thriller'], // Thriller
  18: ['Drama'], // Drama
  878: ['Sci-Fi'], // Science Fiction
  14: ['Fantasy'], // Fantasy
  9648: ['Mystery'], // Mystery
  80: ['Crime'], // Crime
  35: ['Comedy'] // Comedy
}

// Convert TMDB movie to TopRatedMovie format
function tmdbMovieToTopRatedMovie(movie: TMDBMovie, details?: TMDBMovieDetails): TopRatedMovie {
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


const genres = ["All", "Horror", "Thriller", "Drama", "Sci-Fi", "Fantasy", "Mystery", "Crime"]
const decades = ["All", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "text-green-400"
  if (rating >= 8.0) return "text-yellow-400"
  if (rating >= 7.0) return "text-orange-400"
  return "text-red-400"
}

export default function TopRatedPage() {
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedDecade, setSelectedDecade] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [allTopRatedMovies, setAllTopRatedMovies] = useState<TopRatedMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const MOVIES_PER_PAGE = 20

  // Fetch initial movies
  useEffect(() => {
    fetchMovies(1, true)
  }, [])

  // Reset and refetch when filters change
  useEffect(() => {
    if (allTopRatedMovies.length > 0) {
      setCurrentPage(1)
      setAllTopRatedMovies([])
      setHasMorePages(true)
      fetchMovies(1, true)
    }
  }, [selectedGenre, selectedDecade, sortBy])

  async function fetchMovies(page: number, isInitial: boolean = false) {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)
      
      // Determine sort order based on sortBy state
      let apiSortBy: 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc' = 'vote_average.desc'
      if (sortBy === 'year') apiSortBy = 'primary_release_date.desc'
      else if (sortBy === 'title') apiSortBy = 'title.asc'
      
      // Determine genre filter
      let genreIds: number[] | undefined
      if (selectedGenre !== 'All') {
        const genreMap: Record<string, number> = {
          'Horror': 27,
          'Thriller': 53,
          'Drama': 18,
          'Sci-Fi': 878,
          'Fantasy': 14,
          'Mystery': 9648,
          'Crime': 80
        }
        genreIds = [genreMap[selectedGenre]]
      }
      
      // Determine year range for decade filter
      let minYear: number | undefined
      let maxYear: number | undefined
      if (selectedDecade !== 'All') {
        const decade = parseInt(selectedDecade.replace('s', ''))
        minYear = decade
        maxYear = decade + 9
      }
      
      const response = await tmdbClient.getAllTimeTopRatedHorrorMovies({
        page,
        sortBy: apiSortBy,
        genreIds,
        minYear,
        maxYear
      })
      
      // Convert TMDB movies to our format
      const convertedMovies = response.results
        .map((movie: TMDBMovie) => tmdbMovieToTopRatedMovie(movie))
        .filter(movie => movie.rating >= 6.0) // Quality threshold
      
      if (isInitial) {
        setAllTopRatedMovies(convertedMovies)
      } else {
        setAllTopRatedMovies(prev => {
          // Remove duplicates when adding new movies
          const existingIds = new Set(prev.map(m => m.id))
          const newMovies = convertedMovies.filter(m => !existingIds.has(m.id))
          return [...prev, ...newMovies]
        })
      }
      
      // Check if there are more pages
      setHasMorePages(page < response.total_pages && convertedMovies.length > 0)
      
    } catch (err) {
      console.error('Error fetching top-rated movies:', err)
      setError('Failed to load top-rated movies. Please try again later.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function handleLoadMore() {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchMovies(nextPage, false)
  }

  // Display movies with pagination
  const displayedMovies = allTopRatedMovies.slice(0, currentPage * MOVIES_PER_PAGE)
  const hasMoreToShow = displayedMovies.length < allTopRatedMovies.length || hasMorePages

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Top Rated Horror Movies</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Discover the highest-rated horror movies of all time, curated by critics and audiences. 
            From classic supernatural thrillers to modern psychological masterpieces.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-400 mr-2">Genre:</span>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                  className={selectedGenre === genre 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {genre}
                </Button>
              ))}
            </div>

            {/* Decade & Sort */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400">Decade:</span>
                {decades.map((decade) => (
                  <Button
                    key={decade}
                    variant={selectedDecade === decade ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDecade(decade)}
                    className={selectedDecade === decade 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }
                  >
                    {decade}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-900 border border-gray-700 rounded px-3 py-1 text-white text-sm"
                >
                  <option value="rating">Rating</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Showing {displayedMovies.length} movies
            {hasMoreToShow && (
              <span className="ml-2 text-gray-500">
                (More available)
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-400">Loading top-rated horror movies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedMovies.map((movie, index) => (
                <Card key={movie.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  width={300}
                  height={450}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className={`font-bold ${getRatingColor(movie.rating)}`}>
                      {movie.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{movie.year}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{movie.duration}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {movie.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {movie.genre.slice(0, 2).map((g) => (
                    <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {g}
                    </Badge>
                  ))}
                </div>
                
                {movie.awards && movie.awards.length > 0 && (
                  <div className="flex items-center mb-3">
                    <Award className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400 truncate">
                      {movie.awards[0]}
                    </span>
                  </div>
                )}
                
                {(movie.criticsScore || movie.audienceScore) && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {movie.criticsScore && (
                      <span>Critics: {movie.criticsScore}%</span>
                    )}
                    {movie.audienceScore && (
                      <span>Audience: {movie.audienceScore}%</span>
                    )}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
                  asChild
                >
                  <Link href={`/movies/${movie.slug}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMoreToShow && (
              <div className="text-center mt-12">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Loading More...
                    </>
                  ) : (
                    'View More Movies'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
