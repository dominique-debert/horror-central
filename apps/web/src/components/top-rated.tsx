import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Calendar, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

interface TopRatedProps {
  movies?: TopRatedMovie[]
}

const defaultMovies: TopRatedMovie[] = [
  {
    id: "1",
    title: "The Exorcist",
    description: "A classic supernatural horror that redefined the genre and continues to terrify audiences decades after its release.",
    posterUrl: "/api/placeholder/300/450",
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
    title: "Hereditary",
    description: "A modern masterpiece that explores family trauma through the lens of supernatural horror with stunning cinematography.",
    posterUrl: "/api/placeholder/300/450",
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
    id: "3",
    title: "The Babadook",
    description: "An Australian psychological horror that uses grief and motherhood to create one of the most effective horror films of the decade.",
    posterUrl: "/api/placeholder/300/450",
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
    id: "4",
    title: "The Witch",
    description: "A period piece that authentically captures the paranoia and superstition of 1630s New England with meticulous detail.",
    posterUrl: "/api/placeholder/300/450",
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
    id: "5",
    title: "Midsommar",
    description: "A daylight nightmare that subverts horror conventions with its bright, beautiful, and utterly disturbing imagery.",
    posterUrl: "/api/placeholder/300/450",
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
    id: "6",
    title: "Get Out",
    description: "Jordan Peele's directorial debut brilliantly combines social commentary with psychological horror to create a modern classic.",
    posterUrl: "/api/placeholder/300/450",
    rating: 8.9,
    year: 2017,
    duration: "104 min",
    director: "Jordan Peele",
    genre: ["Psychological Horror", "Thriller"],
    awards: ["Academy Award Winner", "BAFTA Winner"],
    criticsScore: 98,
    audienceScore: 86,
    slug: "get-out"
  }
]

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "text-green-400"
  if (rating >= 8.0) return "text-yellow-400"
  if (rating >= 7.0) return "text-orange-400"
  return "text-red-400"
}

export default function TopRated({ movies = defaultMovies }: TopRatedProps) {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest-rated horror movies of all time, curated by critics and audiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
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

        <div className="text-center mt-12">
          <Link 
            href="/top-rated" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Top Rated Movies
          </Link>
        </div>
      </div>
    </section>
  )
}
