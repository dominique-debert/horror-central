'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, Star, Filter, Search, SortAsc, SortDesc } from 'lucide-react'

interface Movie {
  id: number
  title: string
  releaseDate: string
  genre: string[]
  director: string
  poster: string
  anticipationScore: number
  description: string
  runtime: string
  rating: string
  studio: string
  trailer?: string
}

const upcomingMovies: Movie[] = [
  {
    id: 1,
    title: "The Conjuring 4",
    releaseDate: "2024-10-31",
    genre: ["Supernatural", "Horror"],
    director: "Michael Chaves",
    poster: "https://images.unsplash.com/photo-1578662015928-3dae4d2bc4d5?w=400&h=600&fit=crop",
    anticipationScore: 92,
    description: "Ed and Lorraine Warren return for their most terrifying case yet.",
    runtime: "112 min",
    rating: "R",
    studio: "Warner Bros"
  },
  {
    id: 2,
    title: "Scream VII",
    releaseDate: "2024-12-20",
    genre: ["Slasher", "Horror"],
    director: "Matt Bettinelli-Olpin",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    anticipationScore: 88,
    description: "Ghostface returns to terrorize a new generation in Woodsboro.",
    runtime: "118 min",
    rating: "R",
    studio: "Paramount Pictures"
  },
  {
    id: 3,
    title: "A Quiet Place: Day One",
    releaseDate: "2024-06-28",
    genre: ["Thriller", "Horror", "Sci-Fi"],
    director: "Michael Sarnoski",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    anticipationScore: 85,
    description: "Experience the first day of the alien invasion that changed everything.",
    runtime: "99 min",
    rating: "PG-13",
    studio: "Paramount Pictures"
  },
  {
    id: 4,
    title: "Insidious 6",
    releaseDate: "2024-08-15",
    genre: ["Supernatural", "Horror"],
    director: "Patrick Wilson",
    poster: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=600&fit=crop",
    anticipationScore: 79,
    description: "The Lambert family faces new demons from The Further.",
    runtime: "105 min",
    rating: "PG-13",
    studio: "Sony Pictures"
  },
  {
    id: 5,
    title: "Evil Dead Rise 2",
    releaseDate: "2025-04-18",
    genre: ["Horror", "Gore"],
    director: "Lee Cronin",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop",
    anticipationScore: 91,
    description: "The Deadites return with more blood and terror than ever before.",
    runtime: "97 min",
    rating: "R",
    studio: "New Line Cinema"
  },
  {
    id: 6,
    title: "The Nun 3",
    releaseDate: "2024-09-06",
    genre: ["Supernatural", "Horror"],
    director: "Corin Hardy",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    anticipationScore: 76,
    description: "Sister Irene confronts Valak once more in this terrifying sequel.",
    runtime: "108 min",
    rating: "R",
    studio: "Warner Bros"
  },
  {
    id: 7,
    title: "Smile 2",
    releaseDate: "2024-10-18",
    genre: ["Psychological", "Horror"],
    director: "Parker Finn",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    anticipationScore: 83,
    description: "The curse spreads to new victims in this chilling sequel.",
    runtime: "115 min",
    rating: "R",
    studio: "Paramount Pictures"
  },
  {
    id: 8,
    title: "Terrifier 4",
    releaseDate: "2024-10-31",
    genre: ["Slasher", "Horror", "Gore"],
    director: "Damien Leone",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop",
    anticipationScore: 87,
    description: "Art the Clown returns for his most brutal killing spree yet.",
    runtime: "138 min",
    rating: "Unrated",
    studio: "Cineverse"
  },
  {
    id: 9,
    title: "The Exorcist: Deceiver",
    releaseDate: "2025-04-18",
    genre: ["Supernatural", "Horror"],
    director: "David Gordon Green",
    poster: "https://images.unsplash.com/photo-1578662015928-3dae4d2bc4d5?w=400&h=600&fit=crop",
    anticipationScore: 80,
    description: "The battle between good and evil continues in this new chapter.",
    runtime: "111 min",
    rating: "R",
    studio: "Universal Pictures"
  },
  {
    id: 10,
    title: "Hereditary 2",
    releaseDate: "2025-06-13",
    genre: ["Psychological", "Horror", "Supernatural"],
    director: "Ari Aster",
    poster: "https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=400&h=600&fit=crop",
    anticipationScore: 94,
    description: "Ari Aster returns with another mind-bending family nightmare.",
    runtime: "127 min",
    rating: "R",
    studio: "A24"
  },
  {
    id: 11,
    title: "It: Chapter Three",
    releaseDate: "2025-09-05",
    genre: ["Supernatural", "Horror"],
    director: "Andy Muschietti",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    anticipationScore: 89,
    description: "Pennywise returns to terrorize Derry once more.",
    runtime: "149 min",
    rating: "R",
    studio: "Warner Bros"
  },
  {
    id: 12,
    title: "The Babadook 2",
    releaseDate: "2025-10-31",
    genre: ["Psychological", "Horror"],
    director: "Jennifer Kent",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    anticipationScore: 92,
    description: "The Babadook haunts a new family in this highly anticipated sequel.",
    runtime: "104 min",
    rating: "R",
    studio: "IFC Films"
  }
]

