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
    title: "The Haunting of Willow Creek",
    poster: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
    rating: 8.2,
    year: 2024,
    duration: "118 min",
    description: "A family moves into an old Victorian house, only to discover that the previous residents never truly left. As supernatural events escalate, they must uncover the dark secrets hidden within the walls.",
    genre: "Horror"
  },
  {
    id: "2",
    title: "Shadows of the Past",
    poster: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=600&fit=crop",
    rating: 7.8,
    year: 2024,
    duration: "105 min",
    description: "When a detective investigates a series of mysterious disappearances, she uncovers a connection to an ancient curse that threatens to consume everyone in its path.",
    genre: "Thriller"
  },
  {
    id: "3",
    title: "Whispers in the Dark",
    poster: "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=400&h=600&fit=crop",
    rating: 8.5,
    year: 2024,
    duration: "92 min",
    description: "A young woman inherits her grandmother's isolated cabin, but soon realizes she's not alone. Something sinister lurks in the surrounding woods, waiting for the perfect moment to strike.",
    genre: "Horror"
  },
  {
    id: "4",
    title: "The Devil's Hour",
    poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=600&fit=crop",
    rating: 7.9,
    year: 2024,
    duration: "110 min",
    description: "Every night at 3:33 AM, Sarah wakes up to find her world slightly different. As reality begins to blur, she must discover the truth before she loses herself completely.",
    genre: "Supernatural"
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
