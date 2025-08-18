import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="border-t py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Horror Central</p>
          <nav className="flex items-center gap-4">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
