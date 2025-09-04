import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Star, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ComingSoonMovie {
  id: string
  title: string
  description: string
  posterUrl: string
  releaseDate: string
  director: string
  genre: string[]
  anticipationScore: number
  trailerUrl?: string
  slug: string
}

interface ComingSoonProps {
  movies?: ComingSoonMovie[]
}

const defaultMovies: ComingSoonMovie[] = [
  {
    id: "1",
    title: "The Conjuring 4",
    description: "The Warrens return for their most terrifying case yet, investigating a series of supernatural events that threaten to tear apart a small town.",
    posterUrl: "/api/placeholder/300/450",
    releaseDate: "2024-10-31",
    director: "James Wan",
    genre: ["Supernatural", "Horror"],
    anticipationScore: 9.2,
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slug: "the-conjuring-4"
  },
  {
    id: "2",
    title: "Evil Dead Rise 2",
    description: "The deadites return in this highly anticipated sequel that promises to push the boundaries of horror even further.",
    posterUrl: "/api/placeholder/300/450",
    releaseDate: "2024-08-15",
    director: "Lee Cronin",
    genre: ["Horror", "Thriller"],
    anticipationScore: 8.8,
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slug: "evil-dead-rise-2"
  },
  {
    id: "3",
    title: "Hereditary 2: Bloodline",
    description: "Ari Aster returns with a chilling continuation that explores the dark family legacy left behind.",
    posterUrl: "/api/placeholder/300/450",
    releaseDate: "2024-12-20",
    director: "Ari Aster",
    genre: ["Psychological Horror", "Drama"],
    anticipationScore: 9.5,
    slug: "hereditary-2-bloodline"
  },
  {
    id: "4",
    title: "The Nun 3",
    description: "Sister Irene faces her most dangerous encounter yet as the demonic nun returns with vengeance.",
    posterUrl: "/api/placeholder/300/450",
    releaseDate: "2024-09-13",
    director: "Michael Chaves",
    genre: ["Supernatural", "Horror"],
    anticipationScore: 7.9,
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slug: "the-nun-3"
  }
]

function formatReleaseDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

function getDaysUntilRelease(dateString: string): number {
  const releaseDate = new Date(dateString)
  const today = new Date()
  const diffTime = releaseDate.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function ComingSoon({ movies = defaultMovies }: ComingSoonProps) {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get ready for the most anticipated horror movies hitting theaters soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            const daysUntil = getDaysUntilRelease(movie.releaseDate)
            const isReleased = daysUntil <= 0
            
            return (
              <Card key={movie.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isReleased ? (
                      <Badge className="bg-green-600 text-white">Now Available</Badge>
                    ) : (
                      <Badge className="bg-red-600 text-white">
                        {daysUntil} days left
                      </Badge>
                    )}
                    
                    <div className="flex items-center bg-black/70 rounded px-2 py-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-white text-xs font-semibold">
                        {movie.anticipationScore}/10
                      </span>
                    </div>
                  </div>

                  {movie.trailerUrl && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        asChild
                      >
                        <Link href={movie.trailerUrl} target="_blank">
                          Watch Trailer
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatReleaseDate(movie.releaseDate)}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                    {movie.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {movie.genre.map((g) => (
                      <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Director: {movie.director}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
                    >
                      <Bell className="w-3 h-3 mr-1" />
                      Notify Me
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      asChild
                    >
                      <Link href={`/movies/${movie.slug}`}>
                        More Info
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/coming-soon" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Upcoming Movies
          </Link>
        </div>
      </div>
    </section>
  )
}
