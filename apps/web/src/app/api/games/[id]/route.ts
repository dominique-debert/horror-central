import { NextResponse } from 'next/server'

const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET

interface IGDBGame {
  id: number
  name: string
  summary?: string
  cover?: {
    id: number
    url: string
  }
  first_release_date?: number
  rating?: number
  rating_count?: number
  genres?: Array<{ id: number; name: string }>
  platforms?: Array<{ id: number; name: string }>
  involved_companies?: Array<{
    id: number
    company: { id: number; name: string }
    developer: boolean
    publisher: boolean
  }>
  game_modes?: Array<{ id: number; name: string }>
  themes?: Array<{ id: number; name: string }>
  keywords?: Array<{ id: number; name: string }>
  storyline?: string
  url?: string
}

async function getIGDBAccessToken() {
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: IGDB_CLIENT_ID!,
      client_secret: IGDB_CLIENT_SECRET!,
      grant_type: 'client_credentials',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get IGDB access token')
  }

  const data = await response.json()
  return data.access_token
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: gameId } = await params

    if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'IGDB credentials not configured' },
        { status: 500 }
      )
    }

    // Get access token
    const accessToken = await getIGDBAccessToken()

    // Fetch game details from IGDB
    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID!,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: `fields name,summary,cover.url,first_release_date,rating,rating_count,genres.name,platforms.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,game_modes.name,themes.name,keywords.name,storyline,url; where id = ${gameId};`
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    const games: IGDBGame[] = await response.json()
    
    if (games.length === 0) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    const game = games[0]

    // Find developer and publisher
    const developer = game.involved_companies?.find(company => company.developer)?.company.name
    const publisher = game.involved_companies?.find(company => company.publisher)?.company.name

    // Convert IGDB cover URL to high resolution
    const coverUrl = game.cover?.url 
      ? game.cover.url.replace('t_thumb', 't_cover_big')
      : null

    // Format platforms
    const platforms = game.platforms?.map(p => p.name) || []

    // Combine themes and keywords for genres
    const genres = [
      ...(game.genres?.map(g => g.name) || []),
      ...(game.themes?.map(t => t.name) || [])
    ].slice(0, 5) // Limit to 5 genres

    // Convert IGDB rating (0-100) to our scale (0-10)
    const rating = game.rating ? game.rating / 10 : 0

    // Format release year
    const year = game.first_release_date 
      ? new Date(game.first_release_date * 1000).getFullYear()
      : new Date().getFullYear()

    const gameDetails = {
      id: game.id.toString(),
      title: game.name,
      coverUrl: coverUrl ? `https:${coverUrl}` : null,
      posterUrl: coverUrl ? `https:${coverUrl}` : null, // Use same image for consistency
      rating,
      year,
      description: game.summary || game.storyline || 'No description available.',
      genre: genres,
      platform: platforms,
      developer,
      publisher,
      awards: [], // IGDB doesn't provide awards data
      criticsScore: rating * 10, // Convert back to percentage for display
      audienceScore: rating * 10
    }

    return NextResponse.json(gameDetails)
  } catch (error) {
    console.error('Error fetching game details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch game details' },
      { status: 500 }
    )
  }
}
