"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MediaCard, MediaItem } from "@/components/ui/MediaCard"
import { tmdbClient, tmdbMovieToMediaItem } from "@/lib/tmdb"



export default function TopRated() {
  const [topRatedMovies, setTopRatedMovies] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const [moviesResponse, genresResponse] = await Promise.all([
          tmdbClient.getTopRatedHorrorMovies(1),
          tmdbClient.getMovieGenres()
        ])
        const mediaItems = moviesResponse.results.slice(0, 8).map(movie => 
          tmdbMovieToMediaItem(movie, genresResponse.genres)
        )
        setTopRatedMovies(mediaItems)
      } catch {
        setError('Failed to load top rated movies. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopRatedMovies()
  }, [])

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Movies</h2>
            <p className="text-gray-400 text-lg">
              Discover the highest-rated horror movies of all time, curated by critics and audiences
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/top-rated">
              View All
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
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
            {topRatedMovies.map((movie) => (
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
