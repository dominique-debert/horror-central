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

interface TMDBTVDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date: string
  vote_average: number
  vote_count: number
  genres: Array<{ id: number; name: string }>
  networks: Array<{ id: number; name: string; logo_path: string | null }>
  production_companies: Array<{ id: number; name: string }>
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string
  original_language: string
  original_name: string
  episode_run_time: number[]
  created_by: Array<{ id: number; name: string }>
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
    const { id: tvId } = await params

    if (!TMDB_API_KEY) {
      return NextResponse.json(
        { error: 'TMDB API key not configured' },
        { status: 500 }
      )
    }

    // Fetch TV show details, credits, videos, and watch providers in parallel
    const [tvResponse, creditsResponse, videosResponse, watchProvidersResponse] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBTVDetails>),
      fetch(`${TMDB_BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBCredits>),
      fetch(`${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}&language=en-US`).then(res => res.json() as Promise<TMDBVideosResponse>),
      fetch(`${TMDB_BASE_URL}/tv/${tvId}/watch/providers?api_key=${TMDB_API_KEY}`).then(res => res.json() as Promise<TMDBWatchProviders>)
    ]);

    const tvDetails = tvResponse;
    const credits = creditsResponse;
    const videos = videosResponse;
    const watchProviders = watchProvidersResponse;

    // Add videos to tvDetails
    tvDetails.videos = videos;

    if (!tvDetails) {
      return NextResponse.json(
        { error: 'TV show not found' },
        { status: 404 }
      )
    }

    // Find creator/showrunner and key crew
    const creator = tvDetails.created_by.length > 0 
      ? tvDetails.created_by[0].name 
      : credits.crew.find(person => person.job === 'Executive Producer')?.name
    const showrunner = credits.crew.find(person => person.job === 'Executive Producer')?.name
    const writer = credits.crew.find(person => person.job === 'Writer' || person.job === 'Story Editor')?.name
    const producer = credits.crew.find(person => person.job === 'Producer')?.name
    const composer = credits.crew.find(person => person.job === 'Original Music Composer')?.name

    // Get full cast with photos and character names (first 20)
    const fullCast = credits.cast.slice(0, 20).map(actor => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profile_path: actor.profile_path
    }))

    // Get key crew members
    const keyCrewJobs = ['Executive Producer', 'Producer', 'Writer', 'Story Editor', 'Director', 'Original Music Composer', 'Editor', 'Cinematography']
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

    // Get average episode runtime
    const avgRuntime = tvDetails.episode_run_time.length > 0 
      ? Math.round(tvDetails.episode_run_time.reduce((a, b) => a + b, 0) / tvDetails.episode_run_time.length)
      : null

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
      id: tvDetails.id.toString(),
      title: tvDetails.name,
      posterUrl: tvDetails.poster_path 
        ? `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`
        : null,
      coverUrl: tvDetails.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tvDetails.backdrop_path}`
        : null,
      rating: tvDetails.vote_average,
      year: new Date(tvDetails.first_air_date).getFullYear(),
      description: tvDetails.overview,
      genre: tvDetails.genres.map(g => g.name),
      seasons: tvDetails.number_of_seasons,
      episodes: tvDetails.number_of_episodes,
      network: tvDetails.networks?.[0]?.name,
      status: tvDetails.status,
      showrunner,
      writer,
      producer,
      composer,
      cast: fullCast,
      crew: keyCrew,
      trailers,
      duration: avgRuntime ? `${avgRuntime} min/episode` : null,
      releaseDate: tvDetails.first_air_date,
      originalLanguage: tvDetails.original_language,
      watchProviders: processedWatchProviders,
      awards: [], // TMDB doesn't provide awards data
      criticsScore: tvDetails.vote_average * 10, // Convert to percentage
      audienceScore: tvDetails.vote_average * 10
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching TV show details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch TV show details' },
      { status: 500 }
    )
  }
}
