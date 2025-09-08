"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MediaCard } from "@/components/ui/MediaCard"
import { useTopRatedTVShows } from "@/hooks/useTopRatedTVShows"
import type { MediaItem } from "@/components/ui/MediaCard"

export default function TopRatedTvShows() {
  const { data: shows = [], isLoading, error } = useTopRatedTVShows()

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
    </div>
  )
  
  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">Error loading TV shows. Please try again later.</p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  )

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Top Rated Horror TV Shows</h2>
          <p className="text-gray-400 mt-1">
            Discover the most acclaimed horror television series that have captivated audiences worldwide
          </p>
        </div>
        <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
          <Link href="/tv/top-rated">
            View All
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.isArray(shows) && shows.map((show: MediaItem) => (
          <MediaCard
            key={show.id}
            type="tv"
            item={show}
          />
        ))}
      </div>
    </section>
  )
}
