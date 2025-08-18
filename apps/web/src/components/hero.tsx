import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-foreground">Your hub for all things</span>{" "}
            <span className="text-primary">Horror</span>
          </h1>
          <p className="mx-auto max-w-2xl text-balance text-muted-foreground md:text-lg">
            Discover, review, and track horror movies, TV shows, and games. Curated lists, trending titles, and your personalized watchlist.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="px-6">
              <Link href="/explore">Browse Library</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-6">
              <Link href="/auth/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
