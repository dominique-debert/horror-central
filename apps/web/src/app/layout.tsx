import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import SiteFooter from "@/components/site-footer"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: "FreakyHub",
  description: "Your central hub for all things horror",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}