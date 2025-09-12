"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { MediaCard } from "@/components/ui/MediaCard"

interface Movie {
  id: number
  title: string
  release_date: string
  vote_average: number
  poster_path: string
  overview: string
}

interface ReviewItem {
  id: string
  title: string
  type: 'movie' | 'tv' | 'game'
  year: number
  rating: number
  imageUrl: string
  author: string
  avatar: string
  date: string
  content: string
}

export default function LatestReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHorrorMovies = async () => {
      try {
        // You'll need to get an API key from themoviedb.org and add it to your .env file
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=27&sort_by=popularity.desc&page=1`
        )
        const data = await response.json()
        
        // Get the first 6 horror movies
        const movies = data.results.slice(0, 6)
        
        // Mock review data to match the ReviewItem interface
        const mockReviewers = [
          { name: 'Alex R.', avatar: 'https://i.pravatar.cc/150?img=1' },
          { name: 'Jordan M.', avatar: 'https://i.pravatar.cc/150?img=2' },
          { name: 'Taylor S.', avatar: 'https://i.pravatar.cc/150?img=3' },
          { name: 'Casey B.', avatar: 'https://i.pravatar.cc/150?img=4' },
          { name: 'Riley K.', avatar: 'https://i.pravatar.cc/150?img=5' },
          { name: 'Morgan L.', avatar: 'https://i.pravatar.cc/150?img=6' },
        ]
        
        const mockReviews = [
          'A chilling masterpiece that will keep you up at night.',
          'Atmospheric and terrifying with outstanding performances.',
          'One of the best horror films in recent years. Highly recommended!',
          'A slow burn that pays off with an unforgettable finale.',
          'Visually stunning and genuinely scary. A must-watch for horror fans.',
          'Keeps you on the edge of your seat from start to finish.'
        ]
        
        const mockDates = [
          '2 days ago',
          '1 week ago',
          '3 days ago',
          '5 days ago',
          '1 day ago',
          '4 days ago'
        ]
        
        const formattedReviews = movies.map((movie: Movie, index: number) => ({
          id: `movie-${movie.id}`,
          title: movie.title,
          type: 'movie' as const,
          year: new Date(movie.release_date).getFullYear(),
          rating: Math.round(movie.vote_average / 2), // Convert 10-point scale to 5-point
          imageUrl: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster',
          author: mockReviewers[index % mockReviewers.length].name,
          avatar: mockReviewers[index % mockReviewers.length].avatar,
          date: mockDates[index % mockDates.length],
          content: mockReviews[index % mockReviews.length] || movie.overview
        }))
        
        setReviews(formattedReviews)
      } catch (error) {
        console.error('Error fetching horror movies:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHorrorMovies()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto mt-6 px-6">
        <section className="py-6 w-full bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[2000px] mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Latest Reviews</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] w-full bg-muted rounded-lg mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="container mx-auto mt-6 px-6">
      <section className="py-6 w-full bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[2000px] mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Latest Reviews</h2>
                <p className="text-muted-foreground text-sm">
                  Read what critics and audiences are saying about the latest horror releases
                </p>
              </div>
              <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                <Link href="/reviews">
                  View All
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="group">
                  <MediaCard
                    id={review.id}
                    title={review.title}
                    year={review.year}
                    rating={review.rating}
                    imageUrl={review.imageUrl}
                    type={review.type}
                    href={`/movies/${review.id}`}
                  />
                  <div className="mt-2 p-2 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image
                          src={review.avatar}
                          alt={review.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.author} • {review.date}
                      </div>
                    </div>
                    <p className="mt-1 text-sm line-clamp-2 text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
