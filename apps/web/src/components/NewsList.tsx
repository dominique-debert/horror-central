import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Search, Filter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

interface NewsListProps {
  articles?: NewsArticle[]
}

const defaultArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Scream VII Gets New Director After Creative Shake-Up",
    excerpt: "The horror franchise continues with a fresh vision as the studio announces a new creative team for the upcoming sequel.",
    imageUrl: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=600&h=400&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&h=400&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=400&fit=crop",
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
    imageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=400&fit=crop",
    author: "David Rodriguez",
    publishedAt: "2024-01-12",
    readTime: "5 min read",
    category: "Festival",
    slug: "horror-festival-2024-lineup"
  },
  {
    id: "5",
    title: "The Rise of Folk Horror in Modern Cinema",
    excerpt: "Exploring how traditional folklore and rural settings are creating a new wave of terrifying films.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    author: "Emma Watson",
    publishedAt: "2024-01-11",
    readTime: "6 min read",
    category: "Analysis",
    slug: "folk-horror-modern-cinema"
  },
  {
    id: "6",
    title: "Behind the Scenes: Making of The Conjuring Universe",
    excerpt: "An exclusive look at how the horror franchise built its interconnected world of supernatural terror.",
    imageUrl: "https://images.unsplash.com/photo-1489599510025-c4e5c6b9a8b7?w=600&h=400&fit=crop",
    author: "James Wilson",
    publishedAt: "2024-01-10",
    readTime: "8 min read",
    category: "Behind the Scenes",
    slug: "conjuring-universe-making-of"
  }
]

const categories = ["All", "Movie News", "Industry", "Festival", "Analysis", "Behind the Scenes", "Restoration"]

export default function NewsList({ articles = defaultArticles }: NewsListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-6">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Horror News</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay updated with the latest horror movie news, industry insights, and behind-the-scenes content
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`}>
              <Card className="bg-gray-900 border-gray-700 hover:border-red-600 transition-all duration-300 group cursor-pointer h-full">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-red-600 text-white">
                      {article.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h2 className="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                    <div className="flex items-center space-x-4">
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

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
          >
            Load More Articles
          </Button>
        </div>
      </div>
    </div>

  )
}
