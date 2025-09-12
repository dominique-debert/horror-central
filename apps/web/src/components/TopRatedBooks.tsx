"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MediaCard } from "@/components/ui/MediaCard"

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

export default function TopRatedBooks() {
  const [books, setBooks] = useState<BookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/books?type=all-time-top-rated&page=1&sortBy=rating.desc&limit=8')
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      const data = await response.json()
      setBooks((data.books || []).slice(0, 8))
    } catch (err) {
      console.error('Error fetching books:', err)
      try {
        const fallbackResponse = await fetch('/api/books?type=top-rated&limit=8')
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json()
          setBooks((fallbackData.books || []).slice(0, 8))
          return
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch failed:', fallbackErr)
      }
      setError('Failed to load books. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  return (
    <div className="container mx-auto mt-6 px-6">
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Top Rated Horror Books</h2>
            <p className="text-gray-400 mt-2">Discover the highest-rated horror books of all time, curated by critics and readers</p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white h-fit">
            <Link href="/books">
              View All
            </Link>
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-900 rounded-lg animate-pulse h-96" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button 
              onClick={fetchBooks}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => ({
              id: book.id,
              title: book.title,
              description: book.description,
              posterUrl: book.posterUrl,
              rating: book.rating,
              year: book.year,
              author: book.author,
              pages: book.pages,
              genre: book.genre,
              slug: book.slug,
              type: 'book' as const
            })).map((book) => (
              <MediaCard
                key={book.id}
                item={book}
                type="book"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