const genres = ["All", "Horror", "Supernatural", "Slasher", "Psychological", "Thriller", "Sci-Fi", "Gore"]
const releaseYears = ["All", "2024", "2025"]
const sortOptions = [
  { value: "releaseDate", label: "Release Date" },
  { value: "anticipationScore", label: "Anticipation Score" },
  { value: "title", label: "Title" }
]

export default function ComingSoonPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedYear, setSelectedYear] = useState("All")
  const [sortBy, setSortBy] = useState("releaseDate")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = upcomingMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre)
      const movieYear = new Date(movie.releaseDate).getFullYear().toString()
      const matchesYear = selectedYear === "All" || movieYear === selectedYear
      
      return matchesSearch && matchesGenre && matchesYear
    })

    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Movie]
      let bValue: any = b[sortBy as keyof Movie]

      if (sortBy === "releaseDate") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [searchTerm, selectedGenre, selectedYear, sortBy, sortOrder])

  const formatReleaseDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getDaysUntilRelease = (dateString: string) => {
    const releaseDate = new Date(dateString)
    const today = new Date()
    const diffTime = releaseDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 to-black border-b border-red-900/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Coming Soon</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Get ready for the most anticipated horror movies hitting theaters soon. 
            Mark your calendars for these spine-chilling experiences.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies or directors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div>
                <Label htmlFor="genre" className="text-sm font-medium text-gray-300">Genre</Label>
                <select
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="year" className="text-sm font-medium text-gray-300">Release Year</Label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  {releaseYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="sort" className="text-sm font-medium text-gray-300">Sort By</Label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full mt-1 p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-300">Order</Label>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full mt-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredAndSortedMovies.length} of {upcomingMovies.length} upcoming movies
          </p>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMovies.map((movie) => {
            const daysUntilRelease = getDaysUntilRelease(movie.releaseDate)
            
            return (
              <Card key={movie.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      {movie.anticipationScore}%
                    </Badge>
                    {daysUntilRelease > 0 && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400 bg-black/50">
                        <Clock className="w-3 h-3 mr-1" />
                        {daysUntilRelease} days
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="border-gray-500 text-gray-300 bg-black/50">
                      {movie.rating}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-400 gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatReleaseDate(movie.releaseDate)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="outline" className="text-xs border-red-600 text-red-400">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {movie.description}
                  </p>
                  
                  <div className="space-y-1 text-xs text-gray-400">
                    <p><span className="font-medium">Director:</span> {movie.director}</p>
                    <p><span className="font-medium">Runtime:</span> {movie.runtime}</p>
                    <p><span className="font-medium">Studio:</span> {movie.studio}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => window.open(`/movies/${movie.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`, '_blank')}
                  >
                    More Info
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredAndSortedMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedGenre("All")
                setSelectedYear("All")
              }}
              className="mt-4 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
