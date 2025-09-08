'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { 
  Star, 
  Calendar, 
  Clock, 
  Tv, 
  Gamepad2, 
  BookOpen, 
  User, 
  ArrowLeft,
  Play,
  Monitor,
  Smartphone,
  Zap,
  Award
} from 'lucide-react'
import { LanguageBadge } from '@/components/ui/LanguageBadge'

interface CastMember {
  id: number
  name: string
  character: string
  profile_path?: string
}

interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path?: string
}

interface MediaDetails {
  id: string
  title: string
  posterUrl?: string
  coverUrl?: string
  rating: number
  year: number
  duration?: string
  description: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  releaseDate?: string
  originalLanguage?: string
  
  // Movie specific
  director?: string
  cast?: CastMember[]
  crew?: CrewMember[]
  budget?: string
  boxOffice?: string
  
  // TV Show specific
  seasons?: number
  episodes?: number
  network?: string
  status?: string
  showrunner?: string
  writer?: string
  producer?: string
  composer?: string
  
  // Game specific
  platform?: string | string[]
  developer?: string
  gamePublisher?: string
  
  // Book specific
  author?: string
  pages?: number
  isbn?: string
  bookPublisher?: string
  
  // VOD data
  watchProviders?: Array<{
    provider_name: string
    logo_path: string
    type: string
    region: string
  }>
  
  // Trailers
  trailers?: Array<{
    id: string
    key: string
    name: string
    site: string
    type: string
    official: boolean
  }>
}

type MediaType = 'movie' | 'tv' | 'game' | 'book'

const isValidMediaType = (type: string): type is MediaType => {
  return ['movie', 'tv', 'game', 'book'].includes(type)
}

const getMediaTypeIcon = (type: MediaType) => {
  switch (type) {
    case 'movie': return Play
    case 'tv': return Tv
    case 'game': return Gamepad2
    case 'book': return BookOpen
  }
}

const getMediaTypeLabel = (type: MediaType) => {
  switch (type) {
    case 'movie': return 'Movie'
    case 'tv': return 'TV Show'
    case 'game': return 'Game'
    case 'book': return 'Book'
  }
}

const getPlatformIcons = (platform: string | string[]) => {
  const platforms = Array.isArray(platform) ? platform : [platform]
  return platforms.slice(0, 3).map(p => {
    const platformName = p.toLowerCase()
    if (platformName.includes('pc') || platformName.includes('windows') || platformName.includes('steam')) {
      return { icon: Monitor, name: 'PC' }
    } else if (platformName.includes('playstation') || platformName.includes('ps')) {
      return { icon: Gamepad2, name: 'PlayStation' }
    } else if (platformName.includes('xbox')) {
      return { icon: Zap, name: 'Xbox' }
    } else if (platformName.includes('nintendo') || platformName.includes('switch')) {
      return { icon: Tv, name: 'Nintendo' }
    } else if (platformName.includes('mobile') || platformName.includes('ios') || platformName.includes('android')) {
      return { icon: Smartphone, name: 'Mobile' }
    } else {
      return { icon: Monitor, name: p }
    }
  })
}

