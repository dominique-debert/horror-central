import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Share2, BookmarkPlus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsArticleProps {
  article: {
    id: string
    title: string
    content: string
    excerpt: string
    imageUrl: string
    author: string
    publishedAt: string
    readTime: string
    category: string
    tags: string[]
    slug: string
  }
}

export default function NewsArticle({ article }: NewsArticleProps) {
  return (
    <article className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="container mx-auto px-8 py-8">
        <Link 
          href="/news" 
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 mb-8">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Badge className="bg-red-600 text-white mb-4">
              {article.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      {/* Article Meta */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-6 text-gray-400">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
