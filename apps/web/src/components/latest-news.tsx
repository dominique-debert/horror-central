import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  author: string
  publishedAt: string
  readTime: string
  category: string
  slug: string
}

interface LatestNewsProps {
  articles?: NewsArticle[]
}

const defaultArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Scream VII Gets New Director After Creative Shake-Up",
    excerpt: "The horror franchise continues with a fresh vision as the studio announces a new creative team for the upcoming sequel.",
    imageUrl: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=400&h=250&fit=crop",
    author: "Sarah Mitchell",
    publishedAt: "2024-01-15",
    readTime: "3 min read",
    category: "Movie News",
    slug: "scream-vii-new-director"
  },
  {
    id: "2",
    title: "Jordan Peele Teases His Next Horror Project",
    excerpt: "The acclaimed director drops hints about his upcoming film, promising another mind-bending horror experience.",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=400&h=250&fit=crop",
    author: "Mike Thompson",
    publishedAt: "2024-01-14",
    readTime: "2 min read",
    category: "Industry",
    slug: "jordan-peele-next-project"
  },
  {
    id: "3",
    title: "Classic Horror Movies Getting 4K Restorations",
    excerpt: "Several beloved horror classics from the 80s and 90s are receiving the 4K treatment for modern audiences.",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=250&fit=crop",
    author: "Lisa Chen",
    publishedAt: "2024-01-13",
    readTime: "4 min read",
    category: "Restoration",
    slug: "classic-horror-4k-restoration"
  },
  {
    id: "4",
    title: "Horror Film Festival Announces 2024 Lineup",
    excerpt: "This year's festival promises to showcase the best in independent horror cinema from around the world.",
    imageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=250&fit=crop",
    author: "David Rodriguez",
    publishedAt: "2024-01-12",
    readTime: "5 min read",
    category: "Festival",
    slug: "horror-festival-2024-lineup"
  }
]

export default function LatestNews({ articles = defaultArticles }: LatestNewsProps) {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Latest News</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay up to date with the latest horror movie news, reviews, and industry updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`}>
              <Card className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all duration-300 group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4 flex flex-col flex-grow">
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/news" 
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}
