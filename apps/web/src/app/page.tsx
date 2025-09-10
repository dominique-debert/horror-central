import HeroSection from "@/components/HeroSection"
import LatestNews from "@/components/LatestNews"
import ComingSoon from "@/components/ComingSoon"
import TopRated from "@/components/TopRated"
import TopRatedTVShows from "@/components/TopRatedTvShows"
import TopRatedGames from "@/components/TopRatedGames"
import TopRatedBooks from "@/components/TopRatedBooks"

// Check for unused pages and components
// First, let me examine the file structure to identify potential unused files

// Check if there are any duplicate or unused page files

export default function Page() {
  return (
    <main className="space-y-0">
      <HeroSection />
      <div className="container mx-auto px-4 space-y-8">
        <ComingSoon />
        <TopRated />
        <TopRatedTVShows />
        <TopRatedGames />
        <TopRatedBooks />
        <LatestNews />
      </div>
    </main>
  )
}