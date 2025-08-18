"use client"

import { useRouter } from "next/navigation"
import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"

export default function SearchBar({ placeholder = "Search horror titles..." }: { placeholder?: string }) {
  const router = useRouter()
  const [q, setQ] = useState("")

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-center gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="h-9 flex-1 rounded-md border border-border bg-input px-3 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Search"
      />
      <Button type="submit" variant="default" className="h-9">Search</Button>
    </form>
  )
}
