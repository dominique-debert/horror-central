import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"

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
}

export function MediaCard({ id, title, year, rating, imageUrl, type, href, className = '' }: MediaCardProps) {
  return (
    <Link href={href} className={`group block ${className}`}>
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16.66vw"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-accent bg-secondary/10 px-2 py-1 rounded-full">
              {type === 'movie' ? 'Movie' : type === 'tv' ? 'TV Show' : 'Game'}
            </span>
            <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-white line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{year}</p>
        </div>
      </div>
    </Link>
  )
}
