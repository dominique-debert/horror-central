// Client-side Open Library API wrapper using Next.js API routes

interface BookItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  author: string
  pages: number
  description: string
  genre: string[]
  slug: string
}

interface BooksApiResponse {
  books: BookItem[]
}

class OpenLibraryClient {
  private baseUrl = '/api/books'

  async getTopRatedHorrorBooks(limit: number = 12): Promise<BookItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=top-rated&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: BooksApiResponse = await response.json()
      return data.books || []
    } catch (error) {
      console.error('Error fetching top rated horror books:', error)
      return []
    }
  }

  async getHorrorBooks(limit: number = 20): Promise<BookItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=horror&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: BooksApiResponse = await response.json()
      return data.books || []
    } catch (error) {
      console.error('Error fetching horror books:', error)
      return []
    }
  }

  async searchHorrorBooks(searchTerm: string, limit: number = 10): Promise<BookItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}?type=search&q=${encodeURIComponent(searchTerm)}&limit=${limit}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: BooksApiResponse = await response.json()
      return data.books || []
    } catch (error) {
      console.error('Error searching horror books:', error)
      return []
    }
  }
}

// Export singleton instance
export const openLibraryClient = new OpenLibraryClient()
