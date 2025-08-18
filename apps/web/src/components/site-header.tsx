"use client"

import Link from "next/link"
import SearchBar from "@/components/search-bar"
import { useAuth } from "@/context/auth-context"
import { useMemo } from "react"

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
        <Link href="/" className="font-semibold tracking-tight">
          Horror Central
        </Link>
        <nav className="hidden gap-2 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{userLabel}</span>
              <button
                onClick={() => signOut()}
                className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}