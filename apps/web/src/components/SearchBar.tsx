"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchBar({ placeholder = "Search horror titles..." }: { placeholder?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')

  // Update URL when search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (q.trim()) {
        router.push(`/search?q=${encodeURIComponent(q.trim())}`)
      } else if (window.location.pathname === '/search') {
        router.push('/search')
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [q, router])

  return (
    <div className="flex w-full max-w-md items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-9 flex-1 rounded-md border border-border bg-input px-3 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Search"
      />
    </div>
  )
}
