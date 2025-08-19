"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Play } from "lucide-react"
import { motion } from "framer-motion"

type MediaType = 'movie' | 'tv' | 'game'

interface MediaCardProps {
  id: string
  title: string
  year: number
  rating: number
  imageUrl: string
  type: MediaType
  href: string
  className?: string
  showPlayButton?: boolean
}

export function MediaCard({ 
  id, 
  title, 
  year, 
  rating, 
  imageUrl, 
  type, 
  href, 
  className = '',
  showPlayButton = false
}: MediaCardProps) {
  return (
    <Link href={href} className={`group block ${className}`}>
      <motion.div 
        className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary/10"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          priority={false}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play button overlay */}
        {showPlayButton && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110">
              <Play className="h-5 w-5 ml-1 fill-current" />
            </div>
          </div>
        )}
        
        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-accent bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
              {type === 'movie' ? 'MOVIE' : type === 'tv' ? 'TV SHOW' : 'GAME'}
            </span>
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{year}</p>
        </div>
        
        {/* Top content (always visible) */}
        <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
          <span className="text-xs font-medium text-accent bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
            {type === 'movie' ? 'MOVIE' : type === 'tv' ? 'TV SHOW' : 'GAME'}
          </span>
          <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
      </motion.div>
      
      {/* Title below card (visible on mobile, hidden on hover) */}
      <div className="mt-2 group-hover:hidden">
        <h3 className="text-sm font-medium text-foreground line-clamp-1">{title}</h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  )
}
