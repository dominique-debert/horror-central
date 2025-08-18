import Hero from "@/components/hero"
import FeaturedGrid from "@/components/featured-grid"
import LatestReviews from "@/components/latest-reviews"

export default function Page() {
  return (
    <main className="p-8 space-y-8">
      <Hero />
      <FeaturedGrid />
      <LatestReviews />
    </main>
  )
}