import { NextRequest, NextResponse } from 'next/server'
import { IIGDBGame } from "@/types"

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

  private async makeRequest(endpoint: string, query: string): Promise<IIGDBGame[]> {
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

  async getTopRatedHorrorGames(limit: number = 8): Promise<IIGDBGame[]> {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 1
    const startTimestamp = Math.floor(new Date(`${startYear}-01-01`).getTime() / 1000)
    const endTimestamp = Math.floor(new Date(`${currentYear}-12-31`).getTime() / 1000)
    
    // Horror theme ID is 19, but we also want to include horror-related genres
    // Genre IDs: Horror = 8, Survival = 32, Thriller = 20
    const query = `
      fields name, summary, cover.url, first_release_date, rating, rating_count, 
             genres.name, platforms.name, platforms.abbreviation, 
             involved_companies.company.name, involved_companies.developer, 
             themes.name;
      where (themes = (19) | genres = (8)) & rating >= 70 & rating_count >= 20 & cover != null 
            & first_release_date >= ${startTimestamp} & first_release_date <= ${endTimestamp};
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

  async getAllTimeTopRatedHorrorGames(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    platforms?: string[]
    sortBy?: 'rating.desc' | 'first_release_date.desc' | 'name.asc'
  }): Promise<{ games: IIGDBGame[], total: number, page: number, totalPages: number }> {
    const { page = 1, minYear, maxYear, platforms, sortBy = 'rating.desc' } = params || {}
    const limit = 20
    const offset = (page - 1) * limit
    
    // Build date filters
    let dateFilter = ''
    if (minYear && maxYear) {
      const startTimestamp = Math.floor(new Date(`${minYear}-01-01`).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(`${maxYear}-12-31`).getTime() / 1000)
      dateFilter = `& first_release_date >= ${startTimestamp} & first_release_date <= ${endTimestamp}`
    } else if (minYear) {
      const startTimestamp = Math.floor(new Date(`${minYear}-01-01`).getTime() / 1000)
      dateFilter = `& first_release_date >= ${startTimestamp}`
    } else if (maxYear) {
      const endTimestamp = Math.floor(new Date(`${maxYear}-12-31`).getTime() / 1000)
      dateFilter = `& first_release_date <= ${endTimestamp}`
    }
    
    // Build platform filter
    let platformFilter = ''
    if (platforms && platforms.length > 0) {
      // Common platform IDs: PC = 6, PlayStation = 8, Xbox = 9, Nintendo = 7, Mobile = 34
      const platformMap: Record<string, number[]> = {
        'PC': [6],
        'PlayStation': [8, 9, 48, 167, 165], // PS1, PS2, PS4, PS5, PS3
        'Xbox': [11, 12, 49, 169], // Xbox, Xbox 360, Xbox One, Xbox Series
        'Nintendo': [7, 37, 41, 130], // Nintendo, 3DS, Wii U, Switch
        'Mobile': [34, 39] // Android, iOS
      }
      
      const platformIds = platforms.flatMap(p => platformMap[p] || [])
      if (platformIds.length > 0) {
        platformFilter = `& platforms = (${platformIds.join(',')})`
      }
    }
    
    // Determine sort order
    let sortOrder = 'rating desc'
    if (sortBy === 'first_release_date.desc') sortOrder = 'first_release_date desc'
    else if (sortBy === 'name.asc') sortOrder = 'name asc'
    
    // Horror theme ID is 19, Horror genre ID is 8, Survival = 32, Thriller = 20
    const query = `
      fields name, summary, cover.url, first_release_date, rating, rating_count, 
             genres.name, platforms.name, platforms.abbreviation, 
             involved_companies.company.name, involved_companies.developer, 
             themes.name;
      where (themes = (19) | genres = (8, 32, 20)) & rating >= 60 & rating_count >= 10 & cover != null ${dateFilter} ${platformFilter};
      sort ${sortOrder};
      limit ${limit * 3};
      offset ${offset};
    `

    try {
      const games = await this.makeRequest('games', query)
      
      // Additional client-side filtering to ensure horror content
      const horrorGames = games.filter(game => {
        const hasHorrorTheme = game.themes?.some(theme => theme.name.toLowerCase().includes('horror'))
        const hasHorrorGenre = game.genres?.some(genre => 
          genre.name.toLowerCase().includes('horror') ||
          genre.name.toLowerCase().includes('survival') ||
          genre.name.toLowerCase().includes('thriller') ||
          genre.name.toLowerCase().includes('action') && game.name.toLowerCase().includes('dead') ||
          genre.name.toLowerCase().includes('adventure') && game.name.toLowerCase().includes('evil')
        )
        const hasHorrorInName = game.name.toLowerCase().includes('horror') ||
                               game.name.toLowerCase().includes('evil') ||
                               game.name.toLowerCase().includes('dead') ||
                               game.name.toLowerCase().includes('fear') ||
                               game.name.toLowerCase().includes('nightmare') ||
                               game.name.toLowerCase().includes('silent hill') ||
                               game.name.toLowerCase().includes('resident evil') ||
                               game.name.toLowerCase().includes('outlast') ||
                               game.name.toLowerCase().includes('amnesia') ||
                               game.name.toLowerCase().includes('phasmophobia') ||
                               game.name.toLowerCase().includes('alien') ||
                               game.name.toLowerCase().includes('zombie')
        
        return hasHorrorTheme || hasHorrorGenre || hasHorrorInName
      })
      
      const finalGames = horrorGames.slice(0, limit)
      const totalGames = Math.min(horrorGames.length * 10, 1000) // Estimate total for pagination
      const totalPages = Math.ceil(totalGames / limit)
      
      return {
        games: finalGames,
        total: totalGames,
        page,
        totalPages
      }
    } catch (error) {
      console.error('Error fetching all-time top rated horror games:', error)
      return {
        games: [],
        total: 0,
        page: 1,
        totalPages: 1
      }
    }
  }
}

function igdbGameToGameItem(game: IIGDBGame): GameItem {
  const coverUrl = game.cover?.url 
    ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`
    : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop'

  const releaseYear = game.first_release_date 
    ? new Date(game.first_release_date * 1000).getFullYear()
    : new Date().getFullYear()

  const platforms = game.platforms?.map(p => ('abbreviation' in p ? p.abbreviation : p.name)).slice(0, 3) || ['PC']
  
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
    platform: platforms.filter((p): p is string => typeof p === 'string'),
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
    const page = parseInt(searchParams.get('page') || '1')
    const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
    const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean)
    const sortBy = searchParams.get('sortBy') as 'rating.desc' | 'first_release_date.desc' | 'name.asc' || 'rating.desc'

    const client = new IGDBServerClient()
    
    switch (type) {
      case 'top-rated':
        const games = await client.getTopRatedHorrorGames(limit)
        const gameItems = games.map(game => igdbGameToGameItem(game))
        return NextResponse.json({ games: gameItems })
        
      case 'all-time':
        const result = await client.getAllTimeTopRatedHorrorGames({
          page,
          minYear,
          maxYear,
          platforms,
          sortBy
        })
        const allTimeGameItems = result.games.map(game => igdbGameToGameItem(game))
        return NextResponse.json({
          games: allTimeGameItems,
          pagination: {
            page: result.page,
            totalPages: result.totalPages,
            total: result.total,
            hasMore: result.page < result.totalPages
          }
        })
        
      default:
        const defaultGames = await client.getTopRatedHorrorGames(limit)
        const defaultGameItems = defaultGames.map(game => igdbGameToGameItem(game))
        return NextResponse.json({ games: defaultGameItems })
    }
  } catch (error) {
    console.error('Error in games API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
