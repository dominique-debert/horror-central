import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Calendar, Clock } from "lucide-react"

import type { IMovieCardProps } from '@/types'

export default function MovieCard({
  title,
  poster,
  rating,
  year,
  duration,
  description,
  genre,
  onClick,
}: IMovieCardProps) {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-card transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={poster}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Rating overlay */}
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{rating.toFixed(1)}</span>
        </div>

        {/* Genre badge */}
        {genre && (
          <div className="absolute left-2 top-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white">
            {genre}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Hover content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="text-center text-white">
            <h3 className="mb-2 text-lg font-bold">{title}</h3>
            <p className="mb-3 px-4 text-sm text-gray-200 line-clamp-3">
              {description}
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </div>
              {duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
        <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>{year}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
