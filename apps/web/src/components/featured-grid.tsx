import Image from "next/image"
import Link from "next/link"

interface Item {
  id: string
  title: string
  href: string
  image: string
  tag: string
}

const items: Item[] = [
  {
    id: "movie-1",
    title: "The Haunting Shadows",
    href: "/movies",
    image: "https://placehold.co/600x900/png?text=Movie",
    tag: "Movie",
  },
  {
    id: "movie-2",
    title: "Crimson Whispers",
    href: "/movies",
    image: "https://placehold.co/600x900/png?text=Movie",
    tag: "Movie",
  },
  {
    id: "tv-1",
    title: "Nightfall: Season 1",
    href: "/tv",
    image: "https://placehold.co/1200x675/png?text=TV+Show",
    tag: "TV",
  },
  {
    id: "tv-2",
    title: "The Quiet Ones",
    href: "/tv",
    image: "https://placehold.co/1200x675/png?text=TV+Show",
    tag: "TV",
  },
  {
    id: "game-1",
    title: "Echoes of Dread",
    href: "/games",
    image: "https://placehold.co/1200x675/png?text=Game",
    tag: "Game",
  },
  {
    id: "game-2",
    title: "Labyrinth of Bones",
    href: "/games",
    image: "https://placehold.co/1200x675/png?text=Game",
    tag: "Game",
  },
]

export default function FeaturedGrid() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured & Trending</h2>
            <p className="text-sm text-muted-foreground">Movies, TV shows, and games — refreshed regularly.</p>
          </div>
          <Link href="/explore" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="group overflow-hidden rounded-lg border">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted sm:aspect-[16/9]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                />
                <span className="absolute left-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur">
                  {item.tag}
                </span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-1 font-medium text-foreground">{item.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">Tap to see more</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
