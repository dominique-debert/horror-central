"use client"


import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Clock, Star } from "lucide-react"
import Image from "next/image"
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

type MediaType = 'movie' | 'tv' | 'game'

interface MediaItem {
  id: string
  title: string
  year: number
  rating: number
  duration: string
  genre: string
  imageUrl: string
  trailerUrl: string
  type: MediaType
}

const featuredContent: MediaItem = {
  id: "1",
  title: "The Last of Us",
  year: 2023,
  rating: 9.1,
  duration: "1h",
  genre: "Action, Adventure, Drama",
  imageUrl: "https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
  trailerUrl: "https://www.youtube.com/watch?v=uLtkt8BonwM",
  type: 'tv'
}

const recommendedContent: MediaItem[] = [
  {
    id: "2",
    title: "Hereditary",
    year: 2018,
    rating: 8.2,
    duration: "2h 7m",
    genre: "Horror, Mystery, Thriller",
    imageUrl: "https://image.tmdb.org/t/p/w500/lHV8HHlhwJucpfKwsAYCmfeiyJI.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=V6wWKNij_1M",
    type: 'movie'
  },
  {
    id: "3",
    title: "Resident Evil 4 Remake",
    year: 2023,
    rating: 9.0,
    duration: "16h",
    genre: "Survival Horror",
    imageUrl: "https://image.api.playstation.com/vulcan/ap/rN0DcUM7GXoZ1sWwFEtQwPmGJdTpU8XJ.png",
    trailerUrl: "https://www.youtube.com/watch?v=9ix7TUGVYIo",
    type: 'game'
  },
  {
    id: "4",
    title: "The Haunting of Hill House",
    year: 2018,
    rating: 8.6,
    duration: "1h",
    genre: "Drama, Horror, Mystery",
    imageUrl: "https://image.tmdb.org/t/p/w500/6s7EC1J3JhA5RzffE9dYvnX5IQn.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=3eqxXqJDmcY",
    type: 'tv'
  },
  {
    id: "5",
    title: "Silent Hill 2",
    year: 2024,
    rating: 8.9,
    duration: "12h",
    genre: "Survival Horror",
    imageUrl: "https://image.api.playstation.com/vulcan/ap/rN0DcUM7GXoZ1sWwFEtQwPmGJdTpU8XJ.png",
    trailerUrl: "https://www.youtube.com/watch?v=u3wS-Q2KBpk",
    type: 'game'
  }
]

const RecommendedCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!emblaApi) return;
    
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {recommendedContent.map((item) => (
            <div key={item.id} className="flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_25%] pl-4">
              <motion.div
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="group relative flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute right-0 top-0 m-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-sm text-white backdrop-blur-sm">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                        <span>{item.rating}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="text-xs font-medium text-white/80 mb-1">
                          {item.type === 'movie' ? 'MOVIE' : item.type === 'tv' ? 'TV SHOW' : 'GAME'}
                        </div>
                        <h3 className="font-medium text-white line-clamp-2">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-medium line-clamp-1 text-foreground">{item.title}</h3>
                    <div className="mt-1.5 text-sm text-muted-foreground flex items-center gap-2">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.genre.split(', ')[0]}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-accent transition-colors"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-accent transition-colors"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
};

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-gradient-to-br from-gray-900 to-black">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center" />
        </div>
        <div className="container relative z-10 flex h-full items-end pb-16 pt-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4 w-full">
            <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-sm text-primary">
              Featured {featuredContent.type === 'movie' ? 'Movie' : featuredContent.type === 'tv' ? 'TV Show' : 'Game'}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {featuredContent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{featuredContent.year}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{featuredContent.rating}/10</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{featuredContent.duration}</span>
              </div>
              <span>•</span>
              <span>{featuredContent.genre}</span>
            </div>
            <p className="pt-2 text-lg text-muted-foreground">
              {featuredContent.type === 'tv' 
                ? 'A critically acclaimed horror series that redefines the genre with its deep storytelling and terrifying moments.'
                : featuredContent.type === 'game'
                ? 'An immersive horror experience that will keep you on the edge of your seat with its atmospheric tension and gripping narrative.'
                : 'A chilling story of terror, murder and unknown evil that shocked even experienced real-life paranormal investigators.'}
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" className="gap-2 px-6">
                <Link href={featuredContent.trailerUrl} target="_blank">
                  <Play className="h-5 w-5" />
                  Watch Trailer
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-6">
                <Link href={`/${featuredContent.type}/${featuredContent.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Recommended For You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover new horror content across movies, TV shows, and games</p>
          </div>
          
          <RecommendedCarousel />
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="px-8">
              View All Content
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
