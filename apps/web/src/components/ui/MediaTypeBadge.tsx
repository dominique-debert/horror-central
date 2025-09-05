import { Badge } from "@/components/ui/badge"

interface MediaTypeBadgeProps {
  type: 'movie' | 'tv'
}

export function MediaTypeBadge({ type }: MediaTypeBadgeProps) {
  return (
    <Badge 
      className={`text-xs font-semibold ${
        type === 'movie' 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}
    >
      {type === 'movie' ? 'MOVIE' : 'TV SHOW'}
    </Badge>
  )
}
