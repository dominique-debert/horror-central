import NewsArticle from "@/components/news-article"
import { notFound } from "next/navigation"

// Sample article data - in a real app, this would come from a database or CMS
const sampleArticles = {
  "scream-vii-new-director": {
    id: "1",
    title: "Scream VII Gets New Director After Creative Shake-Up",
    content: `
      <p>The horror franchise that redefined the slasher genre is getting a fresh perspective as Paramount Pictures announces a major creative shake-up for the upcoming seventh installment.</p>
      
      <p>Following the departure of the previous creative team, the studio has brought in acclaimed horror director Mike Flanagan, known for his work on "The Haunting of Hill House" and "Doctor Sleep," to helm the project.</p>
      
      <h2>A New Vision for Ghostface</h2>
      
      <p>"We're excited to bring Mike's unique storytelling approach to the Scream universe," said studio executive Sarah Johnson. "His ability to blend psychological horror with compelling character development makes him the perfect choice to continue this beloved franchise."</p>
      
      <p>Flanagan expressed his enthusiasm for the project, stating, "Scream has always been about subverting expectations while honoring the genre's roots. I'm thrilled to contribute to that legacy while bringing something entirely new to the table."</p>
      
      <h2>What to Expect</h2>
      
      <p>While plot details remain under wraps, sources close to the production suggest that Scream VII will explore new territory while maintaining the meta-commentary that made the franchise famous. The film is expected to feature both returning cast members and fresh faces.</p>
      
      <p>Production is set to begin in early 2024, with a planned release date of October 2024, just in time for Halloween.</p>
      
      <p>This marks a significant moment for the franchise, which has consistently evolved with each installment while maintaining its core identity as a smart, self-aware horror series.</p>
    `,
    excerpt: "The horror franchise continues with a fresh vision as the studio announces a new creative team for the upcoming sequel.",
    imageUrl: "https://images.unsplash.com/photo-1520637736862-4d197d17c90a?w=1200&h=600&fit=crop",
    author: "Sarah Mitchell",
    publishedAt: "2024-01-15",
    readTime: "3 min read",
    category: "Movie News",
    tags: ["Scream", "Horror", "Director", "Mike Flanagan", "Sequel"],
    slug: "scream-vii-new-director"
  },
  "jordan-peele-next-project": {
    id: "2",
    title: "Jordan Peele Teases His Next Horror Project",
    content: `
      <p>Academy Award-winning director Jordan Peele has dropped tantalizing hints about his next horror masterpiece, promising another thought-provoking thriller that will challenge audiences' expectations.</p>
      
      <p>Speaking at a recent film festival, Peele revealed that his upcoming project will explore themes of technology and human connection in ways that haven't been seen before in the horror genre.</p>
      
      <h2>Building on Success</h2>
      
      <p>Following the critical and commercial success of "Get Out," "Us," and "Nope," Peele has established himself as one of the most important voices in contemporary horror cinema. Each film has tackled different social issues while delivering genuine scares.</p>
      
      <p>"I'm always looking for new ways to make people uncomfortable," Peele explained. "Horror is the perfect vehicle for examining the things we don't want to talk about."</p>
      
      <h2>The Mystery Deepens</h2>
      
      <p>While Peele remained tight-lipped about specific plot details, he did confirm that the film will feature an ensemble cast and will be his most ambitious project to date.</p>
      
      <p>Industry insiders suggest that the film could explore themes related to artificial intelligence and social media, areas that Peele has hinted at in previous interviews.</p>
      
      <p>The untitled project is expected to begin production later this year, with Universal Pictures once again serving as the distributor.</p>
    `,
    excerpt: "The acclaimed director drops hints about his upcoming film, promising another mind-bending horror experience.",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=600&fit=crop",
    author: "Mike Thompson",
    publishedAt: "2024-01-14",
    readTime: "2 min read",
    category: "Industry",
    tags: ["Jordan Peele", "Horror", "Director", "Universal", "Thriller"],
    slug: "jordan-peele-next-project"
  }
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function NewsArticlePage({ params }: PageProps) {
  const article = sampleArticles[params.slug as keyof typeof sampleArticles]
  
  if (!article) {
    notFound()
  }

  return <NewsArticle article={article} />
}

export function generateStaticParams() {
  return Object.keys(sampleArticles).map((slug) => ({
    slug,
  }))
}
