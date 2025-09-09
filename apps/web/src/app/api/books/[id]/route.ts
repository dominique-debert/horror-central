import { NextRequest, NextResponse } from 'next/server'
import type { IOpenLibraryWork, IOpenLibraryAuthor, IOpenLibraryEdition, IBookDetails } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Fetch work details from OpenLibrary
    const workResponse = await fetch(`https://openlibrary.org/works/${id}.json`, {
      headers: {
        'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!workResponse.ok) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    const work: IOpenLibraryWork = await workResponse.json()
    
    // Fetch author details if available
    let authorName = 'Unknown Author'
    if (work.authors && work.authors.length > 0) {
      try {
        const authorKey = work.authors[0].author.key
        const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`, {
          headers: {
            'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
          },
          signal: AbortSignal.timeout(5000)
        })
        
        if (authorResponse.ok) {
          const author: IOpenLibraryAuthor = await authorResponse.json()
          authorName = author.name || 'Unknown Author'
        }
      } catch (error) {
        console.error('Error fetching author:', error)
      }
    }

    // Fetch editions to get page count
    let pages = 0
    try {
      const editionsResponse = await fetch(`https://openlibrary.org/works/${id}/editions.json?limit=1`, {
        headers: {
          'User-Agent': 'Horror-Central/1.0 (horror-central@example.com)',
        },
        signal: AbortSignal.timeout(5000)
      })
      
      if (editionsResponse.ok) {
        const editionsData = await editionsResponse.json()
        if (editionsData.entries && editionsData.entries.length > 0) {
          const edition: IOpenLibraryEdition = editionsData.entries[0]
          pages = edition.number_of_pages || 0
        }
      }
    } catch (error) {
      console.error('Error fetching editions:', error)
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

    // Extract year from first_publish_date
    const year = work.first_publish_date 
      ? parseInt(work.first_publish_date.split('-')[0]) || 0
      : 0

    // Build cover URL
    const posterUrl = work.covers && work.covers.length > 0
      ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-L.jpg`
      : '/images/book-placeholder.jpg'

    // Extract genres from subjects
    const genres = work.subjects 
      ? work.subjects.filter((subject: string) => 
          subject.toLowerCase().includes('horror') ||
          subject.toLowerCase().includes('thriller') ||
          subject.toLowerCase().includes('mystery') ||
          subject.toLowerCase().includes('supernatural') ||
          subject.toLowerCase().includes('gothic')
        ).slice(0, 5)
      : ['Horror']

    const bookDetails: IBookDetails = {
      id: work.key,
      title: work.title,
      posterUrl,
      rating: 0, // OpenLibrary doesn't provide ratings in work details
      year,
      author: authorName,
      pages,
      description,
      genre: genres.length > 0 ? genres : ['Horror'],
      slug: id,
    }

    return NextResponse.json(bookDetails)

  } catch (error) {
    console.error('Error fetching book details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
