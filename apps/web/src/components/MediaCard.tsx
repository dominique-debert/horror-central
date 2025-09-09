'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar, Play, Gamepad2, Tv } from 'lucide-react'
import type { IMediaCardProps, MediaType } from '@/types'

const getTypeIcon = (type: MediaType) => {
  switch (type) {
    case 'movie':
      return Play
    case 'tv':
      return Tv
    case 'game':
      return Gamepad2
    default:
      return Play
  }
}

const getTypeLabel = (type: MediaType) => {
  switch (type) {
    case 'movie':
      return 'Watch Movie'
    case 'tv':
      return 'Watch Series'
    case 'game':
      return 'View Game'
    default:
      return 'View'
  }
}

export function MediaCard({
  title,
  imageUrl,
  rating,
  year,
  href,
  type,
}: IMediaCardProps) {
  const TypeIcon = getTypeIcon(type)
  const typeLabel = getTypeLabel(type)

  return (
    <Link 
      href={href}
      className="group relative block overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105"
    >
      {/* Media Poster */}
      <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
        <Image
          src={imageUrl || '/images/poster-placeholder.jpg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">{typeLabel}</span>
          </div>
        </div>

        {/* Rating Badge */}
        {rating > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Year Badge */}
        {year > 0 && (
          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Calendar className="h-3 w-3 text-blue-400" />
            <span className="text-xs font-medium text-white">
              {year}
            </span>
          </div>
        )}
      </div>

      {/* Media Info */}
      <div className="p-3 bg-gray-900">
        <h3 className="font-semibold text-sm line-clamp-2 text-white mb-1 group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        
        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <TypeIcon className="h-3 w-3" />
              <span className="capitalize">{type}</span>
            </div>
          </div>
          {year > 0 && (
            <span className="font-medium">{year}</span>
          )}
        </div>
      </div>
    </Link>
  )
}