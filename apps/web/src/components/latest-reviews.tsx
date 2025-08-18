import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { MediaCard } from "./MediaCard"

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

const reviews: ReviewItem[] = [
  {
    id: "r1",
    title: "Whispers in the Attic",
    type: 'movie',
    year: 2024,
    rating: 4,
    imageUrl: "https://placehold.co/600x900/png?text=Movie",
    author: "Avery Night",
    avatar: "https://placehold.co/64x64/png",
    date: "2 days ago",
    content: "A slow-burn that pays off with chilling atmosphere and a memorable finale."
  },
  {
    id: "r2",
    title: "Shadows of Ravenbrook (S1)",
    type: 'tv',
    year: 2024,
    rating: 5,
    imageUrl: "https://placehold.co/600x900/png?text=TV+Show",
    author: "J. Vale",
    avatar: "https://placehold.co/64x64/png",
    date: "1 week ago",
    content: "Character-first horror with smart pacing and eerie world-building."
  },
  {
    id: "r3",
    title: "Cathedral of Ash",
    type: 'game',
    year: 2023,
    rating: 4,
    imageUrl: "https://placehold.co/600x900/png?text=Game",
    author: "M. Hallow",
    avatar: "https://placehold.co/64x64/png",
    date: "3 days ago",
    content: "Oppressive, beautiful, and brutally rewarding survival horror."
  },
  {
    id: "r4",
    title: "The Last Lullaby",
    type: 'movie',
    year: 2024,
    rating: 5,
    imageUrl: "https://placehold.co/600x900/png?text=Movie",
    author: "E. Graves",
    avatar: "https://placehold.co/64x64/png",
    date: "2 weeks ago",
    content: "A haunting tale that lingers long after the credits roll."
  },
  {
    id: "r5",
    title: "Midnight Society",
    type: 'tv',
    year: 2023,
    rating: 4,
    imageUrl: "https://placehold.co/600x900/png?text=TV+Show",
    author: "R. Blackwood",
    avatar: "https://placehold.co/64x64/png",
    date: "1 week ago",
    content: "A fresh take on the anthology format with standout performances."
  },
  {
    id: "r6",
    title: "Asylum 23",
    type: 'game',
    year: 2024,
    rating: 5,
    imageUrl: "https://placehold.co/600x900/png?text=Game",
    author: "T. Wraith",
    avatar: "https://placehold.co/64x64/png",
    date: "3 days ago",
    content: "Psychological horror at its finest with mind-bending puzzles."
  }
]

export default function LatestReviews() {
  return (
    <section className="py-6 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[2000px] mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Latest Reviews</h2>
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
                  href={`/reviews/${review.id}`}
                />
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full bg-muted">
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
  )
}
