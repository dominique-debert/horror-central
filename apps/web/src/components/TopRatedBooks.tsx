"use client"

import { MediaCard, MediaItem } from "@/components/ui/MediaCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TopRatedBook {
  id: string
  title: string
  description: string
  coverUrl: string
  rating: number
  year: number
  pages: number
  author: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
}

interface TopRatedBooksProps {
  books?: TopRatedBook[]
}

const defaultBooks: TopRatedBook[] = [
  {
    id: "1",
    title: "The Exorcist",
    description: "William Peter Blatty's masterpiece that redefined supernatural horror literature with its terrifying exploration of faith and evil.",
    coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 9.1,
    year: 1971,
    pages: 340,
    author: "William Peter Blatty",
    genre: ["Supernatural", "Religious Horror"],
    awards: ["New York Times Bestseller", "Horror Writers Association Award"],
    criticsScore: 92,
    audienceScore: 89,
    slug: "the-exorcist"
  },
  {
    id: "2",
    title: "The Shining",
    description: "Stephen King's psychological horror masterpiece about isolation, madness, and the supernatural forces within the Overlook Hotel.",
    coverUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 8.9,
    year: 1977,
    pages: 447,
    author: "Stephen King",
    genre: ["Psychological Horror", "Supernatural"],
    awards: ["World Fantasy Award Nominee", "Locus Award Winner"],
    criticsScore: 88,
    audienceScore: 91,
    slug: "the-shining"
  },
  {
    id: "3",
    title: "The Haunting of Hill House",
    description: "Shirley Jackson's seminal work that established the template for modern haunted house stories with subtle psychological terror.",
    coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 1959,
    pages: 246,
    author: "Shirley Jackson",
    genre: ["Gothic Horror", "Psychological"],
    awards: ["National Book Award Finalist", "Time Magazine All-Time 100 Novels"],
    criticsScore: 95,
    audienceScore: 86,
    slug: "haunting-of-hill-house"
  },
  {
    id: "4",
    title: "Dracula",
    description: "Bram Stoker's iconic vampire novel that created the template for modern vampire fiction and remains unmatched in gothic atmosphere.",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 1897,
    pages: 418,
    author: "Bram Stoker",
    genre: ["Gothic Horror", "Classic"],
    awards: ["Literary Classic", "Horror Hall of Fame"],
    criticsScore: 90,
    audienceScore: 88,
    slug: "dracula"
  },
  {
    id: "5",
    title: "The Silence of the Lambs",
    description: "Thomas Harris's psychological thriller featuring the iconic Hannibal Lecter, blending crime and horror in unforgettable fashion.",
    coverUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.6,
    year: 1988,
    pages: 352,
    author: "Thomas Harris",
    genre: ["Psychological Thriller", "Crime Horror"],
    awards: ["Bram Stoker Award Winner", "Anthony Award Winner"],
    criticsScore: 87,
    audienceScore: 92,
    slug: "silence-of-the-lambs"
  },
  {
    id: "6",
    title: "World War Z",
    description: "Max Brooks's innovative oral history of a zombie apocalypse that revolutionized zombie fiction with its realistic approach.",
    coverUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 8.2,
    year: 2006,
    pages: 342,
    author: "Max Brooks",
    genre: ["Zombie Horror", "Post-Apocalyptic"],
    awards: ["Scribe Award Winner", "New York Times Bestseller"],
    criticsScore: 83,
    audienceScore: 89,
    slug: "world-war-z"
  }
]


export default function TopRatedBooks({ books = defaultBooks }: TopRatedBooksProps) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
            <p className="text-gray-400 text-lg">
              Discover the most influential and terrifying horror literature that has shaped the genre for generations
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/books">
              View All
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.slice(0, 8).map((book) => {
            const mediaItem: MediaItem = {
              id: book.id,
              title: book.title,
              coverUrl: book.coverUrl,
              rating: book.rating,
              year: book.year,
              pages: book.pages,
              author: book.author,
              description: book.description,
              genre: book.genre,
              awards: book.awards,
              criticsScore: book.criticsScore,
              audienceScore: book.audienceScore,
              slug: book.slug
            }
            
            return (
              <MediaCard
                key={book.id}
                item={mediaItem}
                type="book"
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
