"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Calendar, Clock, Award, Tv, Gamepad2, BookOpen } from "lucide-react"

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
  platform?: string[]
  // Book specific
  author?: string
  pages?: number
}

interface MediaCardProps {
  item: MediaItem
  index: number
  type: 'movie' | 'tv' | 'game' | 'book'
  showRanking?: boolean
  linkPrefix: string
}

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "text-green-400"
  if (rating >= 8.0) return "text-yellow-400"
  if (rating >= 7.0) return "text-orange-400"
  return "text-red-400"
}

function getMetadataIcon(type: string) {
  switch (type) {
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

function getMetadataText(item: MediaItem, type: string): string {
  switch (type) {
    case 'tv':
      return item.seasons ? `${item.seasons} seasons` : 'TV Series'
    case 'game':
      return item.platform ? item.platform.slice(0, 2).join(', ') : 'Multi-platform'
    case 'book':
      return item.pages ? `${item.pages} pages` : 'Novel'
    default:
      return item.duration || 'Movie'
  }
}

function getAudienceLabel(type: string): string {
  switch (type) {
    case 'game':
      return 'Players'
    case 'book':
      return 'Readers'
    default:
      return 'Audience'
  }
}

export default function MediaCard({ item, index, type, showRanking = true, linkPrefix }: MediaCardProps) {
  const imageUrl = item.posterUrl || item.coverUrl || ''
  const MetadataIcon = getMetadataIcon(type)
  
  return (
    <Card className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group relative">
      {showRanking && index < 3 && (
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            {index + 1}
          </div>
        </div>
      )}
      
      <div className="relative overflow-hidden">
        <Image
          src={imageUrl}
          alt={item.title}
          width={300}
          height={450}
          className="w-full h-64 object-cover rounded-t-lg"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center ml-2">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className={`font-bold ${getRatingColor(item.rating)}`}>
              {item.rating}
            </span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Calendar className="w-3 h-3 mr-1" />
          <span className="mr-3">{item.year}</span>
          <MetadataIcon className="w-3 h-3 mr-1" />
          <span>{getMetadataText(item, type)}</span>
        </div>
        
        {type === 'book' && item.author && (
          <p className="text-gray-400 text-sm mb-2">
            by <span className="text-white">{item.author}</span>
          </p>
        )}
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {item.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
              {g}
            </Badge>
          ))}
        </div>
        
        {item.awards && item.awards.length > 0 && (
          <div className="flex items-center mb-3">
            <Award className="w-3 h-3 text-yellow-400 mr-1" />
            <span className="text-xs text-yellow-400 truncate">
              {item.awards[0]}
            </span>
          </div>
        )}
        
        {(item.criticsScore || item.audienceScore) && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            {item.criticsScore && (
              <span>Critics: {item.criticsScore}%</span>
            )}
            {item.audienceScore && (
              <span>{getAudienceLabel(type)}: {item.audienceScore}%</span>
            )}
          </div>
        )}
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
          asChild
        >
          <Link href={`${linkPrefix}/${item.slug}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
