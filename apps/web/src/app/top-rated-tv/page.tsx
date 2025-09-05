"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { tmdbClient, TMDBTVShow, TMDBTVDetails } from "@/lib/tmdb"

interface TopRatedTVShow {
  id: number
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  seasons: string
  creator: string
  genre: string[]
  genreIds: number[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
  originalLanguage: string
}

// TMDB Genre ID mappings for TV show subgenres
const GENRE_MAPPINGS: Record<number, string[]> = {
  10765: ['Sci-Fi & Fantasy'], // Sci-Fi & Fantasy
  9648: ['Mystery'], // Mystery
  18: ['Drama'], // Drama
  80: ['Crime'], // Crime
  10759: ['Action & Adventure'], // Action & Adventure
  53: ['Thriller'], // Thriller (if available for TV)
  35: ['Comedy'] // Comedy
}

// Convert TMDB TV show to TopRatedTVShow format
function tmdbTVToTopRatedTVShow(tvShow: TMDBTVShow, details?: TMDBTVDetails): TopRatedTVShow {
  const year = new Date(tvShow.first_air_date).getFullYear()
  const genres = tvShow.genre_ids.flatMap(id => GENRE_MAPPINGS[id] || [])
  const creator = details?.created_by?.[0]?.name || 'Unknown'
  const seasons = details?.number_of_seasons ? `${details.number_of_seasons} seasons` : 'Unknown'
  
  return {
    id: tvShow.id,
    title: tvShow.name,
    description: tvShow.overview || 'No description available.',
    posterUrl: tvShow.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
      : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    rating: Number(tvShow.vote_average.toFixed(1)),
    year,
    seasons,
    creator,
    genre: genres.length > 0 ? genres : ['Horror'],
    genreIds: tvShow.genre_ids,
    slug: tvShow.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    originalLanguage: tvShow.original_language
  }
}

const genres = ["All", "Sci-Fi & Fantasy", "Mystery", "Drama", "Crime", "Action & Adventure", "Thriller", "Comedy"]
const decades = ["All", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "text-green-400"
  if (rating >= 8.0) return "text-yellow-400"
  if (rating >= 7.0) return "text-orange-400"
  return "text-red-400"
}

export default function TopRatedTVPage() {
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedDecade, setSelectedDecade] = useState("All")
  const [sortBy, setSortBy] = useState("rating")
  const [allTopRatedTVShows, setAllTopRatedTVShows] = useState<TopRatedTVShow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const SHOWS_PER_PAGE = 20

  // Fetch initial TV shows
  useEffect(() => {
    fetchTVShows(1, true)
  }, [])

  // Reset and refetch when filters change
  useEffect(() => {
    if (allTopRatedTVShows.length > 0) {
      setCurrentPage(1)
      setAllTopRatedTVShows([])
      setHasMorePages(true)
      fetchTVShows(1, true)
    }
  }, [selectedGenre, selectedDecade, sortBy])

  async function fetchTVShows(page: number, isInitial: boolean = false) {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)
      
      // Determine sort order based on sortBy state
      let apiSortBy: 'vote_average.desc' | 'first_air_date.desc' | 'name.asc' = 'vote_average.desc'
      if (sortBy === 'year') apiSortBy = 'first_air_date.desc'
      else if (sortBy === 'title') apiSortBy = 'name.asc'
      
      // Determine genre filter
      let genreIds: number[] | undefined
      if (selectedGenre !== 'All') {
        const genreMap: Record<string, number> = {
          'Sci-Fi & Fantasy': 10765,
          'Mystery': 9648,
          'Drama': 18,
          'Crime': 80,
          'Action & Adventure': 10759,
          'Thriller': 53,
          'Comedy': 35
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
      
      const response = await tmdbClient.getAllTimeTopRatedHorrorTVShows({
        page,
        sortBy: apiSortBy,
        genreIds,
        minYear,
        maxYear
      })
      
      // Convert TMDB TV shows to our format
      const convertedShows = response.results
        .map((tvShow: TMDBTVShow) => tmdbTVToTopRatedTVShow(tvShow))
        .filter((show: TopRatedTVShow) => show.rating >= 6.0) // Quality threshold for TV shows
      
      if (isInitial) {
        setAllTopRatedTVShows(convertedShows)
      } else {
        setAllTopRatedTVShows(prev => {
          // Remove duplicates when adding new shows
          const existingIds = new Set(prev.map(s => s.id))
          const newShows = convertedShows.filter((s: TopRatedTVShow) => !existingIds.has(s.id))
          return [...prev, ...newShows]
        })
      }
      
      // Check if there are more pages
      setHasMorePages(page < response.total_pages && convertedShows.length > 0)
      
    } catch (err) {
      console.error('Error fetching top-rated TV shows:', err)
      setError('Failed to load top-rated TV shows. Please try again later.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function handleLoadMore() {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchTVShows(nextPage, false)
  }

  // Display TV shows with pagination
  const displayedShows = allTopRatedTVShows.slice(0, currentPage * SHOWS_PER_PAGE)
  const hasMoreToShow = displayedShows.length < allTopRatedTVShows.length || hasMorePages

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Top Rated Horror TV Shows</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Discover the highest-rated horror TV shows of all time, from supernatural thrillers to psychological horror series. 
            Binge-worthy shows that will keep you on the edge of your seat.
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
            Showing {displayedShows.length} TV shows
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
            <p className="mt-4 text-gray-400">Loading top-rated horror TV shows...</p>
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

        {/* TV Shows Grid */}
        {!loading && !error && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedShows.map((show, index) => (
                <Card key={show.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              )}
              
              <div className="relative">
                <Image
                  src={show.posterUrl}
                  alt={show.title}
                  width={300}
                  height={450}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors line-clamp-1">
                    {show.title}
                  </h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className={`font-bold ${getRatingColor(show.rating)}`}>
                      {show.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{show.year}</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{show.seasons}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {show.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {show.genre.slice(0, 2).map((g) => (
                    <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {g}
                    </Badge>
                  ))}
                </div>
                
                {show.awards && show.awards.length > 0 && (
                  <div className="flex items-center mb-3">
                    <Award className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400 truncate">
                      {show.awards[0]}
                    </span>
                  </div>
                )}
                
                {(show.criticsScore || show.audienceScore) && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {show.criticsScore && (
                      <span>Critics: {show.criticsScore}%</span>
                    )}
                    {show.audienceScore && (
                      <span>Audience: {show.audienceScore}%</span>
                    )}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
                  asChild
                >
                  <Link href={`/tv/${show.slug}`}>
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
                    'View More TV Shows'
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
