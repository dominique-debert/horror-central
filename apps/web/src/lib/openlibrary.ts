// Client-side Open Library API wrapper using Next.js API routes with caching

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

// Cache entry type
interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache with type safety
const CACHE = new Map<string, CacheEntry<BooksApiResponse>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

class OpenLibraryClient {
  private baseUrl = '/api/books'
  private cache = CACHE

  private async fetchWithCache<T extends BooksApiResponse>(url: string): Promise<T | null> {
    const now = Date.now()
    const cacheKey = `books:${url}`
    
    // Return cached data if it exists and is not expired
    const cached = this.cache.get(cacheKey)
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      return cached.data as T
    }

    try {
      const response = await fetch(url, {
        next: { revalidate: 300 } // 5 minutes revalidation
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Update cache
      this.cache.set(cacheKey, {
        data,
        timestamp: now
      })
      
      return data as T
    } catch (error) {
      console.error('API request failed:', error)
      // Return cached data even if it's expired, if available
      return cached?.data as T || null
    }
  }

  async getTopRatedBooks(limit = 10): Promise<BookItem[]> {
    try {
      const url = `${this.baseUrl}?type=top-rated&limit=${limit}`
      const data = await this.fetchWithCache<BooksApiResponse>(url)
      return data?.books || []
    } catch (error) {
      console.error('Error fetching top rated books:', error)
      return []
    }
  }

  async getAllTimeTopRatedHorrorBooks(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    author?: string
    sortBy?: 'rating.desc' | 'first_publish_year.desc' | 'title.asc'
  }): Promise<{ books: BookItem[], total: number, page: number, totalPages: number }> {
    try {
      const searchParams = new URLSearchParams({
        type: 'all-time-top-rated',
        ...(params?.page && { page: params.page.toString() }),
        ...(params?.minYear && { minYear: params.minYear.toString() }),
        ...(params?.maxYear && { maxYear: params.maxYear.toString() }),
        ...(params?.author && { author: params.author }),
        ...(params?.sortBy && { sortBy: params.sortBy })
      })
      
      const response = await fetch(`${this.baseUrl}?${searchParams}`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching all-time top rated horror books:', error)
      return {
        books: [],
        total: 0,
        page: 1,
        totalPages: 1
      }
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

async getUniqueAuthors(limit: number = 100, params?: {
  sortBy?: 'title.asc' | 'author.asc',
  minYear?: number,
  maxYear?: number
}): Promise<string[]> {
  try {
    // First try to get authors from our database or cache
    const searchParams = new URLSearchParams();
    searchParams.set('type', 'unique-authors');
    searchParams.set('limit', limit.toString());
    
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.minYear) searchParams.set('minYear', params.minYear.toString());
    if (params?.maxYear) searchParams.set('maxYear', params.maxYear.toString());
    
    const response = await fetch(`${this.baseUrl}?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (data.authors && data.authors.length > 0) {
      return data.authors;
    }
    
    // Fallback to a static list of popular horror authors if the API fails
    console.warn('No authors found from API, using fallback list');
    return [
      'Stephen King',
      'H.P. Lovecraft',
      'Clive Barker',
      'Anne Rice',
      'Dean Koontz',
      'Shirley Jackson',
      'Peter Straub',
      'Richard Matheson',
      'Joe Hill',
      'Paul Tremblay',
      'Grady Hendrix',
      'Victor LaValle',
      'Tananarive Due'
    ].slice(0, limit);
  } catch (error) {
    console.error('Error fetching unique authors, using fallback:', error);
    // Return a fallback list of authors
    return [
      'Stephen King',
      'H.P. Lovecraft',
      'Clive Barker',
      'Anne Rice',
      'Dean Koontz'
    ].slice(0, limit);
  }
}
}

// Export singleton instance
export const openLibraryClient = new OpenLibraryClient()
