"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

export interface NewsArticle {
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

interface NewsCardProps {
  article: NewsArticle
  layout?: 'horizontal' | 'vertical'
}

export default function NewsCard({ article, layout = 'horizontal' }: NewsCardProps) {
  if (layout === 'horizontal') {
    return (
      <Card className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all duration-300 group">
        <div className="flex h-full">
          {/* Image Section - Left Side */}
          <div className="relative w-1/4 min-w-[200px] overflow-hidden rounded-l-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={250}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Content Section - Right Side */}
          <CardContent className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-xl group-hover:text-red-400 transition-colors line-clamp-2 flex-1 mr-4">
                  {article.title}
                </h3>
                <Badge variant="outline" className="text-xs border-red-600 text-red-400 bg-red-600/10 shrink-0">
                  {article.category}
                </Badge>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 text-xs space-x-4">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{article.readTime}</span>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
                asChild
              >
                <Link href={`/news/${article.slug}`}>
                  Read More
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  // Vertical layout (for grid display)
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="text-xs border-red-600 text-red-400 bg-red-600/10">
            {article.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="w-full border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-600 hover:text-white"
          asChild
        >
          <Link href={`/news/${article.slug}`}>
            Read More
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
