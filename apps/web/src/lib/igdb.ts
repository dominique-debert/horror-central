// Client-side IGDB API wrapper using Next.js API routes

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

interface GamesApiResponse {
  games: GameItem[]
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
}


// Export singleton instance
export const igdbClient = new IGDBClient()
