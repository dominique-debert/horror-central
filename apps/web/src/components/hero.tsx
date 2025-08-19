"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, Clock, Star, Plus } from "lucide-react"
import Image from "next/image"
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { MediaCard } from "./MediaCard"

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
  description?: string
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
  type: 'tv',
  description: 'A post-apocalyptic journey of survival and hope, following Joel and Ellie as they navigate a world ravaged by a deadly infection.'
}

const recommendedContent: MediaItem[] = [
  {
    id: "2",
    title: "Hereditary",
    year: 2018,
    rating: 8.2,
    duration: "2h 7m",
    genre: "Horror, Mystery, Thriller",
    imageUrl: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/adPCF2ltY2moH6mApha9RilvcMO.jpg",
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
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo0.webp",
    trailerUrl: "https://www.youtube.com/watch?v=9ix7TUGVYIo",
    type: 'game'
  },
  {
    id: "4",
    title: "The Haunting of Hill House",
    year: 2018,
    rating: 8.6,
    duration: "10h",
    genre: "Drama, Horror, Mystery",
    imageUrl: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/38PkhBGRQtmVx2drvPik3F42qHO.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=3eqxXqJDmcY",
    type: 'tv'
  },
  {
    id: "5",
    title: "Dead Space Remake",
    year: 2023,
    rating: 8.7,
    duration: "12h",
    genre: "Survival Horror",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5esn.webp",
    trailerUrl: "https://www.youtube.com/watch?v=u3wS-Q2KBpk",
    type: 'game'
  },
  {
    id: "6",
    title: "The Witcher 3: Wild Hunt",
    year: 2015,
    rating: 9.3,
    duration: "50h",
    genre: "Action, Adventure, Fantasy",
    imageUrl: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.webp",
    trailerUrl: "https://www.youtube.com/watch?v=V7t2IIJUz5k",
    type: 'game'
  },
  {
    id: "7",
    title: "The Conjuring",
    year: 2013,
    rating: 8.5,
    duration: "1h 52m",
    genre: "Horror, Mystery, Thriller",
    imageUrl: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=k10ETZ41q5o",
    type: 'movie'
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

  return (
    <section className="py-8">
      <div className="container mx-auto">
        <div className="w-full max-w-[2000px] mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Recommended For You</h2>
          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recommendedContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative"
                  >
                    <MediaCard
                      id={item.id}
                      title={item.title}
                      year={item.year}
                      rating={item.rating}
                      imageUrl={item.imageUrl}
                      type={item.type}
                      href={`/${item.type}/${item.id}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <button 
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-accent hover:text-primary transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-lg hover:bg-accent hover:text-primary transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Hero() {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <Image
          src={featuredContent.imageUrl}
          alt={featuredContent.title}
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Featured {featuredContent.type === 'movie' ? 'Movie' : featuredContent.type === 'tv' ? 'TV Show' : 'Game'}
            </div>
            
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {featuredContent.title}
            </motion.h1>
            
            <motion.div 
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span>{featuredContent.year}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{featuredContent.rating}/10</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{featuredContent.duration}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>{featuredContent.genre}</span>
            </motion.div>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {featuredContent.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button asChild size="lg" className="gap-2 px-8 text-base">
                <Link href={featuredContent.trailerUrl} target="_blank">
                  <Play className="h-5 w-5" />
                  Watch Trailer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 px-8 text-base">
                <Link href={`/${featuredContent.type}/${featuredContent.id}`}>
                  <Plus className="h-5 w-5" />
                  Add to Watchlist
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Recommended Carousel */}
      <div className="w-full bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[2000px] mx-auto">
            <RecommendedCarousel />
          </div>
        </div>
      </div>
    </div>
  )
}
