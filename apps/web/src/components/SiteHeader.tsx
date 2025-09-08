"use client"

import Link from "next/link"
import SearchBar from "@/components/SearchBar"
import ThemeToggle from "@/components/ThemeToggle"
import { NavDropdown } from "@/components/NavDropdown"
import { useAuth } from "@/context/auth-context"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

export default function SiteHeader() {
  const nav = [
    { name: "Home", href: "/" },
    { name: "Games", href: "/games" },
    { name: "Books", href: "/books" },
  ]

  const { user, signOut } = useAuth()
  
  const userInitial = useMemo(
    () => user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U",
    [user]
  )

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="font-semibold tracking-tight text-foreground">
          FreakyHub
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-accent hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
          <NavDropdown />
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <SearchBar />
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.image ? `${user.image}?t=${Date.now()}` : ""} 
                      alt={user.name || ""} 
                    />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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