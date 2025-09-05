"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { MediaCard, MediaItem } from "@/components/ui/MediaCard"
import { tmdbClient, tmdbTVToMediaItem } from "@/lib/tmdb"

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
  const [topRatedShows, setTopRatedShows] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopRatedShows = async () => {
      try {
        setLoading(true)
        setError(null)
        const [showsResponse, genresResponse] = await Promise.all([
          tmdbClient.getTopRatedHorrorTVShows(1),
          tmdbClient.getTVGenres()
        ])
        
        const mediaItems = showsResponse.results.slice(0, 8).map(show => 
          tmdbTVToMediaItem(show, genresResponse.genres)
        )
        setTopRatedShows(mediaItems)
      } catch {
        setError('Failed to load top rated TV shows. Please try again later.')
        // Fallback to mock data converted to MediaItem format
        const fallbackItems = shows.slice(0, 8).map(show => ({
          id: show.id,
          title: show.title,
          posterUrl: show.posterUrl,
          rating: show.rating,
          year: show.year,
          description: show.description,
          genre: show.genre,
          slug: show.slug
        }))
        setTopRatedShows(fallbackItems)
      } finally {
        setLoading(false)
      }
    }

    fetchTopRatedShows()
  }, [shows])

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror TV Shows</h2>
            <p className="text-gray-400 text-lg">
              Discover the most acclaimed horror television series that have captivated audiences worldwide
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/top-rated-tv">
              View All
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedShows.map((show) => (
              <MediaCard
                key={show.id}
                item={show}
                type="tv"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
