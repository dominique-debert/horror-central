'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { tmdbClient } from '@/lib/tmdb'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
// Skeleton component for loading states
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className}`} />
)

type MediaType = 'movie' | 'tv' | 'game' | 'book'

interface SearchResult {
  id: string
  title: string
  type: MediaType
  image?: string
  year?: string
  description?: string
  genres?: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = (searchParams.get('q') || '').trim()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    movies: SearchResult[]
    tvShows: SearchResult[]
    games: SearchResult[]
    books: SearchResult[]
  }>({ movies: [], tvShows: [], games: [], books: [] })
  const [activeTab, setActiveTab] = useState<MediaType | 'all'>('all')

  useEffect(() => {
    const searchAll = async () => {
      if (!q) {
        setResults({ movies: [], tvShows: [], games: [], books: [] })
        return
      }

      setIsLoading(true)
      try {
        // Search movies and TV shows from TMDB
        const [moviesResponse, tvResponse] = await Promise.all([
          tmdbClient.searchMovies(q, 1),
          tmdbClient.searchTVShows(q, 1)
        ])

        // Convert TMDB responses to our format
        const movies = moviesResponse.results.map(item => ({
          id: item.id.toString(),
          title: item.title,
          type: 'movie' as const,
          image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${item.poster_path}` : undefined,
          year: item.release_date?.split('-')[0],
          description: item.overview,
          genres: item.genre_ids?.map(id => 
            // Simple genre mapping - can be expanded
            ['Horror', 'Thriller', 'Mystery', 'Drama', 'Fantasy', 'Sci-Fi', 'Crime'][id % 7] || `Genre ${id}`
          ).filter(Boolean)
        }))

        const tvShows = tvResponse.results.map(item => ({
          id: item.id.toString(),
          title: item.name,
          type: 'tv' as const,
          image: item.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${item.poster_path}` : undefined,
          year: item.first_air_date?.split('-')[0],
          description: item.overview,
          genres: item.genre_ids?.map(id => 
            // Same genre mapping as movies for consistency
            ['Horror', 'Thriller', 'Mystery', 'Drama', 'Fantasy', 'Sci-Fi', 'Crime'][id % 7] || `Genre ${id}`
          ).filter(Boolean)
        }))

        // TODO: Add games and books search here
        // For now, using placeholder data
        const games: SearchResult[] = []
        const books: SearchResult[] = []

        setResults({
          movies,
          tvShows,
          games,
          books
        })
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(searchAll, 500)
    return () => clearTimeout(timer)
  }, [q])

  const allResults = [
    ...results.movies,
    ...results.tvShows,
    ...results.games,
    ...results.books
  ]

  const filteredResults = activeTab === 'all' 
    ? allResults 
    : allResults.filter(item => item.type === activeTab)

  const getDetailLink = (item: SearchResult) => {
    switch (item.type) {
      case 'movie':
        return `/details/movie/${item.id}`
      case 'tv':
        return `/details/tv/${item.id}`
      case 'game':
        return `/games/${item.id}`
      case 'book':
        return `/books/${item.id}`
      default:
        return '#'
    }
  }

  const getTypeBadge = (type: MediaType) => {
    const typeMap = {
      movie: { label: 'Movie', class: 'bg-blue-600' },
      tv: { label: 'TV Show', class: 'bg-purple-600' },
      game: { label: 'Game', class: 'bg-green-600' },
      book: { label: 'Book', class: 'bg-amber-600' }
    }
    const { label, class: className } = typeMap[type] || { label: type, class: 'bg-gray-600' }
    return (
      <Badge className={`text-xs ${className}`}>
        {label}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto mt-8 px-10">
      <h1 className="mb-6 text-2xl font-bold">Search Results</h1>
      {q ? (
        <>
          <div className="mb-6 flex flex-wrap gap-2 border-b pb-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="text-xs"
            >
              All
            </Button>
            <Button
              variant={activeTab === 'movie' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('movie')}
              className="text-xs"
            >
              Movies
            </Button>
            <Button
              variant={activeTab === 'tv' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('tv')}
              className="text-xs"
            >
              TV Shows
            </Button>
            <Button
              variant={activeTab === 'game' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('game')}
              className="text-xs"
            >
              Games
            </Button>
            <Button
              variant={activeTab === 'book' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('book')}
              className="text-xs"
            >
              Books
            </Button>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredResults.map((item) => (
                <div key={`${item.type}-${item.id}`}>
                  <Card className="h-full flex flex-col overflow-hidden transition-transform hover:scale-105">
                    <div className="relative h-48 w-full">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                        {getTypeBadge(item.type)}
                      </div>
                      {item.year && (
                        <p className="text-sm text-muted-foreground mt-1">{item.year}</p>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.genres && item.genres.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.genres?.slice(0, 3).map((genre, idx) => (
                            <Badge key={`${genre}-${idx}`} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-0 pb-4 px-4">
                      <Button 
                        asChild 
                        variant="outline" 
                        size="sm" 
                        className="w-full bg-red-600 hover:bg-red-700 text-white hover:text-white border-red-700"
                      >
                        <Link href={getDetailLink(item)}>
                          More Info
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground">No results found for</p>
              <p className="text-xl font-semibold">&ldquo;{q}&rdquo;</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try different keywords or check the spelling.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg text-muted-foreground">
            Enter a search term to find movies, TV shows, games, and books
          </p>
        </div>
      )}
    </div>
  )
}
