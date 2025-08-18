import Link from "next/link"
import { MediaCard } from "./MediaCard"

interface Item {
  id: string
  title: string
  href: string
  image: string
  tag: string
  year: number
  rating: number
  genre: string
}

const items: Item[] = [
  {
    id: "movie-1",
    title: "The Haunting Shadows",
    href: "/movies",
    image: "https://placehold.co/600x900/png?text=Movie",
    tag: "Movie",
    year: 2024,
    rating: 8.5,
    genre: "Horror, Thriller"
  },
  {
    id: "movie-2",
    title: "Crimson Whispers",
    href: "/movies",
    image: "https://placehold.co/600x900/png?text=Movie",
    tag: "Movie",
    year: 2023,
    rating: 7.8,
    genre: "Horror, Mystery"
  },
  {
    id: "tv-1",
    title: "Nightfall: Season 1",
    href: "/tv",
    image: "https://placehold.co/600x900/png?text=TV+Show",
    tag: "TV",
    year: 2024,
    rating: 9.0,
    genre: "Horror, Drama"
  },
  {
    id: "tv-2",
    title: "The Quiet Ones",
    href: "/tv",
    image: "https://placehold.co/600x900/png?text=TV+Show",
    tag: "TV",
    year: 2023,
    rating: 8.2,
    genre: "Horror, Supernatural"
  },
  {
    id: "game-1",
    title: "Echoes of Dread",
    href: "/games",
    image: "https://placehold.co/600x900/png?text=Game",
    tag: "Game",
    year: 2024,
    rating: 8.7,
    genre: "Survival Horror"
  },
  {
    id: "game-2",
    title: "Labyrinth of Bones",
    href: "/games",
    image: "https://placehold.co/600x900/png?text=Game",
    tag: "Game",
    year: 2023,
    rating: 9.1,
    genre: "Action, Horror"
  }
]

export default function FeaturedGrid() {
  return (
    <section className="py-8 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[2000px] mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Featured & Trending</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title}
                year={item.year}
                rating={item.rating}
                imageUrl={item.image}
                type={item.tag.toLowerCase()}
                href={item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
