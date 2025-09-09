import { NextRequest, NextResponse } from 'next/server'
import type { IBookItem, IOpenLibrarySearchDoc, IOpenLibrarySearchResponse } from '@/types'

class OpenLibraryClient {
  private baseUrl = 'https://openlibrary.org'

  async getAllTimeTopRatedHorrorBooks(params?: {
    page?: number;
    limit?: number;
    minYear?: number;
    maxYear?: number;
    author?: string;
    // sortBy?: 'rating.asc';
  }): Promise<{ books: IBookItem[], total: number, page: number, totalPages: number }> {
    const { page = 1, limit = 20, minYear, maxYear, author } = params || {};

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', 'subject:horror');
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', ((page - 1) * limit).toString());
      queryParams.append('fields', 'key,title,author_name,first_publish_year,cover_i,ratings_average,ratings_count,subject,number_of_pages_median');
      
      if (minYear) {
        queryParams.append('first_publish_year', `[${minYear} TO *]`);
      }
      if (maxYear) {
        queryParams.append('first_publish_year', `[* TO ${maxYear}]`);
      }
      if (author) {
        queryParams.append('author', author);
      }

      const response = await fetch(`${this.baseUrl}/search.json?${queryParams.toString()}`, {
        headers: {
          'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.error(`OpenLibrary API returned ${response.status}: ${response.statusText}`);
        return {
          books: [],
          total: 0,
          page,
          totalPages: 0
        };
      }

      const data: IOpenLibrarySearchResponse = await response.json();
      
      const books: IBookItem[] = data.docs
        .filter((book: IOpenLibrarySearchDoc) => {
          // Only include books that have all required data
          return book.title && 
                 book.author_name && 
                 book.first_publish_year &&
                 book.cover_i && // Must have a cover image
                 book.ratings_average && book.ratings_average > 0; // Must have a rating > 0
        })
        .map((book: IOpenLibrarySearchDoc) => ({
          id: book.key,
          title: book.title,
          posterUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
          rating: book.ratings_average || 0,
          year: book.first_publish_year || 0,
          author: book.author_name?.[0] || 'Unknown Author',
          pages: book.number_of_pages_median || 0,
          description: `A horror book published in ${book.first_publish_year}`,
          genre: ['Horror'],
          slug: book.key.replace('/works/', ''),
        }))
        .sort((a: IBookItem, b: IBookItem) => {
          // Primary sort: by year (newest first)
          if (b.year !== a.year) {
            return b.year - a.year;
          }
          // Secondary sort: by rating (highest first)
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }
          // Tertiary sort: alphabetically by title
          return a.title.localeCompare(b.title);
        });

      const totalPages = Math.ceil(data.numFound / limit);

      return {
        books,
        total: data.numFound,
        page,
        totalPages
      };

    } catch (error) {
      console.error('Error in getAllTimeTopRatedHorrorBooks:', error);
      return {
        books: [],
        total: 0,
        page,
        totalPages: 0
      };
    }
  }

  async getUniqueAuthors(params?: {
    minYear?: number;
    maxYear?: number;
  }): Promise<string[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', 'subject:horror');
      queryParams.append('limit', '1000');
      queryParams.append('fields', 'author_name');
      
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
        return [];
      }

      const data: IOpenLibrarySearchResponse = await response.json();
      
      const authors = new Set<string>();
      data.docs.forEach((book: IOpenLibrarySearchDoc) => {
        if (book.author_name && Array.isArray(book.author_name)) {
          book.author_name.forEach((author: string) => {
            if (author && typeof author === 'string') {
              authors.add(author);
            }
          });
        }
      });

      const sortedAuthors = Array.from(authors).sort();
      console.log(`Found ${sortedAuthors.length} unique authors`);
      return sortedAuthors;

    } catch (error) {
      console.error('Error fetching unique authors:', error);
      return [];
    }
  }
}

const openLibrary = new OpenLibraryClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all-time-top-rated';
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const author = searchParams.get('author');

    switch (type) {
      case 'unique-authors':
        const authorsResult = await openLibrary.getUniqueAuthors({
          minYear: minYear ? parseInt(minYear) : undefined,
        })
        return NextResponse.json({ authors: authorsResult })

      default:
        const result = await openLibrary.getAllTimeTopRatedHorrorBooks({
          page: parseInt(searchParams.get('page') || '1'),
          minYear: minYear ? parseInt(minYear) : undefined,
          maxYear: maxYear ? parseInt(maxYear) : undefined,
          author: author || undefined,
          limit: parseInt(searchParams.get('limit') || '20'),
        })
        return NextResponse.json(result)
    }

  } catch (error) {
    console.error('Error in books API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
