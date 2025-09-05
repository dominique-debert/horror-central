"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { tmdbClient, getBackdropUrl } from "@/lib/tmdb"
import type { TMDBMovie } from "@/lib/tmdb"
import { LanguageBadge } from "@/components/ui/LanguageBadge"

// Genre ID constants
const HORROR_GENRE_ID = 27
const MYSTERY_GENRE_ID = 9648
const ANIMATION_GENRE_ID = 16
const MUSIC_GENRE_ID = 10402
const ACTION_GENRE_ID = 28

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
      
      // Filter for horror or mystery movies and exclude unwanted genres
      // Also filter out movies without backdrop images
      const horrorMovies = response.results.filter(movie => 
        (movie.genre_ids.includes(HORROR_GENRE_ID) || movie.genre_ids.includes(MYSTERY_GENRE_ID)) && // Must be horror or mystery
        !movie.genre_ids.includes(ANIMATION_GENRE_ID) && // Must not be animation
        !movie.genre_ids.includes(MUSIC_GENRE_ID) && // Must not be music
        !movie.genre_ids.includes(ACTION_GENRE_ID) && // Must not be action
        movie.backdrop_path // Must have backdrop image
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
  const backgroundImage = manualBackgroundImage || (currentMovie ? getBackdropUrl(currentMovie.backdrop_path) : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')
  const trailerUrl = manualTrailerUrl
  const moreInfoUrl = manualMoreInfoUrl || (currentMovie ? `/movies/${currentMovie.id}` : '')
  
  // Get primary genre for badge
  const getGenreName = (genreId: number): string => {
    const genreMap: { [key: number]: string } = {
      27: 'Horror',
      53: 'Thriller', 
      9648: 'Mystery',
      878: 'Sci-Fi',
      14: 'Fantasy',
      18: 'Drama',
      28: 'Action',
      35: 'Comedy',
      80: 'Crime',
      10749: 'Romance',
      10751: 'Family',
      37: 'Western',
      10752: 'War',
      36: 'History',
      99: 'Documentary',
      10402: 'Music',
      16: 'Animation'
    }
    return genreMap[genreId] || 'Unknown'
  }
  
  // Get all relevant genres for display, prioritizing Horror and Mystery
  const getDisplayGenres = (): string[] => {
    if (!currentMovie?.genre_ids) return ['Horror']
    
    const relevantGenres = currentMovie.genre_ids
      .map(id => getGenreName(id))
      .filter(name => ['Horror', 'Mystery', 'Thriller', 'Sci-Fi', 'Fantasy'].includes(name))
    
    // Ensure Horror is first if present, Mystery second if present
    const sortedGenres = relevantGenres.sort((a, b) => {
      if (a === 'Horror') return -1
      if (b === 'Horror') return 1
      if (a === 'Mystery') return -1
      if (b === 'Mystery') return 1
      return 0
    })
    
    return sortedGenres.length > 0 ? sortedGenres.slice(0, 2) : ['Horror']
  }
  
  const displayGenres = getDisplayGenres()

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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
              
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {displayGenres.map((genre, index) => (
                    <span 
                      key={index}
                      className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-600"
                    >
                      {genre}
                    </span>
                  ))}
                  {currentMovie?.original_language && (
                    <LanguageBadge language={currentMovie.original_language} />
                  )}
                </div>
                
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
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
