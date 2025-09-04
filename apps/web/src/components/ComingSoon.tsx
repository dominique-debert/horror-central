'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Bell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { tmdbClient, tmdbMovieToMediaItem } from "@/lib/tmdb"
import type { MediaItem } from "@/components/ui/MediaCard"

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
    posterUrl: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=300&h=450&fit=crop",
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
    posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=450&fit=crop",
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
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
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
    posterUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    releaseDate: "2024-09-13",
    director: "Michael Chaves",
    genre: ["Supernatural", "Horror"],
    anticipationScore: 7.9,
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slug: "the-nun-3"
  }
]


export default function ComingSoon({ movies = defaultMovies }: ComingSoonProps) {
  const [upcomingMovies, setUpcomingMovies] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUpcomingContent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [moviesResponse, tvShowsResponse, movieGenres, tvGenres] = await Promise.all([
          tmdbClient.getUpcomingHorrorMovies(1),
          tmdbClient.getUpcomingHorrorTVShows(1),
          tmdbClient.getMovieGenres(),
          tmdbClient.getTVGenres()
        ])

        // Convert movies to MediaItem format
        const movieItems = moviesResponse.results
          .filter(movie => 
            movie.genre_ids.includes(27) && // Must be horror
            !movie.genre_ids.includes(16) // Must not be animation
          )
          .slice(0, 2)
          .map(movie => tmdbMovieToMediaItem(movie, movieGenres.genres))

        // Convert TV shows to MediaItem format with more lenient filtering
        const tvItems = tvShowsResponse.results
          .filter(show => {
            const overview = show.overview.toLowerCase()
            const name = show.name.toLowerCase()
            const horrorKeywords = ['horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 'haunted', 'scary', 'terror', 'evil', 'dark', 'sinister', 'mystery', 'thriller', 'crime', 'fantasy', 'sci-fi']
            return horrorKeywords.some(keyword => overview.includes(keyword) || name.includes(keyword))
          })
          .slice(0, 2)
          .map(show => ({
            id: show.id.toString(),
            title: show.name,
            posterUrl: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
            rating: show.vote_average,
            year: new Date(show.first_air_date).getFullYear(),
            description: show.overview,
            genre: tvGenres.genres
              .filter(genre => show.genre_ids.includes(genre.id))
              .map(g => g.name)
              .slice(0, 3),
            slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }))

        // Ensure we have exactly 4 items total
        const allItems = [...movieItems, ...tvItems]
        
        // If we don't have enough items, fill with additional movies
        if (allItems.length < 4) {
          const additionalMovies = moviesResponse.results
            .filter(movie => 
              movie.genre_ids.includes(27) && // Must be horror
              !movie.genre_ids.includes(16) && // Must not be animation
              !movieItems.some(existing => existing.id === movie.id.toString()) // Not already included
            )
            .slice(0, 4 - allItems.length)
            .map(movie => tmdbMovieToMediaItem(movie, movieGenres.genres))
          
          allItems.push(...additionalMovies)
        }

        setUpcomingMovies(allItems.slice(0, 4))
      } catch {
        setError('Failed to load upcoming content. Please try again later.')
        // Fallback to mock data converted to MediaItem format
        const fallbackItems = movies.slice(0, 4).map(movie => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.posterUrl,
          rating: movie.anticipationScore,
          year: new Date(movie.releaseDate).getFullYear(),
          description: movie.description,
          genre: movie.genre,
          slug: movie.slug
        }))
        setUpcomingMovies(fallbackItems)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingContent()
  }, [movies])

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Get ready for the most anticipated horror movies and TV shows coming soon
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => {
              // For TMDB data, we don't have release dates in the same format
              // So we'll use a generic "Coming Soon" approach
              
              return (
                <Card key={movie.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={movie.posterUrl || '/placeholder-movie-poster.jpg'}
                      alt={movie.title}
                      width={300}
                      height={450}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <Badge className="bg-red-600 text-white">
                        Coming Soon
                      </Badge>
                    </div>

                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-red-400 transition-colors">
                      {movie.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{movie.year}</span>
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
        )}

        <div className="text-center mt-12">
          <Link 
            href="/coming-soon" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
View All Coming Soon
          </Link>
        </div>
      </div>
    </section>
  )
}
