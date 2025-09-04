import { NextRequest, NextResponse } from 'next/server'

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
  genres?: Array<{
    id: number
    name: string
  }>
  platforms?: Array<{
    id: number
    name: string
    abbreviation?: string
  }>
  involved_companies?: Array<{
    company: {
      name: string
    }
    developer: boolean
    publisher: boolean
  }>
  themes?: Array<{
    id: number
    name: string
  }>
}

interface GameItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  platform: string[]
  description: string
  genre: string[]
  developer?: string
  slug: string
}

class IGDBServerClient {
  private baseUrl = 'https://api.igdb.com/v4'
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null

  constructor() {
    this.clientId = process.env.IGDB_CLIENT_ID || ''
    this.clientSecret = process.env.IGDB_CLIENT_SECRET || ''
    
    if (!this.clientId || !this.clientSecret) {
      throw new Error('IGDB credentials not found in environment variables')
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken
    }

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      return this.accessToken!
    } catch (error) {
      console.error('Error getting IGDB access token:', error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, query: string): Promise<IGDBGame[]> {
    const accessToken = await this.getAccessToken()
    
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: query,
      })

      if (!response.ok) {
        throw new Error(`IGDB API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error making IGDB request to ${endpoint}:`, error)
      throw error
    }
  }

  async getTopRatedHorrorGames(limit: number = 8): Promise<IGDBGame[]> {
    // Horror theme ID is 19, but we also want to include horror-related genres
    // Genre IDs: Horror = 8, Survival = 32, Thriller = 20
    const query = `
      fields name, summary, cover.url, first_release_date, rating, rating_count, 
             genres.name, platforms.name, platforms.abbreviation, 
             involved_companies.company.name, involved_companies.developer, 
             themes.name;
      where (themes = (19) | genres = (8)) & rating >= 70 & rating_count >= 20 & cover != null;
      sort rating desc;
      limit ${limit * 2};
    `

    try {
      const games = await this.makeRequest('games', query)
      
      // Additional client-side filtering to ensure horror content
      const horrorGames = games.filter(game => {
        const hasHorrorTheme = game.themes?.some(theme => theme.name.toLowerCase().includes('horror'))
        const hasHorrorGenre = game.genres?.some(genre => 
          genre.name.toLowerCase().includes('horror') ||
          genre.name.toLowerCase().includes('survival') ||
          genre.name.toLowerCase().includes('thriller')
        )
        const hasHorrorInName = game.name.toLowerCase().includes('horror') ||
                               game.name.toLowerCase().includes('evil') ||
                               game.name.toLowerCase().includes('dead') ||
                               game.name.toLowerCase().includes('fear') ||
                               game.name.toLowerCase().includes('nightmare')
        
        return hasHorrorTheme || hasHorrorGenre || hasHorrorInName
      })
      
      return horrorGames.slice(0, limit)
    } catch (error) {
      console.error('Error fetching top rated horror games:', error)
      return []
    }
  }
}

function igdbGameToGameItem(game: IGDBGame): GameItem {
  const coverUrl = game.cover?.url 
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop'

  const releaseYear = game.first_release_date 
    ? new Date(game.first_release_date * 1000).getFullYear()
    : new Date().getFullYear()

  const platforms = game.platforms?.map(p => p.abbreviation || p.name).slice(0, 3) || ['PC']
  
  const genres = game.genres?.map(g => g.name) || ['Horror']
  
  const developer = game.involved_companies
    ?.find(company => company.developer)
    ?.company.name || 'Unknown Developer'

  // Convert IGDB rating (0-100) to our scale (0-10)
  const rating = game.rating ? Math.round((game.rating / 10) * 10) / 10 : 7.5

  return {
    id: game.id.toString(),
    title: game.name,
    posterUrl: coverUrl,
    rating,
    year: releaseYear,
    platform: platforms,
    description: game.summary || `Experience the terror in ${game.name}, a critically acclaimed horror game.`,
    genre: genres,
    developer,
    slug: game.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'top-rated'
    const limit = parseInt(searchParams.get('limit') || '8')

    const client = new IGDBServerClient()
    
    let games: IGDBGame[] = []
    
    switch (type) {
      case 'top-rated':
        games = await client.getTopRatedHorrorGames(limit)
        break
      default:
        games = await client.getTopRatedHorrorGames(limit)
    }

    const gameItems = games.map(game => igdbGameToGameItem(game))
    
    return NextResponse.json({ games: gameItems })
  } catch (error) {
    console.error('Error in games API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
