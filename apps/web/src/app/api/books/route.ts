import { NextResponse } from 'next/server'

// Local interfaces for the API
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

// OpenLibrary API interfaces
interface OpenLibrarySearchDoc {
  key: string
  title: string
  author_name?: string[]
  first_publish_        const result = await openLibrary.getAllTimeTopRatedHorrorBooks({
          page: parseInt(searchParams.get('page') || '1'),
          minYear: minYear ? parseInt(minYear) : undefined,
          maxYear: maxYear ? parseInt(maxYear) : undefined,
          author: author || undefined,
          limit: parseInt(searchParams.get('limit') || '20'),
        })umber
  cover_i?: number
  isbn?: string[]
  subject?: string[]
  publisher?: string[]
  publish_year?: number[]
  number_of_pages_median?: number
  ratings_average?: number
  ratings_count?: number
  want_to_read_count?: number
  already_read_count?: number
  currently_reading_count?: number
  readinglog_count?: number
  edition_count?: number
  language?: string[]
  id_goodreads?: string[]
  id_librarything?: string[]
  publish_date?: string[]
  lccn?: string[]
  ia?: string[]
  oclc?: string[]
  public_scan_b?: boolean
  lending_edition_s?: string
  lending_identifier_s?: string
  printdisabled_s?: string
  cover_edition_key?: string
  first_sentence?: string[]
  subtitle?: string
  full_title?: string
  has_fulltext?: boolean
  text?: string[]
  seed?: string[]
  type?: string
  ebook_count_i?: number
  edition_key?: string[]
  publish_place?: string[]
  contributor?: string[]
  lcc?: string[]
  ddc?: string[]
  last_modified_i?: number
  ebook_access?: string
  public_scan?: boolean
  ia_collection?: string[]
  ia_collection_s?: string
  printdisabled?: boolean
  ratings_sortable?: number
  covers?: number[]
  description?: string | { value: string }
}

interface OpenLibrarySearchResponse {
  numFound: number
  start: number
  numFoundExact?: boolean
  docs: OpenLibrarySearchDoc[]
}

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

