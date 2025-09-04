"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"
import Image from "next/image"
import { tmdbClient, getBackdropUrl } from "@/lib/tmdb"
import type { TMDBMovie } from "@/lib/tmdb"

interface HeroSectionProps {
  // Optional props for manual override
  title?: string
  description?: string
  backgroundImage?: string
  trailerUrl?: string
  moreInfoUrl?: string
}

export default function HeroSection({
  title: manualTitle,
  description: manualDescription,
  backgroundImage: manualBackgroundImage,
  trailerUrl: manualTrailerUrl,
  moreInfoUrl: manualMoreInfoUrl,
}: HeroSectionProps = {}) {
  const [featuredMovies, setFeaturedMovies] = useState<TMDBMovie[]>([])
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const movies = await tmdbClient.getFeaturedHorrorMovies(10)
      
      // Double-check that all movies are horror movies (genre ID 27) and not animated (genre ID 16)
      const horrorMovies = movies.filter(movie => 
        movie.genre_ids.includes(27) && // Must be horror
        !movie.genre_ids.includes(16) // Must not be animation
      )
      
      setFeaturedMovies(horrorMovies)
    } catch {
      setError('Failed to load featured movies')
      // Use manual props as fallback if provided
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if no manual props provided
    if (!manualTitle) {
      fetchFeaturedMovies()
    } else {
      setLoading(false)
    }
  }, [manualTitle])

  // Auto-rotate through movies every 8 seconds
  useEffect(() => {
    if (featuredMovies.length > 1 && !manualTitle) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => 
          (prevIndex + 1) % featuredMovies.length
        )
      }, 8000) // Change movie every 8 seconds

      return () => clearInterval(interval)
    }
  }, [featuredMovies.length, manualTitle])

  // Get current movie from the rotation
  const currentMovie = featuredMovies[currentMovieIndex]

  // Use manual props if provided, otherwise use TMDB data
  const title = manualTitle || currentMovie?.title || 'Loading...'
  const description = manualDescription || currentMovie?.overview || 'Loading featured horror movies...'
  const backgroundImage = manualBackgroundImage || (currentMovie ? getBackdropUrl(currentMovie.backdrop_path) : '')
  const trailerUrl = manualTrailerUrl
  const moreInfoUrl = manualMoreInfoUrl || (currentMovie ? `/movies/${currentMovie.id}` : '')

  if (loading) {
    return (
      <section className="relative h-[40vh] min-h-[250px] w-full overflow-hidden bg-gray-900">
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-6">
              <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-gray-700 rounded animate-pulse"></div>
                <div className="h-12 w-32 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[40vh] min-h-[250px] w-full overflow-hidden">
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0">
        <Image
          key={currentMovie?.id || 'loading'} // Force re-render on movie change
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover transition-opacity duration-1000 ease-in-out"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>
            
            <p className="text-lg text-gray-200 md:text-xl">
              {description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              {trailerUrl && (
                <Button
                  size="lg"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => window.open(trailerUrl, '_blank')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              
              {moreInfoUrl && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={() => window.open(moreInfoUrl, '_blank')}
                >
                  <Info className="mr-2 h-5 w-5" />
                  More Info
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
