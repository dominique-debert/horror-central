"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MediaCard } from "@/components/ui/MediaCard"
import { useTopRatedMovies } from "@/hooks/useTopRatedMovies"

export default function TopRated() {
  const { data: topRatedMovies = [], isLoading, isError, refetch } = useTopRatedMovies()

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Movies</h2>
            <p className="text-gray-400 text-lg">
              Discover the highest-rated horror movies of all time, curated by critics and audiences
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/top-rated">
              View All
            </Link>
          </Button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Failed to load top rated movies. Please try again.</p>
            <Button 
              onClick={() => refetch()}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topRatedMovies.map((movie) => (
              <MediaCard
                key={movie.id}
                item={movie}
                type="movie"
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
