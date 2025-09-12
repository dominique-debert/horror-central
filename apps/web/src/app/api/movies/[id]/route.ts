import { NextRequest, NextResponse } from 'next/server'
import type { 
  ITMDBVideosResponse,
  ITMDBMovieDetailsRoute,
  ITMDBCredits,
  ITMDBWatchProviders,
  IWatchProvider
} from '@/types'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: movieId } = await params

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      )
    }

    // Fetch movie details, credits, videos, and watch providers in parallel
    const [movieResponse, creditsResponse, videosResponse, watchProvidersResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<ITMDBMovieDetailsRoute>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<ITMDBCredits>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<ITMDBVideosResponse>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`).then(res => res.json() as Promise<ITMDBWatchProviders>)
    ]);

    const movieDetails = movieResponse;
    const credits = creditsResponse;
    const videos = videosResponse;
    const watchProviders = watchProvidersResponse;

    // Add videos to movieDetails
    movieDetails.videos = videos;

    if (!movieDetails) {
      return NextResponse.json(
        { error: 'Movie not found' },
        { status: 404 }
      )
    }

    // Find director and key crew
    const director = credits.crew.find(person => person.job === 'Director')?.name
    const writer = credits.crew.find(person => person.job === 'Writer' || person.job === 'Screenplay')?.name
    const producer = credits.crew.find(person => person.job === 'Producer')?.name
    const cinematographer = credits.crew.find(person => person.job === 'Director of Photography')?.name
    const composer = credits.crew.find(person => person.job === 'Original Music Composer')?.name

    // Get full cast with photos and character names (first 20)
    const fullCast = credits.cast.slice(0, 20).map(actor => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path
    }))

    // Get key crew members
    const keyCrewJobs = ['Director', 'Writer', 'Screenplay', 'Producer', 'Executive Producer', 'Director of Photography', 'Original Music Composer', 'Editor', 'Production Designer']
    const keyCrew = credits.crew
      .filter(person => keyCrewJobs.includes(person.job))
      .slice(0, 15)
      .map(person => ({
        id: person.id,
        name: person.name,
        job: person.job,
        department: person.department,
        profile_path: person.profile_path
      }))

    // Format budget and revenue
    const formatCurrency = (amount: number) => {
      if (amount === 0) return null
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    // Process watch providers
    const processedWatchProviders: IWatchProvider[] = []
    const regions = ['US', 'GB', 'CA', 'AU'] // Priority regions
    
    for (const region of regions) {
      const regionData = watchProviders.results[region]
      if (regionData) {
        const addProviders = (providers: Array<{provider_name: string, logo_path: string}> | undefined, type: string) => {
          if (!providers) return
          providers.forEach(provider => {
            processedWatchProviders.push({
              provider_name: provider.provider_name,
              logo_path: provider.logo_path,
              type,
              region
            } as IWatchProvider)
          })
        }

        addProviders(regionData.flatrate, 'stream')
        addProviders(regionData.rent, 'rent')
        addProviders(regionData.buy, 'buy')
        addProviders(regionData.ads, 'free')
      }
    }

    // Get trailers (filter for YouTube trailers)
    const trailers = videos.results
      .filter(video => video.site === 'YouTube' && video.type === 'Trailer')
      .map(video => ({
        id: video.id,
        key: video.key,
        name: video.name,
        site: video.site,
        type: video.type,
        official: video.official
      }));

    const response = {
      id: movieDetails.id.toString(),
      title: movieDetails.title,
      posterUrl: movieDetails.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
        : null,
      coverUrl: movieDetails.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
        : null,
      rating: movieDetails.vote_average,
      year: new Date(movieDetails.release_date).getFullYear(),
      duration: movieDetails.runtime ? `${movieDetails.runtime} min` : null,
      description: movieDetails.overview,
      genre: movieDetails.genres.map(g => g.name),
      director,
      writer,
      producer,
      cinematographer,
      composer,
      cast: fullCast,
      crew: keyCrew,
      trailers,
      budget: formatCurrency(movieDetails.budget),
      boxOffice: formatCurrency(movieDetails.revenue),
      releaseDate: movieDetails.release_date,
      originalLanguage: movieDetails.original_language,
      watchProviders: processedWatchProviders,
      awards: [], // TMDB doesn't provide awards data
      criticsScore: movieDetails.vote_average * 10, // Convert to percentage
      audienceScore: movieDetails.vote_average * 10
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    )
  }
}
