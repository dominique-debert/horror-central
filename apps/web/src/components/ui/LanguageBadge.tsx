"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface LanguageBadgeProps {
  language: string
  className?: string
}

const languageLabels: Record<string, string> = {
  'en': 'EN',
  'ko': 'KO', 
  'es': 'ES',
  'de': 'DE',
  'sv': 'SV',
  'da': 'DA'
}

const languageNames: Record<string, string> = {
  'en': 'English',
  'ko': 'Korean',
  'es': 'Spanish', 
  'de': 'German',
  'sv': 'Swedish',
  'da': 'Danish'
}

export function LanguageBadge({ language, className }: LanguageBadgeProps) {
  const label = languageLabels[language] || language.toUpperCase()
  const name = languageNames[language] || language
  
  return (
    <Badge 
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors",
        className
      )}
      title={name}
    >
      {label}
    </Badge>
  )
}
