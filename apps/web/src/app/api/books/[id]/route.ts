import { NextResponse } from 'next/server'

interface OpenLibraryWork {
  key: string
  title: string
  description?: string | { value: string }
  covers?: number[]
  authors?: Array<{ author: { key: string } }>
  subjects?: string[]
  first_publish_date?: string
  latest_revision?: number
}

interface OpenLibraryAuthor {
  key: string
  name: string
  bio?: string | { value: string }
}

interface OpenLibraryEdition {
  key: string
  title: string
  authors?: Array<{ key: string }>
  publish_date?: string
  publishers?: string[]
  number_of_pages?: number
  isbn_10?: string[]
  isbn_13?: string[]
  covers?: number[]
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookId } = await params

    // The ID could be a work ID (starts with OL...W) or an edition ID (starts with OL...M)
    let workKey = bookId
    if (!bookId.startsWith('OL')) {
      return NextResponse.json(
        { error: 'Invalid book ID format' },
        { status: 400 }
      )
    }

    // If it's an edition ID, we need to get the work ID first
    if (bookId.includes('M')) {
      const editionResponse = await fetch(`https://openlibrary.org/books/${bookId}.json`)
      if (editionResponse.ok) {
        const edition: OpenLibraryEdition = await editionResponse.json()
        // Find the work key from the edition
        const workResponse = await fetch(`https://openlibrary.org/search.json?q=title:"${edition.title}"&limit=1`)
        if (workResponse.ok) {
          const searchData = await workResponse.json()
          if (searchData.docs && searchData.docs.length > 0) {
            workKey = searchData.docs[0].key
          }
        }
      }
    }

    // Fetch work details
    const workResponse = await fetch(`https://openlibrary.org${workKey.startsWith('/works/') ? workKey : `/works/${workKey}`}.json`)
    
    if (!workResponse.ok) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    const work: OpenLibraryWork = await workResponse.json()

    // Fetch author details if available
    let authorName = 'Unknown Author'
    if (work.authors && work.authors.length > 0) {
      try {
        const authorResponse = await fetch(`https://openlibrary.org${work.authors[0].author.key}.json`)
        if (authorResponse.ok) {
          const author: OpenLibraryAuthor = await authorResponse.json()
          authorName = author.name
        }
      } catch (error) {
        console.warn('Failed to fetch author details:', error)
      }
    }

    // Get the best edition for additional details
    let pages = 0
    let publisher = ''
    let isbn = ''
    let publishYear = new Date().getFullYear()

    try {
      const editionsResponse = await fetch(`https://openlibrary.org${work.key}/editions.json`)
      if (editionsResponse.ok) {
        const editionsData = await editionsResponse.json()
        const editions = editionsData.entries || []
        
        // Find the best edition (with most complete data)
        const bestEdition = editions.find((edition: OpenLibraryEdition) => 
          edition.number_of_pages && edition.publishers && (edition.isbn_10 || edition.isbn_13)
        ) || editions[0]

        if (bestEdition) {
          pages = bestEdition.number_of_pages || 0
          publisher = bestEdition.publishers?.[0] || ''
          isbn = bestEdition.isbn_13?.[0] || bestEdition.isbn_10?.[0] || ''
          
          if (bestEdition.publish_date) {
            const year = parseInt(bestEdition.publish_date.match(/\d{4}/)?.[0] || '0')
            if (year > 0) publishYear = year
          }
        }
      }
    } catch (error) {
      console.warn('Failed to fetch edition details:', error)
    }

    // Use first_publish_date if available and more reliable
    if (work.first_publish_date) {
      const year = parseInt(work.first_publish_date.match(/\d{4}/)?.[0] || '0')
      if (year > 0) publishYear = year
    }

    // Get cover image
    let coverUrl = null
    if (work.covers && work.covers.length > 0) {
      coverUrl = `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`
    }

    // Extract description
    let description = 'No description available.'
    if (work.description) {
      if (typeof work.description === 'string') {
        description = work.description
      } else if (work.description.value) {
        description = work.description.value
      }
    }

    // Process subjects as genres
    const genres = work.subjects?.slice(0, 5).map(subject => 
      subject.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ) || ['Fiction']

    // Generate a mock rating based on title and author popularity
    // This is a placeholder since Open Library doesn't provide ratings
    const mockRating = Math.min(10, Math.max(6, 
      (work.title.length % 3) + 6 + (authorName.includes('King') ? 1.5 : 0)
    ))

    const bookDetails = {
      id: bookId,
      title: work.title,
      posterUrl: coverUrl,
      coverUrl: coverUrl,
      rating: mockRating,
      year: publishYear,
      description: description.substring(0, 500) + (description.length > 500 ? '...' : ''),
      genre: genres,
      author: authorName,
      pages,
      publisher,
      isbn,
      awards: [], // Open Library doesn't provide awards data
      criticsScore: mockRating * 10,
      audienceScore: mockRating * 10
    }

    return NextResponse.json(bookDetails)
  } catch (error) {
    console.error('Error fetching book details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch book details' },
      { status: 500 }
    )
  }
}
