"use client"

import Link from "next/link"
import SearchBar from "@/components/search-bar"
import ThemeToggle from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

export default function SiteHeader() {
  const nav = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv" },
    { name: "Games", href: "/games" },
  ]

  const { user, signOut } = useAuth()
  const userLabel = useMemo(() => user?.name || user?.email, [user])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          Horror Central
        </Link>
        <nav className="hidden gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:inline">{userLabel}</span>
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}