"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"
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

  const fetchNowPlayingMovies = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await tmdbClient.getNowPlayingHorrorMovies(1)
      
      // Double-check that all movies are horror movies (genre ID 27) and not animated (genre ID 16)
      const horrorMovies = response.results.filter(movie => 
        movie.genre_ids.includes(27) && // Must be horror
        !movie.genre_ids.includes(16) // Must not be animation
      )
      
      setFeaturedMovies(horrorMovies)
    } catch {
      setError('Failed to load now playing movies')
      // Use manual props as fallback if provided
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if no manual props provided
    if (!manualTitle) {
      fetchNowPlayingMovies()
    } else {
      setLoading(false)
    }
  }, [manualTitle])

  // Manual navigation functions
  const goToPrevious = () => {
    setCurrentMovieIndex((prevIndex) => 
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentMovieIndex((prevIndex) => 
      (prevIndex + 1) % featuredMovies.length
    )
  }

  // Auto-rotate through movies every 8 seconds
  useEffect(() => {
    if (featuredMovies.length > 1 && !manualTitle) {
      const interval = setInterval(() => {
        setCurrentMovieIndex((prevIndex) => 
          (prevIndex + 1) % featuredMovies.length
        )
      }, 5000) // Change movie every 5 seconds

      return () => clearInterval(interval)
    }
  }, [featuredMovies.length, manualTitle])

  // Get current movie from the rotation
  const currentMovie = featuredMovies[currentMovieIndex]

  // Use manual props if provided, otherwise use TMDB data
  const title = manualTitle || currentMovie?.title || 'Loading...'
  const description = manualDescription || currentMovie?.overview || 'Loading now playing horror movies...'
  const backgroundImage = manualBackgroundImage || (currentMovie ? getBackdropUrl(currentMovie.backdrop_path) : '')
  const trailerUrl = manualTrailerUrl
  const moreInfoUrl = manualMoreInfoUrl || (currentMovie ? `/movies/${currentMovie.id}` : '')

  if (loading) {
    return (
      <section className="relative h-[40vh] min-h-[250px] w-full overflow-hidden bg-gray-900">
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl space-y-6">
              <div className="h-8 bg-gray-700 rounded animate-pulse w-32 mb-2"></div>
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

      {/* Navigation Chevrons */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Previous movie"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Next movie"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                NOW PLAYING
              </span>
              {featuredMovies.length > 1 && (
                <span className="text-white/70 text-sm">
                  {currentMovieIndex + 1} of {featuredMovies.length}
                </span>
              )}
            </div>
            
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
