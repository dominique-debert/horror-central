"use client"

import MediaCard, { MediaItem } from "@/components/ui/MediaCard"
import Link from "next/link"

interface Movie {
  id: string
  title: string
  poster: string
  rating: number
  year: number
  duration: string
  description: string
  genre: string[]
  slug: string
}

const nowPlayingMovies: Movie[] = [
  {
    id: "1",
    title: "Scream VI",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 8.2,
    year: 2023,
    duration: "123 min",
    description: "In the sixth installment of the Scream franchise, Ghostface is back and terrorizing a new group of teenagers.",
    genre: ["Slasher", "Horror"],
    slug: "scream-vi"
  },
  {
    id: "2",
    title: "Evil Dead Rise",
    poster: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=400&h=600&fit=crop",
    rating: 7.8,
    year: 2023,
    duration: "96 min",
    description: "Two estranged sisters' reunion is cut short by the rise of flesh-possessing demons, thrusting them into a primal battle for survival.",
    genre: ["Supernatural", "Horror"],
    slug: "evil-dead-rise"
  },
  {
    id: "3",
    title: "The Nun II",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    rating: 6.9,
    year: 2023,
    duration: "110 min",
    description: "The Nun II follows Sister Irene as she once again confronts the demonic forces of evil.",
    genre: ["Supernatural", "Religious Horror"],
    slug: "the-nun-ii"
  },
  {
    id: "4",
    title: "Insidious: The Red Door",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    rating: 7.1,
    year: 2023,
    duration: "107 min",
    description: "The Lamberts, once again, must face their darkest fears in order to rescue their son from The Further.",
    genre: ["Supernatural", "Psychological Horror"],
    slug: "insidious-the-red-door"
  }
]

interface NowPlayingProps {
  movies?: Movie[]
}

export default function NowPlaying({ movies = nowPlayingMovies }: NowPlayingProps) {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Now Playing</h2>
            <p className="text-gray-400 text-lg">
              Currently showing in theaters - the latest horror releases
            </p>
          </div>
          <Link 
            href="/now-playing" 
            className="text-red-400 hover:text-red-300 transition-colors font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => {
            const mediaItem: MediaItem = {
              id: movie.id,
              title: movie.title,
              posterUrl: movie.poster,
              rating: movie.rating,
              year: movie.year,
              duration: movie.duration,
              description: movie.description,
              genre: movie.genre,
              slug: movie.slug
            }
            
            return (
              <MediaCard
                key={movie.id}
                item={mediaItem}
                index={index}
                type="movie"
                showRanking={false}
                linkPrefix="/movies"
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
