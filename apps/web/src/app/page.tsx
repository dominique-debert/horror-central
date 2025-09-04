import HeroSection from "@/components/HeroSection"
import NowPlaying from "@/components/NowPlaying"
import LatestNews from "@/components/LatestNews"
import ComingSoon from "@/components/ComingSoon"
import TopRated from "@/components/TopRated"
import TopRatedTVShows from "@/components/TopRatedTvShows"
import TopRatedGames from "@/components/TopRatedGames"
import TopRatedBooks from "@/components/TopRatedBooks"

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
        <TopRatedTVShows />
        <TopRatedGames />
        <TopRatedBooks />
        <LatestNews />
      </div>
    </main>
  )
}