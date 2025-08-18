import type { Metadata } from "next"
import "./globals.css"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  title: "Horror Central",
  description: "Your central hub for all things horror",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}