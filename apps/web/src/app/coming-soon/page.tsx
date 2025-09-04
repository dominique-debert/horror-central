'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, Star, Filter, Search, SortAsc, SortDesc, Tv, Film } from 'lucide-react'
import { tmdbClient, getImageUrl } from '@/lib/tmdb'
import type { TMDBMovie, TMDBTVShow } from '@/lib/tmdb'
import Image from 'next/image'

interface ComingSoonItem {
  id: string
  title: string
  releaseDate: string
  genre: string[]
  poster: string
  anticipationScore: number
  description: string
  type: 'movie' | 'tv'
  originalData: TMDBMovie | TMDBTVShow
}

export default function ComingSoonPage() {
  const [comingSoonItems, setComingSoonItems] = useState<ComingSoonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
        
        const [moviesResponse, tvShowsResponse, movieGenres, tvGenres] = await Promise.all([
          tmdbClient.getUpcomingHorrorMovies(1),
          tmdbClient.getUpcomingHorrorTVShows(1),
          tmdbClient.getMovieGenres(),
          tmdbClient.getTVGenres()
        ])

        // Convert movies to ComingSoonItem format
        const movieItems: ComingSoonItem[] = moviesResponse.results
          .filter(movie => 
            movie.genre_ids.includes(27) && // Must be horror
            !movie.genre_ids.includes(16) // Must not be animation
          )
          .slice(0, 12)
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

        // Convert TV shows to ComingSoonItem format
        const tvItems: ComingSoonItem[] = tvShowsResponse.results
          .filter(show => {
            const overview = show.overview.toLowerCase()
            const name = show.name.toLowerCase()
            const horrorKeywords = ['horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 'haunted', 'scary', 'terror', 'evil', 'dark', 'sinister']
            return horrorKeywords.some(keyword => overview.includes(keyword) || name.includes(keyword))
          })
          .slice(0, 8)
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

        setComingSoonItems([...movieItems, ...tvItems])
      } catch (err) {
        console.error('Error fetching coming soon content:', err)
        setError('Failed to load coming soon content. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchComingSoonContent()
  }, [])

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Coming Soon</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover upcoming horror movies and TV shows that will keep you on the edge of your seat
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search titles or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-700 text-white hover:bg-gray-800"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-900 rounded-lg">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-300">Type</Label>
                <select
                  id="type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'all' | 'movie' | 'tv')}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="all">All</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Shows</option>
                </select>
              </div>
              <div>
                <Label htmlFor="genre" className="text-sm font-medium text-gray-300">Genre</Label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="">All Genres</option>
                  {availableGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="year" className="text-sm font-medium text-gray-300">Year</Label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="sortBy" className="text-sm font-medium text-gray-300">Sort By</Label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'score')}
                  className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
                >
                  <option value="date">Release Date</option>
                  <option value="title">Title</option>
                  <option value="score">Score</option>
                </select>
              </div>
              <div>
                <Label htmlFor="sortOrder" className="text-sm font-medium text-gray-300">Order</Label>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-full mt-1 border-gray-700 text-white hover:bg-gray-800"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                  {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredAndSortedItems.length} upcoming horror {selectedType === 'all' ? 'titles' : selectedType === 'movie' ? 'movies' : 'TV shows'}
          </p>
        </div>

        {/* Content Grid */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No upcoming content found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedGenre('')
                setSelectedYear('')
                setSelectedType('all')
              }}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item) => {
              const daysUntil = getDaysUntilRelease(item.releaseDate)
              
              return (
                <Card key={item.id} className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors group">
                  <div className="relative">
                    <Image
                      src={item.poster}
                      alt={item.title}
                      width={400}
                      height={600}
                      className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge className={`${item.type === 'movie' ? 'bg-blue-600' : 'bg-purple-600'} text-white`}>
                        {item.type === 'movie' ? <Film className="h-3 w-3 mr-1" /> : <Tv className="h-3 w-3 mr-1" />}
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-red-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        {item.anticipationScore}
                      </Badge>
                    </div>
                    {daysUntil > 0 && (
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-yellow-600 text-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil} days
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatReleaseDate(item.releaseDate)}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.genre.slice(0, 3).map((g: string) => (
                        <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      More Info
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
