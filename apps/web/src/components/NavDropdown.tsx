'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const movieCategories = [
  { name: 'Popular', href: '/movies/popular' },
  { name: 'Now Playing', href: '/movies/now-playing' },
  { name: 'Top Rated', href: '/movies/top-rated' },
  { name: 'Upcoming', href: '/movies/upcoming' },
];

const tvShowCategories = [
  { name: 'Popular', href: '/tv/popular' },
  { name: 'Airing Today', href: '/tv/airing-today' },
  { name: 'On TV', href: '/tv/on-the-air' },
  { name: 'Top Rated', href: '/tv/top-rated' },
];

export function NavDropdown() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href.split('/')[1]);

  return (
    <nav className="hidden md:flex items-center space-x-6">
      <div className="group relative">
        <button className="flex items-center space-x-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
          <span>Movies</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            {movieCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm hover:bg-accent',
                  isActive(item.href) ? 'bg-accent' : ''
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="group relative">
        <button className="flex items-center space-x-1 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
          <span>TV Shows</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-1">
            {tvShowCategories.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-sm hover:bg-accent',
                  isActive(item.href) ? 'bg-accent' : ''
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
