import Image from "next/image"
import Link from "next/link"

interface ReviewItem {
  id: string
  title: string
  href: string
  image: string
  avatar: string
  author: string
  snippet: string
  rating: number
}

const reviews: ReviewItem[] = [
  {
    id: "r1",
    title: "Whispers in the Attic",
    href: "/movies",
    image: "https://placehold.co/640x360/png?text=Review+Image",
    avatar: "https://placehold.co/64x64/png",
    author: "Avery Night",
    snippet: "A slow-burn that pays off with chilling atmosphere and a memorable finale.",
    rating: 4,
  },
  {
    id: "r2",
    title: "Shadows of Ravenbrook (S1)",
    href: "/tv",
    image: "https://placehold.co/640x360/png?text=Review+Image",
    avatar: "https://placehold.co/64x64/png",
    author: "J. Vale",
    snippet: "Character-first horror with smart pacing and eerie world-building.",
    rating: 5,
  },
  {
    id: "r3",
    title: "Cathedral of Ash",
    href: "/games",
    image: "https://placehold.co/640x360/png?text=Review+Image",
    avatar: "https://placehold.co/64x64/png",
    author: "M. Hallow",
    snippet: "Oppressive, beautiful, and brutally rewarding survival horror.",
    rating: 4,
  },
]

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-primary" : "text-muted-foreground"}>★</span>
      ))}
    </div>
  )
}

export default function LatestReviews() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Latest Reviews</h2>
          <Link href="/reviews" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <Link key={r.id} href={r.href} className="group overflow-hidden rounded-lg border">
              <div className="relative h-40 w-full bg-muted">
                <Image
                  src={r.image}
                  alt={r.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-3 p-4">
                <h3 className="line-clamp-1 font-medium text-foreground">{r.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{r.snippet}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image src={r.avatar} alt={r.author} width={24} height={24} className="rounded-full" />
                    <span className="text-xs text-muted-foreground">{r.author}</span>
                  </div>
                  <Stars value={r.rating} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
