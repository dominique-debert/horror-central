"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { tmdbClient, getBackdropUrl } from "@/lib/tmdb"
import type { TMDBMovie } from "@/lib/tmdb"
import { LanguageBadge } from "@/components/ui/LanguageBadge"
import { MediaTypeBadge } from "@/components/ui/MediaTypeBadge"


interface HeroMedia {
  id: number
  title: string
  overview: string
  backdrop_path: string | null
  genre_ids: number[]
  original_language: string
  type: 'movie' | 'tv'
  release_date?: string
  first_air_date?: string
}

interface HeroSectionProps {
  // Optional props for manual override
  featuredMovies?: TMDBMovie[]
  title?: string
  description?: string
  backgroundImage?: string
  trailerUrl?: string
  moreInfoUrl?: string
}

export default function HeroSection({ featuredMovies }: HeroSectionProps) {
  const [heroMedia, setHeroMedia] = useState<HeroMedia[]>([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedContent = async () => {
      if (featuredMovies) {
        const movieMedia: HeroMedia[] = featuredMovies.map(movie => ({
          ...movie,
          title: movie.title,
          type: 'movie' as const
        }))
        setHeroMedia(movieMedia)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch multiple pages to get more content
        const [nowPlayingMovies1, nowPlayingMovies2, topRatedTVShows1, topRatedTVShows2] = await Promise.all([
          tmdbClient.getNowPlayingHorrorMovies(1),
          tmdbClient.getNowPlayingHorrorMovies(2),
          tmdbClient.getTopRatedHorrorTVShows(1),
          tmdbClient.getTopRatedHorrorTVShows(2)
        ])

        // Convert movies to HeroMedia format
        const movieMedia: HeroMedia[] = [
          ...nowPlayingMovies1.results, 
          ...nowPlayingMovies2.results
        ]
          .filter((movie, index, self) => 
            index === self.findIndex(m => m.id === movie.id)
          )
          .filter(movie => 
            movie.backdrop_path && 
            movie.overview && 
            movie.vote_average >= 6.0 &&
            movie.vote_count >= 100
          )
          .map(movie => ({
            ...movie,
            title: movie.title,
            type: 'movie' as const
          }))

        // Convert TV shows to HeroMedia format
        const tvMedia: HeroMedia[] = [
          ...topRatedTVShows1.results,
          ...topRatedTVShows2.results
        ]
          .filter(show => 
            show.backdrop_path && 
            show.overview && 
            show.vote_average >= 6.5 &&
            show.vote_count >= 50
          )
          .map(show => ({
            id: show.id,
            title: show.name,
            overview: show.overview,
            backdrop_path: show.backdrop_path,
            genre_ids: show.genre_ids,
            original_language: show.original_language,
            type: 'tv' as const,
            first_air_date: show.first_air_date
          }))

        // Mix movies and TV shows, getting more content
        const allMedia = [...movieMedia.slice(0, 7), ...tvMedia.slice(0, 3)]
        const shuffledMedia = allMedia.sort(() => Math.random() - 0.5)

        setHeroMedia(shuffledMedia.slice(0, 10))
      } catch (error) {
        console.error('Failed to load featured content:', error)
        // Failed to load featured content, use empty array
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedContent()
  }, [featuredMovies])

  // Manual navigation functions
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + heroMedia.length) % heroMedia.length)
  }

  // Auto-rotate through movies every 8 seconds
  useEffect(() => {
    if (heroMedia.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [heroMedia.length])

  // Get current movie from the rotation
  const currentMedia = heroMedia[currentMediaIndex]

  const moreInfoUrl = currentMedia?.type === 'movie' 
    ? `https://www.themoviedb.org/movie/${currentMedia?.id}`
    : `https://www.themoviedb.org/tv/${currentMedia?.id}`

  // Get primary genre for badge
  const getDisplayGenres = () => {
    if (!currentMedia?.genre_ids) return []
    
    const genreMap: { [key: number]: string } = {
      27: 'Horror',
      53: 'Thriller', 
      9648: 'Mystery',
      878: 'Sci-Fi',
      14: 'Fantasy',
      80: 'Crime',
      18: 'Drama'
    }
    
    return currentMedia.genre_ids
      .map(id => genreMap[id])
      .filter(Boolean)
      .slice(0, 3)
  }

  const displayGenres = getDisplayGenres()

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading featured content...</div>
      </section>
    )
  }

  if (heroMedia.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">No featured content available</div>
      </section>
    )
  }

  return (
    <section className="relative h-[40vh] min-h-[250px] w-full overflow-hidden">
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0">
        <Image
          src={getBackdropUrl(currentMedia.backdrop_path!)}
          alt={currentMedia.title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Navigation Chevrons */}
      {heroMedia.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 z-10"
            onClick={prevMedia}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white hover:bg-black/30 z-10"
            onClick={nextMedia}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {currentMedia.title}
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {currentMedia.overview}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                NOW PLAYING
              </span>
              <div className="flex gap-2">
                <MediaTypeBadge type={currentMedia.type} />
                {displayGenres.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800/80 text-white px-3 py-1 rounded-full text-sm font-medium border border-gray-600"
                  >
                    {genre}
                  </span>
                ))}
                {currentMedia?.original_language && (
                  <LanguageBadge language={currentMedia.original_language} />
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <Play className="mr-2 h-5 w-5" />
                Watch Trailer
              </Button>
              
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

      {/* Pagination dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {heroMedia.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentMediaIndex ? 'bg-red-600' : 'bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => setCurrentMediaIndex(index)}
          />
        ))}
      </div>
    </section>
  )
}
