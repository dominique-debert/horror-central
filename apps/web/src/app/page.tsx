import HeroSection from "@/components/hero-section"
import NowPlaying from "@/components/now-playing"
import FeaturedGrid from "@/components/featured-grid"
import LatestReviews from "@/components/latest-reviews"
import LatestNews from "@/components/latest-news"
import ComingSoon from "@/components/coming-soon"
import TopRated from "@/components/top-rated"

export default function Page() {
  return (
    <main className="space-y-0">
      <HeroSection
        title="Nightmare on Elm Street"
        description="Nancy Thompson must think fast and stay awake to survive, as Freddy Krueger stalks the teenagers of Springwood in their dreams, turning their most peaceful moments into an endless nightmare."
        backgroundImage="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop"
        trailerUrl="https://www.youtube.com/watch?v=dCVh4lBfW-c"
        moreInfoUrl="/movies/nightmare-on-elm-street"
      />
      <div className="p-8 space-y-12">
        <NowPlaying />
        <ComingSoon />
        <TopRated />
        <LatestNews />
        <FeaturedGrid />
        <LatestReviews />
      </div>
    </main>
  )
}