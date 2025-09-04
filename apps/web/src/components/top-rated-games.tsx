"use client"

import MediaCard, { MediaItem } from "@/components/ui/media-card"
import Link from "next/link"

interface TopRatedGame {
  id: string
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  platform: string[]
  developer: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
}

interface TopRatedGamesProps {
  games?: TopRatedGame[]
}

const defaultGames: TopRatedGame[] = [
  {
    id: "1",
    title: "Silent Hill 2",
    description: "A psychological horror masterpiece that explores themes of guilt and trauma through atmospheric storytelling and innovative gameplay.",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 9.2,
    year: 2001,
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Team Silent",
    genre: ["Psychological Horror", "Survival"],
    awards: ["Game of the Year", "Best Horror Game"],
    criticsScore: 95,
    audienceScore: 94,
    slug: "silent-hill-2"
  },
  {
    id: "2",
    title: "Resident Evil 4",
    description: "A revolutionary survival horror game that redefined the genre with its perfect blend of action and terror.",
    posterUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 9.0,
    year: 2005,
    platform: ["PC", "PlayStation", "Nintendo", "Xbox"],
    developer: "Capcom",
    genre: ["Survival Horror", "Action"],
    awards: ["IGN Game of the Year", "GameSpot Best Action Game"],
    criticsScore: 96,
    audienceScore: 92,
    slug: "resident-evil-4"
  },
  {
    id: "3",
    title: "Amnesia: The Dark Descent",
    description: "An indie horror phenomenon that popularized the helpless protagonist concept and psychological terror over combat.",
    posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.8,
    year: 2010,
    platform: ["PC", "Mac", "Linux"],
    developer: "Frictional Games",
    genre: ["Psychological Horror", "Indie"],
    awards: ["Independent Games Festival Excellence in Audio"],
    criticsScore: 85,
    audienceScore: 91,
    slug: "amnesia-dark-descent"
  },
  {
    id: "4",
    title: "Dead Space",
    description: "A sci-fi horror masterpiece that combines strategic dismemberment gameplay with intense atmospheric horror in space.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 2008,
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "EA Redwood Shores",
    genre: ["Sci-Fi Horror", "Survival"],
    awards: ["Spike Video Game Awards Best Horror Game"],
    criticsScore: 89,
    audienceScore: 88,
    slug: "dead-space"
  },
  {
    id: "5",
    title: "Outlast",
    description: "A first-person survival horror that emphasizes stealth and psychological terror over combat in an abandoned asylum.",
    posterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 2013,
    platform: ["PC", "PlayStation", "Xbox", "Nintendo"],
    developer: "Red Barrels",
    genre: ["Survival Horror", "Indie"],
    awards: ["Canadian Video Game Awards Best Independent Game"],
    criticsScore: 80,
    audienceScore: 86,
    slug: "outlast"
  },
  {
    id: "6",
    title: "Phasmophobia",
    description: "A cooperative ghost hunting game that became a viral sensation with its innovative use of voice recognition and multiplayer horror.",
    posterUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 8.3,
    year: 2020,
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Kinetic Games",
    genre: ["Cooperative Horror", "Indie"],
    awards: ["Steam Awards Most Innovative Gameplay"],
    criticsScore: 78,
    audienceScore: 89,
    slug: "phasmophobia"
  }
]


export default function TopRatedGames({ games = defaultGames }: TopRatedGamesProps) {
  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Games</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the most terrifying and acclaimed horror games that have redefined interactive fear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const mediaItem: MediaItem = {
              id: game.id,
              title: game.title,
              posterUrl: game.posterUrl,
              rating: game.rating,
              year: game.year,
              platform: game.platform,
              description: game.description,
              genre: game.genre,
              awards: game.awards,
              criticsScore: game.criticsScore,
              audienceScore: game.audienceScore,
              slug: game.slug
            }
            
            return (
              <MediaCard
                key={game.id}
                item={mediaItem}
                index={index}
                type="game"
                linkPrefix="/games"
              />
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/games" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Horror Games
          </Link>
        </div>
      </div>
    </section>
  )
}
