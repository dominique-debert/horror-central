import Link from "next/link"
import { Button } from "@/components/ui/button"
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
    title: "The Conjuring",
    href: "/movies/the-conjuring",
    image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wVYREutTvI2tmxr6ujrHT704wGF.jpg",
    tag: "Movie",
    year: 2013,
    rating: 7.5,
    genre: "Horror, Mystery, Thriller"
  },
  {
    id: "movie-2",
    title: "Hereditary",
    href: "/movies/hereditary",
    image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/adPCF2ltY2moH6mApha9RilvcMO.jpg",
    tag: "Movie",
    year: 2018,
    rating: 7.3,
    genre: "Horror, Mystery, Thriller"
  },
  {
    id: "tv-1",
    title: "The Haunting of Hill House",
    href: "/tv/hill-house",
    image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/38PkhBGRQtmVx2drvPik3F42qHO.jpg",
    tag: "TV",
    year: 2018,
    rating: 8.6,
    genre: "Horror, Drama, Mystery"
  },
  {
    id: "tv-2",
    title: "The Last of Us",
    href: "/tv/the-last-of-us",
    image: "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg",
    tag: "TV",
    year: 2023,
    rating: 8.8,
    genre: "Action, Adventure, Drama"
  },
  {
    id: "game-1",
    title: "Resident Evil 4 Remake",
    href: "/games/resident-evil-4",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6bo0.webp",
    tag: "Game",
    year: 2023,
    rating: 9.3,
    genre: "Survival Horror, Action"
  },
  {
    id: "game-2",
    title: "Dead Space Remake",
    href: "/games/dead-space",
    image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5esn.webp",
    tag: "Game",
    year: 2023,
    rating: 9.0,
    genre: "Survival Horror, Action"
  }
]

export default function FeaturedGrid() {
  return (
    <section className="py-8 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[2000px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">Featured & Trending</h2>
              <p className="text-muted-foreground text-sm">
                Discover the most popular horror content across movies, TV shows, books, and games
              </p>
            </div>
            <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <Link href="/featured">
                View All
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <MediaCard
                key={item.id}
                id={item.id}
                title={item.title}
                year={item.year}
                rating={item.rating}
                imageUrl={item.image}
                type="movie"
                href={item.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
