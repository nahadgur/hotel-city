import type { Metadata } from 'next'
import './globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://stayward.vercel.app'),
  title: {
    default: 'Stayward – Direct hotel quotes, below the public rate.',
    template: '%s – Stayward',
  },
  description: 'Describe what you want. Hotels quote you direct by email. Often below the public rate, because direct quotes sit outside OTA parity.',
  openGraph: {
    title: 'Stayward – Direct hotel quotes, below the public rate.',
    description: 'Describe what you want. Hotels quote you direct.',
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
        <AuthProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  )
}
