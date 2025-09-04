import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Award, Calendar, BookOpen, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface TopRatedBook {
  id: string
  title: string
  description: string
  coverUrl: string
  rating: number
  year: number
  pages: number
  author: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
}

interface TopRatedBooksProps {
  books?: TopRatedBook[]
}

const defaultBooks: TopRatedBook[] = [
  {
    id: "1",
    title: "The Exorcist",
    description: "William Peter Blatty's masterpiece that redefined supernatural horror literature with its terrifying exploration of faith and evil.",
    coverUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    rating: 9.1,
    year: 1971,
    pages: 340,
    author: "William Peter Blatty",
    genre: ["Supernatural", "Religious Horror"],
    awards: ["New York Times Bestseller", "Horror Writers Association Award"],
    criticsScore: 92,
    audienceScore: 89,
    slug: "the-exorcist"
  },
  {
    id: "2",
    title: "The Shining",
    description: "Stephen King's psychological horror masterpiece about isolation, madness, and the supernatural forces within the Overlook Hotel.",
    coverUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=300&h=450&fit=crop",
    rating: 8.9,
    year: 1977,
    pages: 447,
    author: "Stephen King",
    genre: ["Psychological Horror", "Supernatural"],
    awards: ["World Fantasy Award Nominee", "Locus Award Winner"],
    criticsScore: 88,
    audienceScore: 91,
    slug: "the-shining"
  },
  {
    id: "3",
    title: "The Haunting of Hill House",
    description: "Shirley Jackson's seminal work that established the template for modern haunted house stories with subtle psychological terror.",
    coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=450&fit=crop",
    rating: 8.7,
    year: 1959,
    pages: 246,
    author: "Shirley Jackson",
    genre: ["Gothic Horror", "Psychological"],
    awards: ["National Book Award Finalist", "Time Magazine All-Time 100 Novels"],
    criticsScore: 95,
    audienceScore: 86,
    slug: "haunting-of-hill-house"
  },
  {
    id: "4",
    title: "Dracula",
    description: "Bram Stoker's iconic vampire novel that created the template for modern vampire fiction and remains unmatched in gothic atmosphere.",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    rating: 8.5,
    year: 1897,
    pages: 418,
    author: "Bram Stoker",
    genre: ["Gothic Horror", "Classic"],
    awards: ["Literary Classic", "Horror Hall of Fame"],
    criticsScore: 90,
    audienceScore: 88,
    slug: "dracula"
  },
  {
    id: "5",
    title: "The Silence of the Lambs",
    description: "Thomas Harris's psychological thriller featuring the iconic Hannibal Lecter, blending crime and horror in unforgettable fashion.",
    coverUrl: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop",
    rating: 8.6,
    year: 1988,
    pages: 352,
    author: "Thomas Harris",
    genre: ["Psychological Thriller", "Crime Horror"],
    awards: ["Bram Stoker Award Winner", "Anthony Award Winner"],
    criticsScore: 87,
    audienceScore: 92,
    slug: "silence-of-the-lambs"
  },
  {
    id: "6",
    title: "World War Z",
    description: "Max Brooks's innovative oral history of a zombie apocalypse that revolutionized zombie fiction with its realistic approach.",
    coverUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=450&fit=crop",
    rating: 8.2,
    year: 2006,
    pages: 342,
    author: "Max Brooks",
    genre: ["Zombie Horror", "Post-Apocalyptic"],
    awards: ["Scribe Award Winner", "New York Times Bestseller"],
    criticsScore: 83,
    audienceScore: 89,
    slug: "world-war-z"
  }
]

function getRatingColor(rating: number): string {
  if (rating >= 9.0) return "text-green-400"
  if (rating >= 8.0) return "text-yellow-400"
  if (rating >= 7.0) return "text-orange-400"
  return "text-red-400"
}

export default function TopRatedBooks({ books = defaultBooks }: TopRatedBooksProps) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the most influential and terrifying horror literature that has shaped the genre for generations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, index) => (
            <Card key={book.id} className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group relative">
              {index < 3 && (
                <div className="absolute bottom-3 left-3 z-10">
                  <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
              )}
              
              <div className="relative overflow-hidden">
                <Image
                  src={book.coverUrl}
                  alt={book.title}
                  width={300}
                  height={450}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <div className="flex items-center ml-2">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className={`font-bold ${getRatingColor(book.rating)}`}>
                      {book.rating}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="mr-3">{book.year}</span>
                  <BookOpen className="w-3 h-3 mr-1" />
                  <span>{book.pages} pages</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-2">
                  by <span className="text-white">{book.author}</span>
                </p>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {book.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {book.genre.slice(0, 2).map((g) => (
                    <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                      {g}
                    </Badge>
                  ))}
                </div>
                
                {book.awards && book.awards.length > 0 && (
                  <div className="flex items-center mb-3">
                    <Award className="w-3 h-3 text-yellow-400 mr-1" />
                    <span className="text-xs text-yellow-400 truncate">
                      {book.awards[0]}
                    </span>
                  </div>
                )}
                
                {(book.criticsScore || book.audienceScore) && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    {book.criticsScore && (
                      <span>Critics: {book.criticsScore}%</span>
                    )}
                    {book.audienceScore && (
                      <span>Readers: {book.audienceScore}%</span>
                    )}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
                  asChild
                >
                  <Link href={`/books/${book.slug}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/books" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All Horror Books
          </Link>
        </div>
      </div>
    </section>
  )
}
