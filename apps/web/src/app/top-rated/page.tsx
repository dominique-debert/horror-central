"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Calendar, Clock, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface TopRatedMovie {
  id: string
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  duration: string
  director: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
}

const allTopRatedMovies: TopRatedMovie[] = [
  {
    id: "1",
    title: "The Exorcist",
    description: "A classic supernatural horror that redefined the genre and continues to terrify audiences decades after its release.",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 9.1,
    year: 1973,
    duration: "122 min",
    director: "William Friedkin",
    genre: ["Supernatural", "Horror", "Drama"],
    awards: ["Academy Award Winner", "Golden Globe Winner"],
    criticsScore: 84,
    audienceScore: 87,
    slug: "the-exorcist"
  },
  {
    id: "2",
    title: "Get Out",
    description: "Jordan Peele's directorial debut brilliantly combines social commentary with psychological horror to create a modern classic.",
    posterUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 8.9,
    year: 2017,
    duration: "104 min",
    director: "Jordan Peele",
    genre: ["Psychological Horror", "Thriller"],
    awards: ["Academy Award Winner", "BAFTA Winner"],
    criticsScore: 98,
    audienceScore: 86,
    slug: "get-out"
  },
  {
    id: "3",
    title: "Hereditary",
    description: "A modern masterpiece that explores family trauma through the lens of supernatural horror with stunning cinematography.",
    posterUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 2018,
    duration: "127 min",
    director: "Ari Aster",
    genre: ["Psychological Horror", "Drama"],
    awards: ["Critics Choice Award"],
    criticsScore: 89,
    audienceScore: 72,
    slug: "hereditary"
  },
  {
    id: "4",
    title: "The Babadook",
    description: "An Australian psychological horror that uses grief and motherhood to create one of the most effective horror films of the decade.",
    posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 2014,
    duration: "94 min",
    director: "Jennifer Kent",
    genre: ["Psychological Horror", "Drama"],
    awards: ["AACTA Award Winner"],
    criticsScore: 98,
    audienceScore: 85,
    slug: "the-babadook"
  },
  {
    id: "5",
    title: "The Witch",
    description: "A period piece that authentically captures the paranoia and superstition of 1630s New England with meticulous detail.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.3,
    year: 2015,
    duration: "92 min",
    director: "Robert Eggers",
    genre: ["Period Horror", "Supernatural"],
    awards: ["Sundance Film Festival Winner"],
    criticsScore: 90,
    audienceScore: 58,
    slug: "the-witch"
  },
  {
    id: "6",
    title: "Midsommar",
    description: "A daylight nightmare that subverts horror conventions with its bright, beautiful, and utterly disturbing imagery.",
    posterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.1,
    year: 2019,
    duration: "148 min",
    director: "Ari Aster",
    genre: ["Folk Horror", "Drama"],
    awards: ["Saturn Award Winner"],
    criticsScore: 83,
    audienceScore: 63,
    slug: "midsommar"
  },
  {
    id: "7",
    title: "The Conjuring",
    description: "Ed and Lorraine Warren investigate a haunted farmhouse in this expertly crafted supernatural horror that launched a franchise.",
    posterUrl: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=300&h=450&fit=crop",
    rating: 8.0,
    year: 2013,
    duration: "112 min",
    director: "James Wan",
    genre: ["Supernatural", "Horror"],
    awards: ["People's Choice Award"],
    criticsScore: 86,
    audienceScore: 83,
    slug: "the-conjuring"
  },
  {
    id: "8",
    title: "It Follows",
    description: "A unique and haunting horror film that uses STD metaphors to create an unforgettable supernatural threat.",
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop",
    rating: 7.9,
    year: 2014,
    duration: "100 min",
    director: "David Robert Mitchell",
    genre: ["Supernatural", "Thriller"],
    awards: ["Independent Spirit Award Nominee"],
    criticsScore: 95,
    audienceScore: 66,
    slug: "it-follows"
  },
  {
    id: "9",
    title: "A Quiet Place",
    description: "A family must live in silence to avoid creatures that hunt by sound in this innovative and tense thriller.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    rating: 7.8,
    year: 2018,
    duration: "90 min",
    director: "John Krasinski",
    genre: ["Thriller", "Horror", "Sci-Fi"],
    awards: ["SAG Award Winner"],
    criticsScore: 96,
    audienceScore: 83,
    slug: "a-quiet-place"
  }
]

const genres = ["All", "Supernatural", "Psychological Horror", "Thriller", "Drama", "Folk Horror", "Period Horror", "Sci-Fi"]
const decades = ["All", "1970s", "2010s", "2020s"]

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

  const filteredMovies = allTopRatedMovies
    .filter(movie => {
      const matchesGenre = selectedGenre === "All" || movie.genre.includes(selectedGenre)
      const decade = Math.floor(movie.year / 10) * 10
      const matchesDecade = selectedDecade === "All" || 
        (selectedDecade === "1970s" && decade === 1970) ||
        (selectedDecade === "2010s" && decade === 2010) ||
        (selectedDecade === "2020s" && decade === 2020)
      return matchesGenre && matchesDecade
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "year") return b.year - a.year
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return 0
    })

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
            Showing {filteredMovies.length} movies
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map((movie, index) => (
            <Card key={movie.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group relative">
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
              )}
              
              <div className="flex">
                <div className="relative w-32 flex-shrink-0">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="w-full h-48 object-cover rounded-l-lg"
                  />
                </div>
                
                <CardContent className="p-4 flex-1 flex flex-col">
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
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">
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
                    className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white mt-auto"
                    asChild
                  >
                    <Link href={`/movies/${movie.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
