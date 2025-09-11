"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getBackdropUrl } from "@/lib/tmdb"
import { LanguageBadge } from "@/components/ui/LanguageBadge"
import { MediaTypeBadge } from "@/components/ui/MediaTypeBadge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { fetchHeroContent } from "@/lib/utils/media"
import { IMediaItem } from "@/types/IMedia"
import { ITMDBVideosResponse } from "@/types";

type Trailer = {
  key: string;
  name: string;
  official?: boolean;
};

export default function HeroSection() {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [trailers, setTrailers] = useState<Record<number, Trailer[]>>({});
  const [heroMedia, setHeroMedia] = useState<IMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  
  // Fetch hero content on component mount
  useEffect(() => {
    const loadHeroContent = async () => {
      try {
        setIsLoading(true);
        const content = await fetchHeroContent();
        setHeroMedia(content);
        setIsError(false);
      } catch (error) {
        console.error('Failed to load hero content:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHeroContent();
  }, []);
  
  // Auto-rotate hero content every 8 seconds
  useEffect(() => {
    if (heroMedia.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentMediaIndex(prev => (prev + 1) % heroMedia.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [heroMedia.length]);

  // Manual navigation functions
  const nextMedia = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev + 1) % heroMedia.length);
  }, [heroMedia.length]);

  const prevMedia = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMediaIndex(prev => (prev - 1 + heroMedia.length) % heroMedia.length);
  }, [heroMedia.length]);

  // Get current media item
  const currentMedia = heroMedia[currentMediaIndex];

  // Handle trailer fetching
  useEffect(() => {
    if (!currentMedia?.id) return;
    
    const fetchTrailers = async () => {
      try {
        const mediaType = currentMedia.media_type || (currentMedia.title ? 'movie' : 'tv');
        const response = await fetch(`/api/${mediaType}/${currentMedia.id}/videos`);
        if (!response.ok) throw new Error('Failed to fetch trailers');

        const data: ITMDBVideosResponse = await response.json();
        const videoTrailers = data.results
          .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
          .sort((a, b) => (a.official === b.official ? 0 : a.official ? -1 : 1))
          .map(({ key, name, official }) => ({ key, name, official }));
          
        setTrailers(prev => ({
          ...prev,
          [currentMedia.id]: videoTrailers
        }));
      } catch (error) {
        console.error('Error fetching trailers:', error);
      }
    };

    if (!trailers[currentMedia.id]) {
      fetchTrailers();
    }
  }, [currentMedia, trailers]);

  const handleWatchTrailer = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentMedia) return;
    
    // If we have trailers, show the first one
    if (trailers[currentMedia.id]?.length) {
      setSelectedTrailer(trailers[currentMedia.id][0]);
      return;
    }
    
    // Show loading state immediately
    setSelectedTrailer({ key: 'loading', name: 'Loading trailer...' });
    
    try {
      // Try to fetch trailers if we don't have them yet
      const mediaType = currentMedia.media_type || (currentMedia.title ? 'movie' : 'tv');
      const endpoint = mediaType === 'movie' ? 'movies' : 'tv';
      const response = await fetch(`/api/${endpoint}/${currentMedia.id}/videos`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trailers');
      }

      const data: ITMDBVideosResponse = await response.json();

      // Get the first official trailer, or fall back to the first trailer
      const officialTrailer = data.results.find(
        video => video.site === 'YouTube' && video.type === 'Trailer' && video.official
      );
      
      const fallbackTrailer = data.results.find(
        video => video.site === 'YouTube' && video.type === 'Trailer'
      );
      
      const teaser = data.results.find(
        video => video.site === 'YouTube' && video.type === 'Teaser'
      );
      
      const selectedVideo = officialTrailer || fallbackTrailer || teaser;
      
      if (selectedVideo) {
        setSelectedTrailer({
          key: selectedVideo.key,
          name: selectedVideo.name,
          official: selectedVideo.official
        });
      } else {
        throw new Error('No trailer found');
      }
      
      // Update the trailers state for future use
      const videoTrailers = data.results
        .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
        .sort((a, b) => (a.official === b.official ? 0 : a.official ? -1 : 1))
        .map(({ key, name, official }) => ({ key, name, official }));
      
      setTrailers(prev => ({
        ...prev,
        [currentMedia.id]: videoTrailers
      }));
      
    } catch (error) {
      console.error('Error playing trailer:', error);
      // Show error in dialog
      setSelectedTrailer({ 
        key: 'error', 
        name: 'No trailer available' 
      });
    }
  }, [currentMedia, trailers]);

  const handleMoreInfo = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentMedia) return;

    const mediaType = currentMedia.media_type || (currentMedia.title ? 'movie' : 'tv');
    const mediaId = currentMedia.id;
    router.push(`/details/${mediaType}/${mediaId}`);
  }, [currentMedia, router]);

  // Get primary genre for badge
  const getDisplayGenres = useCallback((media: IMediaItem) => {
    if (!media?.genre_ids?.length) return [];
    
    // Movie and TV show genres from TMDB
    const genreMap: Record<number, string> = {
      // Movie genres
      27: 'Horror',
      53: 'Thriller',
      14: 'Fantasy',
      878: 'Sci-Fi',
      9648: 'Mystery',
      // TV show genres
      // 10759: 'Action & Adventure',
      // 16: 'Animation',
      // 35: 'Comedy',
      // 80: 'Crime',
      // 99: 'Documentary',
      // 18: 'Drama',
      // 10751: 'Family',
      // 10762: 'Kids',
      // 10763: 'News',
      // 10764: 'Reality',
      // 10765: 'Sci-Fi & Fantasy',
      // 10766: 'Soap',
      // 10767: 'Talk',
      // 10768: 'War & Politics',
      // 37: 'Western'
    };

    return [...new Set(media.genre_ids)]
      .map(id => genreMap[id])
      .filter((genre): genre is string => Boolean(genre))
      .slice(0, 3);
  }, []);

  if (isLoading) {
    return (
      <div className="relative h-[30vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading featured content...</div>
      </div>
    );
  }

  if (isError || heroMedia.length === 0) {
    return (
      <div className="relative h-[30vh] w-full bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isError ? 'Failed to load featured content' : 'No featured content available'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isError ? 'Please try refreshing the page' : 'Check back later for updates'}
          </p>
        </div>
      </div>
    );
  }

  const displayGenres = getDisplayGenres(currentMedia);
  const backgroundImage = currentMedia.backdrop_path 
    ? `url(${getBackdropUrl(currentMedia.backdrop_path, 'original')})`
    : 'linear-gradient(to right, #1a1a1a, #2d2d2d)';

  return (
    <section className="relative h-[30vh] w-full overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage,
          opacity: 0.4,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      
      {/* Title */}
      <div className="absolute top-20 left-20 w-full z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white/50 drop-shadow-lg">
          Featured Movies & TV Shows
        </h1>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {heroMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMediaIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${currentMediaIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={prevMedia}
          className="absolute left-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Previous"
          type="button"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="container mx-auto px-4 z-10 ml-6">
          <div className="max-w-3xl">
            
            {/* Title and Overview */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 ml-10">
              {currentMedia.title || currentMedia.name}
            </h1>
            {/* Badges */}
            <div className="flex items-center gap-2 mb-3 ml-10">
              <span className="bg-green-800 text-white px-2 py-0.5 rounded-md text-xs font-semibold">
                TRENDING
              </span>
              <div className="flex flex-wrap gap-2">
                {currentMedia.media_type && <MediaTypeBadge type={currentMedia.media_type} />}
                {displayGenres.map((genre, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800/80 text-white px-2 py-1 rounded-md text-xs font-medium border border-gray-600"
                  >
                    {genre}
                  </span>
                ))}
                {currentMedia.original_language && (
                  <LanguageBadge language={currentMedia.original_language} />
                )}
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm line-clamp-2 ml-10">
              {currentMedia.overview}
            </p>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-4 ml-10 mt-15">
              <button
                onClick={handleWatchTrailer}
                className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white border border-white/30 px-4 py-2 text-sm rounded-md font-medium transition-colors cursor-pointer"
                type="button"
              >
                <Play className="w-5 h-5" />
                Watch Trailer
              </button>
              
              <button
                onClick={handleMoreInfo}
                className="flex items-center justify-center gap-1.5 bg-black/60 hover:bg-black/80 text-white border border-white/30 px-4 py-2 text-sm rounded-md font-medium transition-colors cursor-pointer"
                type="button"
              >
                <Info className="w-5 h-5" />
                More Info
              </button>
            </div>
          </div>
        </div>
        
        <button
          onClick={nextMedia}
          className="absolute right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Next"
          type="button"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      
      {/* Trailer Dialog */}
      <Dialog 
        open={!!selectedTrailer} 
        onOpenChange={(open) => !open && setSelectedTrailer(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-black border-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedTrailer ? `Trailer: ${selectedTrailer.name}` : 'Trailer Player'}
          </DialogTitle>
          <div className="aspect-video w-full bg-black">
            {selectedTrailer?.key === 'loading' ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-pulse text-white">Loading trailer...</div>
              </div>
            ) : selectedTrailer?.key && selectedTrailer.key !== 'loading' ? (
              <iframe
                key={selectedTrailer.key}
                src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&rel=0&modestbranding=1&showinfo=0&playsinline=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedTrailer.name}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                <p className="text-xl text-white mb-4">No trailer available</p>
                <p className="text-gray-400 mb-6">We couldn&apos;t find a trailer for this title.</p>
                <Button 
                  variant="outline" 
                  className="text-white border-white hover:bg-white/10"
                  onClick={() => {
                    if (currentMedia) {
                      const tmdbUrl = `https://www.themoviedb.org/${currentMedia.media_type || 'movie'}/${currentMedia.id}`;
                      window.open(tmdbUrl, '_blank');
                    }
                  }}
                >
                  View on TMDB
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