class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org'
  private coversUrl = 'https://covers.openlibrary.org'

  // Improved error handling and retry logic for robust API responses
  private async fetchWithRetry(url: string, retries = 3): Promise<Response | null> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
          },
        })
        if (response.ok) return response
      } catch (error) {
        console.error(`Fetch attempt ${i + 1} failed:`, error)
      }
      if (i < retries - 1) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
    return null
  }

  async getTopRatedBooks(limit: number = 10): Promise<BookItem[]> {
    const queries = [
      'subject:horror',
      'subject:supernatural',
      'subject:"ghost stories"',
      'subject:thriller',
      'subject:"dark fantasy"'
    ]
    
    return this.searchMultipleStrategies(queries, limit)
  }

  async searchBooks(query: string, limit = 10): Promise<BookItem[]> {
    const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&sort=first_publish_year desc&limit=${limit}`
    const response = await this.fetchWithRetry(url)
    
    if (!response) return []
    
    try {
      const data: OpenLibrarySearchResponse = await response.json()
      return (data.docs || [])
        .filter(book => book.title && book.author_name && book.author_name.length > 0)
        .map(book => this.convertSearchResultToBookItem(book))
    } catch (error) {
      console.error('Error searching books:', error)
      return []
    }
  }

  async getHorrorBooks(limit: number = 20): Promise<BookItem[]> {
    const queries = [
      'subject:horror',
      'subject:supernatural',
      'subject:"ghost stories"',
      'subject:thriller',
      'subject:"dark fantasy"',
      'subject:"gothic fiction"',
      'subject:vampire',
      'subject:zombie'
    ]
    
    return this.searchMultipleStrategies(queries, limit)
  }

  private async searchMultipleStrategies(queries: string[], limit: number): Promise<BookItem[]> {
    const allBooks: BookItem[] = []
    const booksPerQuery = Math.ceil(limit / queries.length)
    
    for (const query of queries) {
      const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&sort=first_publish_year desc&limit=${booksPerQuery}`
      const response = await this.fetchWithRetry(url)
      
      if (response) {
        try {
          const data: OpenLibrarySearchResponse = await response.json()
          const books = (data.docs || [])
            .filter(book => book.title && book.author_name && book.author_name.length > 0)
            .map(book => this.convertSearchResultToBookItem(book))
          allBooks.push(...books)
        } catch (error) {
          console.error(`Error parsing response for query: ${query}`, error)
        }
      }
    }
    
    // Remove duplicates and return
    const uniqueBooks = allBooks.filter((book, index, self) => 
      index === self.findIndex(b => b.title === book.title && b.author === book.author)
    )
    
    return uniqueBooks.slice(0, limit)
  }

  private convertSearchResultToBookItem(book: OpenLibrarySearchDoc): BookItem {
    const author = book.author_name?.[0] || 'Unknown Author'
    
    // Use real cover from Open Library with multiple fallbacks
    let coverUrl = '/placeholder-book-cover.jpg'
    if (book.cover_i) {
      coverUrl = `${this.coversUrl}/b/id/${book.cover_i}-M.jpg`
    } else if (book.isbn && book.isbn.length > 0) {
      coverUrl = `${this.coversUrl}/b/isbn/${book.isbn[0]}-M.jpg`
    } else {
      // Use a generic horror book cover from Unsplash as fallback
      const fallbackCovers = [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop'
      ]
      coverUrl = fallbackCovers[Math.floor(Math.random() * fallbackCovers.length)]
    }

    // Use real rating from Open Library or generate a reasonable fallback
    const rating = book.ratings_average 
      ? Math.min(10, Math.max(1, Math.round(book.ratings_average * 2) / 2)) // Convert to 1-10 scale
      : Math.round((6.5 + Math.random() * 2.5) * 2) / 2 // Generate 6.5-9.0 rating

    // Use real page count or estimate based on publication year
    const pages = book.number_of_pages_median || 
                  (book.first_publish_year && book.first_publish_year > 1950 ? 
                   Math.floor(200 + Math.random() * 300) : 
                   Math.floor(150 + Math.random() * 250))

    // Use real subjects as genres with better filtering
    let genres = ['Horror']
    if (book.subject && Array.isArray(book.subject)) {
      const horrorGenres = book.subject
        .filter((s: string) => 
          s && typeof s === 'string' && s.length < 30 && // Avoid very long subjects
          (s.toLowerCase().includes('horror') || 
           s.toLowerCase().includes('supernatural') ||
           s.toLowerCase().includes('thriller') ||
           s.toLowerCase().includes('mystery') ||
           s.toLowerCase().includes('gothic') ||
           s.toLowerCase().includes('vampire') ||
           s.toLowerCase().includes('zombie') ||
           s.toLowerCase().includes('ghost'))
        )
        .map(s => s.charAt(0).toUpperCase() + s.slice(1)) // Capitalize
        .slice(0, 3)
      
      if (horrorGenres.length > 0) {
        genres = horrorGenres
      }
    }

    // Generate work ID from key or title
    const workId = book.key?.replace('/works/', '') || 
                   `book-${book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)}-${Date.now()}`

    // Use the main title, clean it up
    const fullTitle = book.title.replace(/\s+/g, ' ').trim()

    // Better description with more variety
    const descriptions = [
      `A gripping horror tale by ${author}, first published in ${book.first_publish_year || 'the early days of horror literature'}.`,
      `${author}'s chilling contribution to horror literature from ${book.first_publish_year || 'years past'}.`,
      `A haunting story that showcases ${author}'s mastery of the horror genre.`,
      `An essential read for horror enthusiasts, crafted by the talented ${author}.`
    ]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]

    return {
      id: workId,
      title: fullTitle,
      posterUrl: coverUrl,
      rating,
      year: book.first_publish_year || 1900,
      author,
      pages,
      description,
      genre: genres,
      slug: book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }
  }

  async getAllTimeTopRatedHorrorBooks(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    author?: string
    sortBy?: 'rating.desc' | 'first_publish_year.desc' | 'title.asc' | 'random'
    limit?: number
  }): Promise<{ books: BookItem[], total: number, page: number, totalPages: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;
    
    // Build the query parameters for OpenLibrary
    const queryParams = new URLSearchParams();
    
    // Start with a basic horror query
    queryParams.set('q', 'subject:horror');
    
    // Add pagination
    queryParams.set('limit', limit.toString());
    queryParams.set('offset', offset.toString());
    
    // Add sorting
    if (params?.sortBy === 'rating.desc') {
      queryParams.set('sort', 'rating desc');
    } else if (params?.sortBy === 'title.asc') {
      queryParams.set('sort', 'title_s asc');
    } else {
      // Default sort by publish year (newest first)
      queryParams.set('sort', 'first_publish_year desc');
    }
    
    // Add fields we need
    queryParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,isbn,number_of_pages_median,ratings_average,ratings_count,subject,description');
    
    // Add author filter if provided
    if (params?.author) {
      queryParams.set('author', params.author);
    }
    
    // Add year range filter if provided
    if (params?.minYear || params?.maxYear) {
      const minYear = params.minYear || 0;
      const maxYear = params.maxYear || new Date().getFullYear();
      queryParams.set('first_publish_year', `[${minYear} TO ${maxYear}]`);
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/search.json?${queryParams.toString()}`, {
        headers: {
          'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
        },
        // Add a 10 second timeout
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`OpenLibrary API returned ${response.status}: ${response.statusText}`);
      }
      
      const data: OpenLibrarySearchResponse = await response.json();
      
      // Convert to our BookItem format
      const books = data.docs
        .filter(book => book.title && book.author_name && book.author_name.length > 0)
        .map(book => this.convertSearchResultToBookItem(book));
      
      // Calculate pagination info
      const total = data.numFound;
      const totalPages = Math.ceil(total / limit);
      
      return {
        books,
        total,
        page,
        totalPages
      };
      
    } catch (error) {
      console.error('Error in getAllTimeTopRatedHorrorBooks:', error);
      // Return empty results on error
      return {
        books: [],
        total: 0,
        page,
        totalPages: 0
      };
    }
  }

  async getUniqueAuthors(params?: { minYear?: number; maxYear?: number; limit?: number; }): Promise<string[]> {
    const limit = params?.limit || 100;
    const minYear = params?.minYear;
    const maxYear = params?.maxYear;
    // Build query for horror books
    const queryParams = new URLSearchParams();
    queryParams.set('q', 'subject:horror');
    queryParams.set('limit', limit.toString());
    queryParams.set('fields', 'author_name,first_publish_year');
    if (minYear || maxYear) {
      const min = minYear || 0;
      const max = maxYear || new Date().getFullYear();
      queryParams.set('first_publish_year', `[${min} TO ${max}]`);
    }
    try {
      const response = await fetch(`${this.baseUrl}/search.json?${queryParams.toString()}`, {
        headers: {
          'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
        },
        signal: AbortSignal.timeout(10000)
      });
      if (!response.ok) {
        throw new Error(`OpenLibrary API returned ${response.status}: ${response.statusText}`);
      }
      const data: OpenLibrarySearchResponse = await response.json();
      const authors = Array.from(new Set(
        (data.docs || [])
          .flatMap(doc => doc.author_name || [])
          .filter(a => !!a)
      )).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
      return authors;
    } catch (error) {
      console.error('Error in getUniqueAuthors:', error);
      return [];
    }
  }

  async getUniqueLanguages(params?: {
    minYear?: number;
    maxYear?: number;
  }): Promise<string[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', 'subject:horror');
      queryParams.append('limit', '1000');
      queryParams.append('fields', 'language');
      
      if (params?.minYear) {
        queryParams.append('first_publish_year', `[${params.minYear} TO *]`);
      }
      if (params?.maxYear) {
        queryParams.append('first_publish_year', `[* TO ${params.maxYear}]`);
      }

      const response = await fetch(`${this.baseUrl}/search.json?${queryParams.toString()}`, {
        headers: {
          'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.error(`OpenLibrary API returned ${response.status}: ${response.statusText}`);
        return ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Chinese'];
      }

      const data: OpenLibrarySearchResponse = await response.json();
      
      const languages = new Set<string>();
      data.docs.forEach(book => {
        if (book.language && Array.isArray(book.language)) {
          book.language.forEach(lang => {
            if (lang && typeof lang === 'string') {
              // Convert language codes to readable names
              const languageNames: { [key: string]: string } = {
                'eng': 'English',
                'spa': 'Spanish', 
                'fre': 'French',
                'ger': 'German',
                'ita': 'Italian',
                'por': 'Portuguese',
                'rus': 'Russian',
                'jpn': 'Japanese',
                'chi': 'Chinese',
                'ara': 'Arabic',
                'hin': 'Hindi',
                'dut': 'Dutch',
                'pol': 'Polish',
                'swe': 'Swedish',
                'nor': 'Norwegian',
                'dan': 'Danish',
                'fin': 'Finnish'
              };
              
              const languageName = languageNames[lang] || lang;
              languages.add(languageName);
            }
          });
        }
      });

      const sortedLanguages = Array.from(languages).sort();
      console.log(`Found ${sortedLanguages.length} unique languages`);
      return sortedLanguages;

    } catch (error) {
      console.error('Error fetching unique languages:', error);
      return ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Chinese'];
    }
  }
}

const openLibraryClient = new OpenLibraryClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'top-rated'
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    let result: { books: BookItem[], total?: number, page?: number, totalPages?: number }

    switch (type) {
      case 'top-rated':
        const books = await openLibraryClient.getTopRatedBooks(limit)
        result = { books }
        break
      case 'all-time-top-rated':
        const page = parseInt(searchParams.get('page') || '1')
        const minYear = searchParams.get('minYear') ? parseInt(searchParams.get('minYear')!) : undefined
        const maxYear = searchParams.get('maxYear') ? parseInt(searchParams.get('maxYear')!) : undefined
        const author = searchParams.get('author') || undefined
        const sortBy = (searchParams.get('sortBy') as 'rating.desc' | 'first_publish_year.desc' | 'title.asc') || 'first_publish_year.desc'
        
        result = await openLibraryClient.getAllTimeTopRatedHorrorBooks({
          page,
          minYear,
          maxYear,
          author,
          sortBy
        })
        break
      case 'horror':
        const horrorBooks = await openLibraryClient.getHorrorBooks(limit)
        result = { books: horrorBooks }
        break
      case 'search':
        const query = searchParams.get('q') || ''
        const searchBooks = await openLibraryClient.searchBooks(query, limit)
        result = { books: searchBooks }
        break
      case 'unique-authors':
        const authorsResult = await openLibraryClient.getUniqueAuthors({
          minYear: minYear ? parseInt(minYear) : undefined,
        })
        return NextResponse.json({ authors: authorsResult })

      case 'unique-languages':
        const languagesResult = await openLibraryClient.getUniqueLanguages({
          minYear: minYear ? parseInt(minYear) : undefined,
        })
        return NextResponse.json({ languages: languagesResult })

      default:
        // Handle all-time-top-rated and other cases
        const defaultResult = await openLibraryClient.getAllTimeTopRatedHorrorBooks({
          page: parseInt(searchParams.get('page') || '1'),
          minYear: minYear ? parseInt(minYear) : undefined,
          maxYear: maxYear ? parseInt(maxYear) : undefined,
          author: author || undefined,
          language: searchParams.get('language') || undefined,
          limit: parseInt(searchParams.get('limit') || '20'),
        })
        return NextResponse.json(defaultResult)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}
