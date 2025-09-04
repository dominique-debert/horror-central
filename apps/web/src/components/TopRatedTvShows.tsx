"use client"

import MediaCard, { MediaItem } from "@/components/ui/MediaCard"
import Link from "next/link"

interface TopRatedTVShow {
  id: string
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  seasons: number
  episodes: number
  creator: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
}

interface TopRatedTVShowsProps {
  shows?: TopRatedTVShow[]
}

const defaultShows: TopRatedTVShow[] = [
  {
    id: "1",
    title: "The Haunting of Hill House",
    description: "A modern masterpiece that explores family trauma through supernatural horror with exceptional character development.",
    posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 8.6,
    year: 2018,
    seasons: 1,
    episodes: 10,
    creator: "Mike Flanagan",
    genre: ["Supernatural", "Drama", "Horror"],
    awards: ["Emmy Nominated"],
    criticsScore: 93,
    audienceScore: 91,
    slug: "haunting-of-hill-house"
  },
  {
    id: "2",
    title: "American Horror Story",
    description: "An anthology series that reinvents horror storytelling with each season, featuring stellar performances and creative narratives.",
    posterUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 8.0,
    year: 2011,
    seasons: 12,
    episodes: 132,
    creator: "Ryan Murphy",
    genre: ["Anthology", "Horror", "Drama"],
    awards: ["Emmy Winner", "Golden Globe Winner"],
    criticsScore: 78,
    audienceScore: 84,
    slug: "american-horror-story"
  },
  {
    id: "3",
    title: "The Walking Dead",
    description: "A post-apocalyptic horror series that redefined zombie television with compelling characters and intense survival drama.",
    posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.2,
    year: 2010,
    seasons: 11,
    episodes: 177,
    creator: "Frank Darabont",
    genre: ["Zombie", "Drama", "Horror"],
    awards: ["Saturn Award Winner"],
    criticsScore: 82,
    audienceScore: 88,
    slug: "the-walking-dead"
  },
  {
    id: "4",
    title: "Stranger Things",
    description: "A nostalgic supernatural thriller that perfectly blends 80s horror with coming-of-age storytelling and memorable characters.",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 2016,
    seasons: 4,
    episodes: 42,
    creator: "The Duffer Brothers",
    genre: ["Supernatural", "Sci-Fi", "Horror"],
    awards: ["SAG Award Winner", "Emmy Nominated"],
    criticsScore: 89,
    audienceScore: 93,
    slug: "stranger-things"
  },
  {
    id: "5",
    title: "Bates Motel",
    description: "A psychological thriller prequel to Psycho that explores the complex relationship between Norman Bates and his mother.",
    posterUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.1,
    year: 2013,
    seasons: 5,
    episodes: 50,
    creator: "Carlton Cuse",
    genre: ["Psychological", "Thriller", "Horror"],
    awards: ["Critics Choice Award"],
    criticsScore: 85,
    audienceScore: 89,
    slug: "bates-motel"
  },
  {
    id: "6",
    title: "The Exorcist",
    description: "A television adaptation that successfully expands the iconic horror franchise with fresh scares and compelling mythology.",
    posterUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 7.9,
    year: 2016,
    seasons: 2,
    episodes: 20,
    creator: "Jeremy Slater",
    genre: ["Supernatural", "Horror", "Drama"],
    awards: ["Saturn Award Nominated"],
    criticsScore: 81,
    audienceScore: 76,
    slug: "the-exorcist-tv"
  }
]

export default function TopRatedTVShows({ shows = defaultShows }: TopRatedTVShowsProps) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror TV Shows</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most acclaimed horror television series that have captivated audiences worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show, index) => {
            const mediaItem: MediaItem = {
              id: show.id,
              title: show.title,
              posterUrl: show.posterUrl,
              rating: show.rating,
              year: show.year,
              seasons: show.seasons,
              description: show.description,
              genre: show.genre,
              awards: show.awards,
              criticsScore: show.criticsScore,
              audienceScore: show.audienceScore,
              slug: show.slug
            }
            
            return (
              <MediaCard
                key={show.id}
                item={mediaItem}
                index={index}
                type="tv"
                linkPrefix="/tv-shows"
              />
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/tv-shows" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Horror TV Shows
          </Link>
        </div>
      </div>
    </section>
  )
}
