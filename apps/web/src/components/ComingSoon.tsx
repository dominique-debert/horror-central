'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { tmdbClient, tmdbMovieToMediaItem } from "@/lib/tmdb"
import type { MediaItem } from "@/components/ui/MediaCard"
import { MediaCard } from "@/components/ui/MediaCard"

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
            !movie.genre_ids.includes(16) && // Must not be animation
            movie.poster_path // Must have a poster path
          )
          .slice(0, 4)
          .map(movie => ({
            ...tmdbMovieToMediaItem(movie, movieGenres.genres),
            releaseDate: movie.release_date
          }))

        // Convert TV shows to MediaItem format with more lenient filtering
        const tvItems = tvShowsResponse.results
          .filter(show => {
            const overview = show.overview?.toLowerCase() || ''
            const name = show.name?.toLowerCase() || ''
            const horrorKeywords = ['horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 'haunted', 'scary', 'terror', 'evil', 'dark', 'sinister', 'mystery', 'thriller', 'crime', 'fantasy', 'sci-fi']
            return horrorKeywords.some(keyword => overview.includes(keyword) || name.includes(keyword)) &&
                   show.poster_path // Must have a poster path
          })
          .slice(0, 4)
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
            slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            originalLanguage: show.original_language,
            releaseDate: show.first_air_date
          }))

        // Ensure we have exactly 8 items total with valid posters
        const allItems = [...movieItems, ...tvItems].filter(item => item.posterUrl && !item.posterUrl.includes('null'))
        
        // If we don't have enough items, fill with additional movies that have posters
        if (allItems.length < 8) {
          const additionalMovies = moviesResponse.results
            .filter(movie => 
              movie.genre_ids.includes(27) && // Must be horror
              !movie.genre_ids.includes(16) && // Must not be animation
              movie.poster_path && // Must have a poster
              !movieItems.some(existing => existing.id === movie.id.toString()) // Not already included
            )
            .slice(0, 8 - allItems.length)
            .map(movie => ({
              ...tmdbMovieToMediaItem(movie, movieGenres.genres),
              releaseDate: movie.release_date
            }))
          
          allItems.push(...additionalMovies)
        }

        setUpcomingMovies(allItems.slice(0, 8))
      } catch {
        setError('Failed to load upcoming content. Please try again later.')
        // Fallback to mock data converted to MediaItem format, ensuring they have poster URLs
        const fallbackItems = movies
          .filter(movie => movie.posterUrl) // Only include items with poster URLs
          .slice(0, 8)
          .map(movie => ({
            id: movie.id,
            title: movie.title,
            posterUrl: movie.posterUrl,
            rating: movie.anticipationScore,
            year: new Date(movie.releaseDate).getFullYear(),
            description: movie.description,
            genre: movie.genre,
            slug: movie.slug,
            releaseDate: movie.releaseDate
          }))
        setUpcomingMovies(fallbackItems)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingContent()
  }, [movies])

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-gray-400 text-lg">
              Get ready for the most anticipated horror movies and TV shows coming soon
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/coming-soon">
              View All
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
            {upcomingMovies.map((movie) => {
              // Create a modified movie item with Coming Soon badge in genre and no rating
              const comingSoonMovie = {
                ...movie,
                genre: ['Coming Soon', ...movie.genre.slice(0, 2)], // Add "Coming Soon" as first genre
                rating: 0 // Remove rating display
              }
              
              return (
                <MediaCard 
                  key={movie.id}
                  item={comingSoonMovie}
                  type="movie"
                />
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
