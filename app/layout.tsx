import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://stayward.vercel.app'),
  title: {
    default: 'Stayward – Hotels, found properly.',
    template: '%s – Stayward',
  },
  description: 'Search boutique hotels the way you\'d describe them to a friend. No dark patterns, no surprise taxes, no fake urgency.',
  openGraph: {
    title: 'Stayward – Hotels, found properly.',
    description: 'Search boutique hotels the way you\'d describe them to a friend.',
    type: 'website',
    siteName: 'Stayward',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter+Tight:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