export default function MediaDetailsPage() {
  const params = useParams()
  const [media, setMedia] = useState<MediaDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrailer, setSelectedTrailer] = useState<{key: string, name: string} | null>(null)

  const type = params?.type as string
  const id = params?.id as string

  useEffect(() => {
    if (!type || !id || !isValidMediaType(type)) {
      setError('Invalid media type or ID')
      setLoading(false)
      return
    }

    const fetchMediaDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        let apiEndpoint = ''
        switch (type) {
          case 'movie':
            apiEndpoint = `/api/movies/${id}`
            break
          case 'tv':
            apiEndpoint = `/api/tv/${id}`
            break
          case 'game':
            apiEndpoint = `/api/games/${id}`
            break
          case 'book':
            apiEndpoint = `/api/books/${id}`
            break
        }

        const response = await fetch(apiEndpoint)
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} details`)
        }

        const data = await response.json()
        setMedia(data)
      } catch (err) {
        console.error('Error fetching media details:', err)
        setError(`Failed to load ${type} details. Please try again.`)
      } finally {
        setLoading(false)
      }
    }

    fetchMediaDetails()
  }, [type, id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-6">
            <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !media) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error || 'Media not found'}</p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const MediaIcon = getMediaTypeIcon(type as MediaType)
  const imageUrl = media.posterUrl || media.coverUrl || '/placeholder-poster.jpg'

  return (
    <div className="container mx-auto px-4">
      {/* Trailer Modal */}
      <Dialog open={!!selectedTrailer} onOpenChange={(open: boolean) => !open && setSelectedTrailer(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black border-0">
          <DialogTitle className="sr-only">
            {selectedTrailer ? `Trailer: ${selectedTrailer.name}` : 'Trailer Player'}
          </DialogTitle>
          <div className="aspect-video w-full">
            {selectedTrailer && (
              <iframe
                src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedTrailer.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster/Cover */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="relative aspect-[2/3]">
              <Image
                src={imageUrl}
                alt={media.title}
                fill
                className="object-cover"
                priority
              />
              {media.originalLanguage && (
                <div className="absolute top-4 right-4">
                  <LanguageBadge language={media.originalLanguage} />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MediaIcon className="w-5 h-5 text-red-400" />
              <Badge variant="outline" className="border-red-600 text-red-400">
                {getMediaTypeLabel(type as MediaType)}
              </Badge>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {media.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{media.year}</span>
              </div>
              {media.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{media.duration}</span>
                </div>
              )}
              {media.seasons && (
                <div className="flex items-center gap-1">
                  <Tv className="w-4 h-4" />
                  <span>{media.seasons} Season{media.seasons !== 1 ? 's' : ''}</span>
                </div>
              )}
              {media.pages && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{media.pages} pages</span>
                </div>
              )}
              {media.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{media.rating.toFixed(1)}/10</span>
                </div>
              )}
            </div>
          </div>

          {/* Genres */}
          {media.genre && media.genre.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {media.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-gray-800 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{media.description}</p>
          </div>

          {/* Creator/Author/Director */}
          {(media.director || media.author || media.developer) && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {type === 'movie' ? 'Director' : 
                 type === 'book' ? 'Author' : 
                 type === 'game' ? 'Developer' : 'Creator'}
              </h3>
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-4 h-4" />
                <span>{media.director || media.author || media.developer}</span>
              </div>
            </div>
          )}

          {/* TV Show Key Crew */}
          {type === 'tv' && (media.showrunner || media.writer || media.producer || media.composer) && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Key Crew</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {media.showrunner && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-400">Showrunner:</span>
                      <span className="ml-2">{media.showrunner}</span>
                    </div>
                  </div>
                )}
                {media.writer && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-400">Writer:</span>
                      <span className="ml-2">{media.writer}</span>
                    </div>
                  </div>
                )}
                {media.producer && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-400">Producer:</span>
                      <span className="ml-2">{media.producer}</span>
                    </div>
                  </div>
                )}
                {media.composer && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <div>
                      <span className="text-sm text-gray-400">Composer:</span>
                      <span className="ml-2">{media.composer}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cast */}
          {media.cast && media.cast.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                      {actor.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                      {actor.name}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
              {media.cast.length > 8 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    And {media.cast.length - 8} more cast members
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Crew */}
          {media.crew && media.crew.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Key Crew</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {media.crew.slice(0, 8).map((crewMember) => (
                  <div key={`${crewMember.id}-${crewMember.job}`} className="text-center">
                    <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden bg-gray-800">
                      {crewMember.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${crewMember.profile_path}`}
                          alt={crewMember.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                      {crewMember.name}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {crewMember.job}
                    </p>
                  </div>
                ))}
              </div>
              {media.crew.length > 8 && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    And {media.crew.length - 8} more crew members
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Platform (Games) */}
          {type === 'game' && media.platform && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Platforms</h3>
              <div className="flex flex-wrap gap-3">
                {getPlatformIcons(media.platform).map((platform, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                    <platform.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailers Section */}
          {media.trailers && media.trailers.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Play className="w-6 h-6 text-red-600" />
                Trailers & Clips
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {media.trailers.map((trailer) => (
                  <div 
                    key={trailer.id} 
                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedTrailer({ key: trailer.key, name: trailer.name })}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-medium line-clamp-2">
                        {trailer.name}
                        {trailer.official && (
                          <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                            Official
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* VOD Providers */}
          {media.watchProviders && media.watchProviders.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Where to Watch</h3>
              <div className="flex flex-wrap gap-2">
                {media.watchProviders.slice(0, 6).map((provider, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                    <span className="text-gray-300 text-sm">{provider.provider_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {provider.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {media.network && (
              <div>
                <h4 className="font-medium text-white mb-1">Network</h4>
                <p className="text-gray-400">{media.network}</p>
              </div>
            )}
            {(media.gamePublisher || media.bookPublisher) && (
              <div>
                <h4 className="font-medium text-white mb-1">Publisher</h4>
                <p className="text-gray-400">{media.gamePublisher || media.bookPublisher}</p>
              </div>
            )}
            {media.status && (
              <div>
                <h4 className="font-medium text-white mb-1">Status</h4>
                <p className="text-gray-400">{media.status}</p>
              </div>
            )}
            {media.episodes && (
              <div>
                <h4 className="font-medium text-white mb-1">Episodes</h4>
                <p className="text-gray-400">{media.episodes}</p>
              </div>
            )}
          </div>

          {/* Awards */}
          {media.awards && media.awards.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Awards</h3>
              <div className="space-y-2">
                {media.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span>{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
