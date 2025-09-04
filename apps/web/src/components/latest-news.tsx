"use client"

import NewsCard, { NewsArticle } from "@/components/ui/news-card"
import Link from "next/link"

interface LatestNewsProps {
  articles?: NewsArticle[]
}

const defaultArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Scream VII Gets New Director After Creative Shake-Up",
    excerpt: "The horror franchise continues with a fresh vision as the studio announces a new creative team for the upcoming sequel. This major change comes after months of speculation about the direction of the beloved slasher series.",
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
    excerpt: "The acclaimed director drops hints about his upcoming film, promising another mind-bending horror experience that will challenge audiences' expectations. Sources close to the production suggest it will be his most ambitious work yet.",
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
    excerpt: "Several beloved horror classics from the 80s and 90s are receiving the 4K treatment for modern audiences. The restoration process involves painstaking work to preserve the original vision while enhancing visual quality.",
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
    excerpt: "This year's festival promises to showcase the best in independent horror cinema from around the world. The lineup includes premieres from emerging filmmakers alongside retrospectives of genre masters.",
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

        <div className="space-y-6">
          {articles.map((article) => {
            const newsArticle: NewsArticle = {
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              imageUrl: article.imageUrl,
              author: article.author,
              publishedAt: article.publishedAt,
              readTime: article.readTime,
              category: article.category,
              slug: article.slug
            }
            
            return (
              <NewsCard
                key={article.id}
                article={newsArticle}
                layout="horizontal"
              />
            )
          })}
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
