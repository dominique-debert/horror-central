"use client"

import { MediaCard, MediaItem } from "@/components/ui/MediaCard"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { tmdbClient, tmdbMovieToMediaItem } from "@/lib/tmdb"

interface NowPlayingProps {
  initialMovies?: MediaItem[]
}

export default function NowPlaying({ initialMovies }: NowPlayingProps) {
  const [movies, setMovies] = useState<MediaItem[]>(initialMovies || [])
  const [loading, setLoading] = useState(!initialMovies)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialMovies) return

    const fetchNowPlayingMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch genres first for proper mapping
        const [moviesResponse, genresResponse] = await Promise.all([
          tmdbClient.getNowPlayingHorrorMovies(1),
          tmdbClient.getMovieGenres()
        ])

        // Filter and convert TMDB movies to MediaItem format
        const horrorMovies = moviesResponse.results.filter(movie => 
          movie.genre_ids.includes(27) && // Ensure horror genre ID 27
          !movie.genre_ids.includes(16) // Exclude animation genre ID 16
        )
        
        const mediaItems = horrorMovies
          .slice(0, 8) // Limit to 8 movies
          .map(movie => tmdbMovieToMediaItem(movie, genresResponse.genres))

        setMovies(mediaItems)
      } catch (err) {
        console.error('Error fetching now playing movies:', err)
        setError('Failed to load movies. Please try again later.')
        
        // Fallback to mock data if API fails
        setMovies([
          {
            id: "1",
            title: "Scream VI",
            posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
            rating: 8.2,
            year: 2023,
            duration: "123 min",
            description: "In the sixth installment of the Scream franchise, Ghostface is back and terrorizing a new group of teenagers.",
            genre: ["Slasher", "Horror"],
            slug: "scream-vi"
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlayingMovies()
  }, [initialMovies])
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Now Playing</h2>
            <p className="text-gray-400 text-lg">
              Currently showing in theaters - the latest horror releases
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/now-playing">
              View All
            </Link>
          </Button>
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-96" />
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
            {movies.map((movie) => (
              <MediaCard
                key={movie.id}
                item={movie}
                type="movie"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
