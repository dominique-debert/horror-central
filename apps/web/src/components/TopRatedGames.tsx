"use client"

import { useEffect, useState } from "react"
import { MediaCard, MediaItem } from "@/components/ui/MediaCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { igdbClient } from "@/lib/igdb"



export default function TopRatedGames() {
  const [games, setGames] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        setLoading(true)
        setError(null)
        const games = await igdbClient.getTopRatedHorrorGames(8)
        setGames(games)
      } catch {
        setError('Failed to load horror games. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopRatedGames()
  }, [])

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Games</h2>
            <p className="text-gray-400 text-lg">
              Experience the most terrifying and acclaimed horror games that have redefined interactive fear
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/games">
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
            {games.map((game) => (
              <MediaCard
                key={game.id}
                item={game}
                type="game"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
