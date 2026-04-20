import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://stayward.vercel.app'),
  title: {
    default: 'Stayward \u2013 A concierge for direct hotel quotes.',
    template: '%s \u2013 Stayward',
  },
  description:
    'Describe the stay you want. A small team in London replies with direct hotel quotes by email within 24 hours. Usually below what you\'d find on Booking.com.',
  openGraph: {
    title: 'Stayward \u2013 A concierge for direct hotel quotes.',
    description: 'Describe your stay. A real person replies with quotes within 24 hours.',
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
