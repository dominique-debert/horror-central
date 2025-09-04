"use client"

import { useState, useEffect } from 'react'
import { MediaCard } from "@/components/ui/MediaCard"
import Link from "next/link"
import { tmdbClient, tmdbMovieToMediaItem } from "@/lib/tmdb"
import type { MediaItem } from "@/components/ui/MediaCard"

interface TopRatedMovie {
  id: string
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  duration: string
  genre: string[]
  awards: string[]
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
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 9.1,
    year: 1973,
    duration: "122 min",
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
    posterUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 2018,
    duration: "127 min",
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
    posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 2014,
    duration: "94 min",
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
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.3,
    year: 2015,
    duration: "92 min",
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
    posterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.1,
    year: 2019,
    duration: "148 min",
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
    posterUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 8.9,
    year: 2017,
    duration: "104 min",
    genre: ["Psychological Horror", "Thriller"],
    awards: ["Academy Award Winner", "BAFTA Winner"],
    criticsScore: 98,
    audienceScore: 86,
    slug: "get-out"
  }
]


export default function TopRated({ movies = defaultMovies }: TopRatedProps) {
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
        // Fallback to mock data converted to MediaItem format
        const fallbackItems = movies.slice(0, 8).map(movie => ({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.posterUrl,
          rating: movie.rating,
          year: movie.year,
          duration: movie.duration,
          description: movie.description,
          genre: movie.genre,
          slug: movie.slug
        }))
        setTopRatedMovies(fallbackItems)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRatedMovies()
  }, [movies])

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Movies</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the highest-rated horror movies of all time, curated by critics and audiences
          </p>
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
