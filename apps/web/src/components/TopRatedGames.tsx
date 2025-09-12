"use client"

import { MediaCard } from "@/components/ui/MediaCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTopRatedHorrorGames } from "@/hooks/useGames"

export default function TopRatedGames() {
  const { data: games = [], isLoading, isError, refetch } = useTopRatedHorrorGames(8)

  return (
    <div className="container mx-auto mt-6 px-6">
      <section className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Rated Horror Games</h2>
            <p className="text-gray-400 mt-1">
              Experience the most terrifying and acclaimed horror games that have redefined interactive fear
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/games">
              View All
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">Failed to load games. Please try again later.</p>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <MediaCard key={game.id} item={game} type="game" />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No games found.</p>
          </div>
        )}
      </section>
    </div>
  )
}
