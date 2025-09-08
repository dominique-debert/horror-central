"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { getBackdropUrl } from "@/lib/tmdb"
import { LanguageBadge } from "@/components/ui/LanguageBadge"
import { MediaTypeBadge } from "@/components/ui/MediaTypeBadge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useHeroContent } from "@/hooks/useHeroContent"

interface TMDBVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

interface TMDBVideosResponse {
  id: number
  results: TMDBVideo[]
}

export default function HeroSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [selectedTrailer, setSelectedTrailer] = useState<{key: string, name: string} | null>(null)
  const [trailers, setTrailers] = useState<Record<number, {key: string, name: string}[]>>({})
  
  const { data: heroMedia = [], isLoading, isError } = useHeroContent()
  
  // Auto-rotate hero content every 8 seconds
  useEffect(() => {
    if (heroMedia.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentMediaIndex(prev => (prev + 1) % heroMedia.length)
    }, 8000)
    
    return () => clearInterval(timer)
  }, [heroMedia.length])
  
  // If we have featured movies prop, we can use that instead of fetched content
  // Currently using useHeroContent hook for data fetching

  // Manual navigation functions
  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + heroMedia.length) % heroMedia.length)
  }

  // Get current movie from the rotation
  const currentMedia = heroMedia[currentMediaIndex]

  // Fetch trailers for the current media
  useEffect(() => {
    if (!currentMedia || trailers[currentMedia.id]) return;

    const fetchTrailers = async () => {
      try {
        const url = currentMedia.type === 'movie' 
          ? `/api/movies/${currentMedia.id}/videos`
          : `/api/tv/${currentMedia.id}/videos`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch trailers');
        
        const data: TMDBVideosResponse = await response.json();
        const videoTrailers = data.results
          .filter((video) => video.site === 'YouTube' && video.type === 'Trailer')
          .map((video) => ({
            key: video.key,
            name: video.name
          }));
          
        setTrailers(prev => ({
          ...prev,
          [currentMedia.id]: videoTrailers
        }));
      } catch (error) {
        console.error('Error fetching trailers:', error);
      }
    };

    fetchTrailers();
  }, [currentMedia, trailers]);

  const handleWatchTrailer = async () => {
    if (!currentMedia) return;
    
    // If we already have trailers for this media, show the first one
    if (trailers[currentMedia.id]?.length) {
      setSelectedTrailer(trailers[currentMedia.id][0]);
      return;
    }
    
    try {
      // Try to fetch trailers if we don't have them yet
      const url = currentMedia.type === 'movie' 
        ? `/api/movies/${currentMedia.id}/videos`
        : `/api/tv/${currentMedia.id}/videos`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch trailers');
      
      const data: TMDBVideosResponse = await response.json();
      const videoTrailers = data.results
        .filter((video) => video.site === 'YouTube' && video.type === 'Trailer')
        .map((video) => ({
          key: video.key,
          name: video.name
        }));
      
      // Update the trailers state
      setTrailers(prev => ({
        ...prev,
        [currentMedia.id]: videoTrailers
      }));
      
      // If we found trailers, show the first one
      if (videoTrailers.length > 0) {
        setSelectedTrailer(videoTrailers[0]);
      } else {
        // If no trailers found, fall back to TMDB page
        const tmdbUrl = `https://www.themoviedb.org/${currentMedia.type}/${currentMedia.id}`;
        window.open(tmdbUrl, '_blank');
      }
    } catch (error) {
      console.error('Error playing trailer:', error);
      // Fall back to TMDB page if there's an error
      const tmdbUrl = `https://www.themoviedb.org/${currentMedia.type}/${currentMedia.id}`;
      window.open(tmdbUrl, '_blank');
    }
  };

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

  if (isLoading) {
    return (
      <div className="relative h-[80vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-800"></div>
      </div>
    )
  }

  if (isError || heroMedia.length === 0) {
    return (
      <div className="relative h-[60vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Failed to load featured content</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
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
              <span className="bg-green-800 text-white px-3 py-1 rounded-md text-sm font-semibold">
                TRENDING
              </span>
              <div className="flex gap-2">
                <MediaTypeBadge type={currentMedia.type} />
                {displayGenres.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800/80 text-white px-3 py-1 rounded-md text-sm font-medium border border-gray-600"
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
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleWatchTrailer}
              >
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

      {/* Trailer Modal */}
      <Dialog open={!!selectedTrailer} onOpenChange={(open: boolean) => !open && setSelectedTrailer(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <DialogTitle className="sr-only">
            {selectedTrailer ? `Trailer: ${selectedTrailer.name}` : 'Trailer Player'}
          </DialogTitle>
          <div className="aspect-video w-full">
            {selectedTrailer && (
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}?rel=0&showinfo=0`}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedTrailer.name}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 rounded-full p-4">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
