// Client-side IGDB API wrapper using Next.js API routes

export interface GameItem {
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

interface GamesApiResponse {
  games: GameItem[]
  pagination?: {
    page: number
    totalPages: number
    total: number
    hasMore: boolean
  }
}

class IGDBClient {
  private baseUrl = '/api/games'

  async getTopRatedHorrorGames(limit: number = 8): Promise<GameItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=top-rated&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GamesApiResponse = await response.json()
      return data.games || []
    } catch (error) {
      console.error('Error fetching top rated horror games:', error)
      return []
    }
  }

  async getHorrorGames(limit: number = 20): Promise<GameItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=horror&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GamesApiResponse = await response.json()
      return data.games || []
    } catch (error) {
      console.error('Error fetching horror games:', error)
      return []
    }
  }

  async searchGames(query: string, limit: number = 20): Promise<GameItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=search&q=${encodeURIComponent(query)}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GamesApiResponse = await response.json()
      return data.games || []
    } catch (error) {
      console.error('Error searching games:', error)
      return []
    }
  }

  async searchHorrorGames(searchTerm: string, limit: number = 10): Promise<GameItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=search&q=${encodeURIComponent(searchTerm)}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GamesApiResponse = await response.json()
      return data.games || []
    } catch (error) {
      console.error('Error searching horror games:', error)
      return []
    }
  }

  async getAllTimeTopRatedHorrorGames(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    platforms?: string[]
    sortBy?: 'rating.desc' | 'first_release_date.desc' | 'name.asc'
  }): Promise<{ games: GameItem[], pagination: { page: number, totalPages: number, total: number, hasMore: boolean } }> {
    try {
      const { page = 1, minYear, maxYear, platforms, sortBy = 'rating.desc' } = params || {}
      
      const queryParams = new URLSearchParams({
        type: 'all-time',
        page: page.toString(),
        sortBy
      })
      
      if (minYear) queryParams.append('minYear', minYear.toString())
      if (maxYear) queryParams.append('maxYear', maxYear.toString())
      if (platforms && platforms.length > 0) queryParams.append('platforms', platforms.join(','))
      
      const response = await fetch(`${this.baseUrl}?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: GamesApiResponse = await response.json()
      return {
        games: data.games || [],
        pagination: data.pagination || { page: 1, totalPages: 1, total: 0, hasMore: false }
      }
    } catch (error) {
      console.error('Error fetching all-time top rated horror games:', error)
      return {
        games: [],
        pagination: { page: 1, totalPages: 1, total: 0, hasMore: false }
      }
    }
  }
}


// Export singleton instance
export const igdbClient = new IGDBClient()
