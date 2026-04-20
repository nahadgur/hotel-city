import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/search/', '/api/', '/dashboard/', '/login/'],
      },
    ],
    sitemap: 'https://stayward.vercel.app/sitemap.xml',
  }
}
