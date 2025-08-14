import { FadeInUp, StaggerContainer } from '@/components/ui/animate'
import { Button } from '@/components/ui/button'
import { Film } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen p-6">
      <StaggerContainer className="max-w-6xl mx-auto space-y-12">
        <FadeInUp className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to Horror Central
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the best in horror movies, TV shows, and games
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Explore Now</Button>
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2} className="mt-20">
          <h2 className="text-3xl font-semibold mb-6">Featured Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <FadeInUp 
                key={item} 
                delay={0.2 + (item * 0.1)}
                className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-40 bg-muted rounded-md flex items-center justify-center mb-4">
                  <Film className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">Horror Title {item}</h3>
                <p className="text-muted-foreground mt-2">
                  A terrifying experience that will keep you up at night.
                </p>
              </FadeInUp>
            ))}
          </div>
        </FadeInUp>
      </StaggerContainer>
    </main>
  )
}
