"use client"

import MovieCard from "@/components/movie-card"

interface Movie {
  id: string
  title: string
  poster: string
  rating: number
  year: number
  duration: string
  description: string
  genre: string
}

const nowPlayingMovies: Movie[] = [
  {
    id: "1",
    title: "Scream VI",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 8.2,
    year: 2023,
    duration: "123 min",
    description: "In the sixth installment of the Scream franchise, Ghostface is back and terrorizing a new group of teenagers.",
    genre: "Horror"
  },
  {
    id: "2",
    title: "Evil Dead Rise",
    poster: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=400&h=600&fit=crop",
    rating: 7.8,
    year: 2023,
    duration: "96 min",
    description: "Two estranged sisters' reunion is cut short by the rise of flesh-possessing demons, thrusting them into a primal battle for survival.",
    genre: "Horror"
  },
  {
    id: "3",
    title: "The Nun II",
    poster: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
    rating: 6.9,
    year: 2023,
    duration: "110 min",
    description: "The Nun II follows Sister Irene as she once again confronts the demonic forces of evil.",
    genre: "Horror"
  },
  {
    id: "4",
    title: "Insidious: The Red Door",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    rating: 7.1,
    year: 2023,
    duration: "107 min",
    description: "The Lamberts, once again, must face their darkest fears in order to rescue their son from The Further.",
    genre: "Horror"
  }
]

export default function NowPlaying() {
  const handleMovieClick = (movieId: string) => {
    // Navigate to movie detail page
    window.location.href = `/movies/${movieId}`
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Now Playing</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {nowPlayingMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            poster={movie.poster}
            rating={movie.rating}
            year={movie.year}
            duration={movie.duration}
            description={movie.description}
            genre={movie.genre}
            onClick={() => handleMovieClick(movie.id)}
          />
        ))}
      </div>
    </section>
  )
}
