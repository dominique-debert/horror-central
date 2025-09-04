"use client"

import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"
import Image from "next/image"

interface HeroSectionProps {
  title: string
  description: string
  backgroundImage: string
  trailerUrl?: string
  moreInfoUrl?: string
}

export default function HeroSection({
  title,
  description,
  backgroundImage,
  trailerUrl,
  moreInfoUrl,
}: HeroSectionProps) {
  return (
    <section className="relative h-[30vh] min-h-[250px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl font-bold text-white md:text-6xl lg:text-7xl">
              {title}
            </h1>
            
            <p className="text-lg text-gray-200 md:text-xl">
              {description}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              {trailerUrl && (
                <Button
                  size="lg"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={() => window.open(trailerUrl, '_blank')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Trailer
                </Button>
              )}
              
              {moreInfoUrl && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                  onClick={() => window.open(moreInfoUrl, '_blank')}
                >
                  <Info className="mr-2 h-5 w-5" />
                  More Info
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
