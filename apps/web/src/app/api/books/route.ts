import { NextRequest, NextResponse } from 'next/server'

// Open Library API interfaces
interface OpenLibraryWork {
  key: string
  title: string
  authors?: Array<{
    name: string
    key: string
  }>
  first_publish_year?: number
  edition_count?: number
  cover_id?: number
  cover_edition_key?: string
  has_fulltext?: boolean
  ia?: string
  ratings_average?: number
  ratings_count?: number
  subject?: string[]
}

interface OpenLibrarySearchResult {
  title: string
  author_name: string[]
  first_publish_year: number
  cover_i: number
  ratings_average: number
  ratings_count: number
  number_of_pages_median: number
  subject: string[]
  key: string
  isbn?: string[]
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

interface BooksApiResponse {
  books: BookItem[]
}

class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org'
  private coversUrl = 'https://covers.openlibrary.org'

  async getHorrorBooks(limit: number = 12): Promise<BookItem[]> {
    try {
      const currentYear = new Date().getFullYear()
      const startYear = currentYear - 1 // Previous year and current year
      
      // Try multiple approaches to get quality horror books from last 2 years
      const queries = [
        `subject:horror AND first_publish_year:[${startYear} TO ${currentYear}]`,
        `subject:supernatural AND first_publish_year:[${startYear} TO ${currentYear}]`, 
        `title:horror AND first_publish_year:[${startYear} TO ${currentYear}]`
      ]
      
      const allBooks: BookItem[] = []
      
      for (const query of queries) {
        const response = await fetch(
          `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&sort=rating desc&limit=${Math.ceil(limit / queries.length) + 5}`,
          {
            headers: {
              'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
            },
          }
        )

        if (!response.ok) {
          console.error(`Failed to fetch books for query ${query}:`, response.statusText)
          continue
        }

        const data = await response.json()
        console.log(`Query "${query}" returned ${data.docs?.length || 0} books`)
        
        // Filter and convert books with real data
        const books = (data.docs || [])
          .filter((book: any) => 
            book.title && 
            book.author_name && 
            book.author_name.length > 0 &&
            book.first_publish_year &&
            book.first_publish_year >= startYear &&
            book.first_publish_year <= currentYear &&
            book.cover_i // Only books with covers
          )
          .slice(0, Math.ceil(limit / queries.length))
          .map((book: any) => this.convertSearchResultToBookItem(book))

        allBooks.push(...books)
      }

      // Remove duplicates and return best results
      const uniqueBooks = allBooks.reduce((acc, book) => {
        if (!acc.find(existing => existing.id === book.id || existing.title === book.title)) {
          acc.push(book)
        }
        return acc
      }, [] as BookItem[])

      return uniqueBooks
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, limit)

    } catch (error) {
      console.error('Error fetching horror books:', error)
      return []
    }
  }

  private convertSearchResultToBookItem(book: any): BookItem {
    const author = book.author_name?.[0] || 'Unknown Author'
    
    // Use real cover from Open Library with fallback
    let coverUrl = '/placeholder-book-cover.jpg'
    if (book.cover_i) {
      // Try different cover sizes and formats
      coverUrl = `${this.coversUrl}/b/id/${book.cover_i}-M.jpg`
    } else if (book.isbn && book.isbn.length > 0) {
      // Fallback to ISBN-based cover
      coverUrl = `${this.coversUrl}/b/isbn/${book.isbn[0]}-M.jpg`
    }

    // Use real rating from Open Library or estimate
    const rating = book.ratings_average 
      ? Math.round(book.ratings_average * 10) / 10
      : Math.min(9.0, 6.0 + Math.random() * 2) // Fallback rating

    // Use real page count or estimate
    const pages = book.number_of_pages_median || 
                  book.number_of_pages || 
                  Math.floor(250 + Math.random() * 200)

    // Use real subjects as genres with better filtering
    let genres = ['Horror']
    if (book.subject && Array.isArray(book.subject)) {
      const horrorGenres = book.subject
        .filter((s: string) => 
          s && typeof s === 'string' && 
          (s.toLowerCase().includes('horror') || 
           s.toLowerCase().includes('supernatural') ||
           s.toLowerCase().includes('thriller') ||
           s.toLowerCase().includes('mystery') ||
           s.toLowerCase().includes('ghost'))
        )
        .slice(0, 3)
      
      if (horrorGenres.length > 0) {
        genres = horrorGenres
      }
    }

    // Generate work ID from key or title
    const workId = book.key?.replace('/works/', '') || 
                   book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50)

    // Better description
    const description = book.subtitle 
      ? `${book.subtitle} A ${book.first_publish_year} horror novel by ${author}.`
      : `A compelling horror story by ${author}, published in ${book.first_publish_year}.`

    return {
      id: workId,
      title: book.title,
      posterUrl: coverUrl,
      rating,
      year: book.first_publish_year,
      author,
      pages,
      description,
      genre: genres,
      slug: book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }
  }

  private convertToBookItem(work: OpenLibraryWork, subject: string): BookItem {
    const workId = work.key.replace('/works/', '')
    const author = work.authors?.[0]?.name || 'Unknown Author'
    
    // Generate cover URL - try cover_id first, then cover_edition_key
    let coverUrl = '/placeholder-book-cover.jpg'
    if (work.cover_id) {
      coverUrl = `${this.coversUrl}/b/id/${work.cover_id}-L.jpg`
    } else if (work.cover_edition_key) {
      coverUrl = `${this.coversUrl}/b/olid/${work.cover_edition_key}-L.jpg`
    }

    // Estimate rating based on edition count and other factors
    const editionCount = work.edition_count || 1
    const hasFulltext = work.has_fulltext || false
    const baseRating = Math.min(9.5, 6.0 + (Math.log(editionCount) * 0.5) + (hasFulltext ? 0.5 : 0))
    const rating = Math.round(baseRating * 10) / 10

    // Estimate page count based on subject and era
    const estimatedPages = this.estimatePageCount(work.first_publish_year || 1900, subject)

    // Create description based on subject
    const description = this.generateDescription(work.title, author, subject)

    // Generate genre tags
    const genres = this.generateGenres(subject, work.subject)

    return {
      id: workId,
      title: work.title,
      posterUrl: coverUrl,
      rating,
      year: work.first_publish_year || 1900,
      author,
      pages: estimatedPages,
      description,
      genre: genres,
      slug: work.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    }
  }

  private estimatePageCount(year: number, subject: string): number {
    // Base page count by subject
    const basePages = {
      horror: 320,
      supernatural: 280,
      ghost_stories: 250
    }

    const base = basePages[subject as keyof typeof basePages] || 300
    
    // Adjust for era (older books tend to be shorter)
    const eraMultiplier = year < 1950 ? 0.8 : year < 1980 ? 0.9 : 1.0
    
    // Add some randomness
    const variance = 0.8 + (Math.random() * 0.4) // 0.8 to 1.2
    
    return Math.round(base * eraMultiplier * variance)
  }

  private generateDescription(title: string, author: string, subject: string): string {
    const descriptions = {
      horror: [
        `A chilling tale that will keep you on the edge of your seat. ${author} masterfully weaves terror and suspense in this haunting story.`,
        `${author} delivers a spine-tingling horror experience that explores the darkest corners of human fear and supernatural dread.`,
        `A terrifying journey into the unknown. This gripping horror novel showcases ${author}'s talent for creating atmospheric terror.`
      ],
      supernatural: [
        `${author} crafts a mesmerizing tale where the supernatural meets reality in unexpected and thrilling ways.`,
        `A captivating supernatural story that blends mystery, magic, and suspense into an unforgettable reading experience.`,
        `${author} explores the thin veil between our world and the supernatural in this compelling and eerie narrative.`
      ],
      ghost_stories: [
        `A haunting ghost story that will chill you to the bone. ${author} brings spectral terror to life with masterful storytelling.`,
        `${author} weaves a ghostly tale filled with supernatural encounters and spine-chilling moments that linger long after reading.`,
        `A classic ghost story that combines atmospheric horror with compelling characters and supernatural mystery.`
      ]
    }

    const subjectDescriptions = descriptions[subject as keyof typeof descriptions] || descriptions.horror
    return subjectDescriptions[Math.floor(Math.random() * subjectDescriptions.length)]
  }

  private generateGenres(subject: string, workSubjects?: string[]): string[] {
    const genreMap = {
      horror: ['Horror', 'Thriller'],
      supernatural: ['Supernatural', 'Fantasy', 'Mystery'],
      ghost_stories: ['Ghost Stories', 'Paranormal', 'Gothic']
    }

    const baseGenres = genreMap[subject as keyof typeof genreMap] || ['Horror']
    
    // Add additional genres based on work subjects if available
    const additionalGenres: string[] = []
    if (workSubjects) {
      if (workSubjects.some(s => s.toLowerCase().includes('vampire'))) additionalGenres.push('Vampire')
      if (workSubjects.some(s => s.toLowerCase().includes('zombie'))) additionalGenres.push('Zombie')
      if (workSubjects.some(s => s.toLowerCase().includes('witch'))) additionalGenres.push('Witchcraft')
      if (workSubjects.some(s => s.toLowerCase().includes('gothic'))) additionalGenres.push('Gothic')
    }

    return [...baseGenres, ...additionalGenres].slice(0, 3) // Limit to 3 genres
  }
}

const openLibraryClient = new OpenLibraryClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'horror'
    const limit = parseInt(searchParams.get('limit') || '12')

    let books: BookItem[] = []

    switch (type) {
      case 'horror':
      case 'top-rated':
        books = await openLibraryClient.getHorrorBooks(limit)
        break
      default:
        books = await openLibraryClient.getHorrorBooks(limit)
    }

    const response: BooksApiResponse = { books }
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // Cache for 1 hour
      },
    })

  } catch (error) {
    console.error('Books API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}
