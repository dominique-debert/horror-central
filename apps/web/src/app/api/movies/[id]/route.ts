import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

interface TMDBVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

interface TMDBVideosResponse {
  results: TMDBVideo[]
}

interface TMDBMovieDetails {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  vote_average: number
  vote_count: number
  genres: Array<{ id: number; name: string }>
  production_companies: Array<{ id: number; name: string }>
  production_countries: Array<{ iso_3166_1: string; name: string }>
  spoken_languages: Array<{ iso_639_1: string; name: string }>
  budget: number
  revenue: number
  status: string
  tagline: string
  original_language: string
  original_title: string
  videos: TMDBVideosResponse
}

interface TMDBCredits {
  cast: Array<{
    id: number
    name: string
    character: string
    profile_path: string | null
  }>
  crew: Array<{
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }>
}

interface TMDBWatchProviders {
  results: {
    [countryCode: string]: {
      link: string
      flatrate?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      rent?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      buy?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
      ads?: Array<{
        logo_path: string
        provider_id: number
        provider_name: string
      }>
    }
  }
}

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
      fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBMovieDetails>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBCredits>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBVideosResponse>),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`).then(res => res.json() as Promise<TMDBWatchProviders>)
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

    // Define types for watch providers
    interface WatchProvider {
      provider_name: string
      logo_path: string
      type: string
      region: string
    }

    // Process watch providers
    const processedWatchProviders: WatchProvider[] = []
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
            } as WatchProvider)
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
