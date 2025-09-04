"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Calendar, Clock, Tv, Gamepad2, BookOpen, Monitor, Smartphone, Zap } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface MediaItem {
  id: string
  title: string
  posterUrl?: string
  coverUrl?: string
  rating: number
  year: number
  duration?: string
  description: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
  // Movie specific
  // TV Show specific
  seasons?: number
  episodes?: number
  // Game specific
  platform?: string | string[]
  // Book specific
  author?: string
  pages?: number
}

type MediaType = 'movie' | 'tv' | 'game' | 'book'

interface MediaCardProps {
  item: MediaItem
  type: MediaType
}

const getMetadataIcon = (type: MediaType) => {
  switch (type) {
    case 'movie':
      return Clock
    case 'tv':
      return Tv
    case 'game':
      return Gamepad2
    case 'book':
      return BookOpen
    default:
      return Clock
  }
}

const getPlatformIcons = (platform: string | string[]): LucideIcon[] => {
  const platforms = Array.isArray(platform) ? platform : [platform]
  const icons: LucideIcon[] = []
  
  platforms.slice(0, 2).forEach(p => {
    const platformName = p.toLowerCase()
    if (platformName.includes('pc') || platformName.includes('windows') || platformName.includes('steam')) {
      icons.push(Monitor)
    } else if (platformName.includes('playstation') || platformName.includes('ps')) {
      icons.push(Gamepad2)
    } else if (platformName.includes('xbox')) {
      icons.push(Zap)
    } else if (platformName.includes('nintendo') || platformName.includes('switch')) {
      icons.push(Tv)
    } else if (platformName.includes('mobile') || platformName.includes('ios') || platformName.includes('android')) {
      icons.push(Smartphone)
    } else {
      icons.push(Monitor) // Default to PC icon
    }
  })
  
  return icons.length > 0 ? icons : [Monitor]
}

const getMetadataText = (item: MediaItem, type: MediaType): string => {
  switch (type) {
    case 'movie':
      return item.duration || 'N/A'
    case 'tv':
      return `${item.seasons} Season${item.seasons !== 1 ? 's' : ''}`
    case 'game':
      return Array.isArray(item.platform) ? item.platform[0] || 'Multi-platform' : item.platform || 'Multi-platform'
    case 'book':
      return `${item.pages} pages`
    default:
      return item.duration || 'N/A'
  }
}

export function MediaCard({ item, type }: MediaCardProps) {
  const imageUrl = item.posterUrl || item.coverUrl || ''
  const MetadataIcon = getMetadataIcon(type)
  
  return (
    <Card className="group cursor-pointer overflow-hidden bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Genre badge */}
        {item.genre && item.genre.length > 0 && (
          <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">
            {item.genre[0]}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="text-center text-white px-4">
            <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
            <p className="mb-3 text-sm text-gray-200 line-clamp-3">
              {item.description}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{item.year}</span>
              </div>
              <div className="flex items-center gap-1">
                <MetadataIcon className="h-3 w-3" />
                <span>{getMetadataText(item, type)}</span>
              </div>
            </div>
            {type === 'book' && item.author && (
              <div className="mt-2 text-xs text-gray-300">
                by {item.author}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
        <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>{item.year}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.rating.toFixed(1)}</span>
            {type === 'game' && item.platform && (
              <div className="ml-1 flex items-center gap-1">
                {getPlatformIcons(item.platform).map((IconComponent: LucideIcon, index: number) => (
                  <IconComponent key={index} className="h-3 w-3 text-muted-foreground" />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
