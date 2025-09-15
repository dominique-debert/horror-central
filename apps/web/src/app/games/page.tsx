"use client"

import { useEffect, useState } from "react"
import { MediaCard } from "@/components/ui/MediaCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, Gamepad2, Star } from "lucide-react"
import { igdbClient } from "@/lib/igdb"

interface TopRatedGame {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  platform: string[]
  description: string
  genre: string[]
  developer?: string
  slug: string
}

const GAMES_PER_PAGE = 20

export default function GamesPage() {
  const [allTopRatedGames, setAllTopRatedGames] = useState<TopRatedGame[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(false)
  
  // Filter states
  const [selectedPlatform, setSelectedPlatform] = useState<string>("All")
  const [selectedDecade, setSelectedDecade] = useState<string>("All")
  const [sortBy, setSortBy] = useState<string>("rating")

  // Available filter options
  const platforms = ["All", "PC", "PlayStation", "Xbox", "Nintendo", "Mobile"]
  const decades = ["All", "1990s", "2000s", "2010s", "2020s"]
  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "year", label: "Release Year" },
    { value: "title", label: "Title A-Z" }
  ]

  useEffect(() => {
    fetchGames(1, true)
  }, [])

  useEffect(() => {
    if (allTopRatedGames.length > 0) {
      fetchGames(1, true)
    }
  }, [selectedPlatform, selectedDecade, sortBy])

  async function fetchGames(page: number, isInitial: boolean = false) {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      setError(null)
      
      // Determine sort order based on sortBy state
      let apiSortBy: 'rating.desc' | 'first_release_date.desc' | 'name.asc' = 'rating.desc'
      if (sortBy === 'year') apiSortBy = 'first_release_date.desc'
      else if (sortBy === 'title') apiSortBy = 'name.asc'
      
      // Determine platform filter
      let platforms: string[] | undefined
      if (selectedPlatform !== 'All') {
        platforms = [selectedPlatform]
      }
      
      // Determine year range for decade filter
      let minYear: number | undefined
      let maxYear: number | undefined
      if (selectedDecade !== 'All') {
        const decade = parseInt(selectedDecade.replace('s', ''))
        minYear = decade
        maxYear = decade + 9
      }
      
      const response = await igdbClient.getAllTimeTopRatedHorrorGames({
        page,
        sortBy: apiSortBy,
        platforms,
        minYear,
        maxYear
      })
      
      // Convert API games to our format
      const convertedGames = response.games.map((game): TopRatedGame => ({
        id: game.id,
        title: game.title,
        posterUrl: game.posterUrl,
        rating: game.rating,
        year: game.year,
        platform: game.platform,
        description: game.description,
        genre: game.genre,
        developer: game.developer,
        slug: game.slug
      }))
      
      if (isInitial) {
        setAllTopRatedGames(convertedGames)
      } else {
        setAllTopRatedGames(prev => {
          // Remove duplicates when adding new games
          const existingIds = new Set(prev.map(g => g.id))
          const newGames = convertedGames.filter((g: TopRatedGame) => !existingIds.has(g.id))
          return [...prev, ...newGames]
        })
      }
      
      // Check if there are more pages
      setHasMorePages(response.pagination.hasMore)
      
    } catch (err) {
      console.error('Error fetching top-rated games:', err)
      setError('Failed to load top-rated games. Please try again later.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  function handleLoadMore() {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchGames(nextPage, false)
  }

  // Apply client-side filtering and sorting for better UX
  const filteredGames = allTopRatedGames
    .filter(game => {
      const matchesPlatform = selectedPlatform === "All" || game.platform.some(p => 
        p.toLowerCase().includes(selectedPlatform.toLowerCase())
      )
      const decade = Math.floor(game.year / 10) * 10
      const matchesDecade = selectedDecade === "All" || 
        (selectedDecade === "1990s" && decade === 1990) ||
        (selectedDecade === "2000s" && decade === 2000) ||
        (selectedDecade === "2010s" && decade === 2010) ||
        (selectedDecade === "2020s" && decade === 2020)
      return matchesPlatform && matchesDecade
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "year") return b.year - a.year
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return 0
    })

  // Display games with pagination
  const displayedGames = filteredGames.slice(0, currentPage * GAMES_PER_PAGE)
  const hasMoreToShow = displayedGames.length < filteredGames.length || hasMorePages

  return (
    <div className="container mx-auto mt-8 px-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-4">Top Rated Horror Games</h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            Discover the most terrifying and acclaimed horror games of all time. From psychological thrillers to 
            survival horror masterpieces, experience interactive fear at its finest.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8 mb-8 justify-left">
          {/* Platform Filter */}
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Platform:</span>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatform === platform ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPlatform(platform)}
                  className={selectedPlatform === platform 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Decade Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Decade:</span>
            <div className="flex flex-wrap gap-2">
              {decades.map((decade) => (
                <Button
                  key={decade}
                  variant={selectedDecade === decade ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDecade(decade)}
                  className={selectedDecade === decade 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {decade}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-400">Sort:</span>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className={sortBy === option.value 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-8">
          <p className="text-gray-400">
            Showing {displayedGames.length} of {filteredGames.length} games
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4 text-lg">{error}</p>
            <Button 
              onClick={() => fetchGames(1, true)} 
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Games grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayedGames.map((game, index) => (
                <div key={game.id} className="relative">
                  {/* Ranking badge for top 3 */}
                  {index < 3 && (
                    <Badge 
                      className={`absolute top-2 left-2 z-10 ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                      } text-black font-bold`}
                    >
                      <Award className="w-3 h-3 mr-1" />
                      #{index + 1}
                    </Badge>
                  )}
                  <MediaCard
                    item={{
                      id: game.id,
                      title: game.title,
                      posterUrl: game.posterUrl,
                      rating: game.rating,
                      year: game.year,
                      description: game.description,
                      genre: game.genre,
                      slug: game.slug,
                      platform: game.platform
                    }}
                    type="game"
                  />
                </div>
              ))}
            </div>

            {/* Load more button */}
            {hasMoreToShow && (
              <div className="text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant="outline"
                  size="lg"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Loading More Games...
                    </>
                  ) : (
                    'View More Games'
                  )}
                </Button>
              </div>
            )}

            {/* No more games message */}
            {!hasMoreToShow && displayedGames.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">You&apos;ve reached the end of our horror games collection!</p>
              </div>
            )}
          </>
        )}
      </div>
  )
}
