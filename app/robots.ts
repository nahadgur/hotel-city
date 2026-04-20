import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/brief/new/'],
        disallow: ['/search/', '/api/', '/brief/'],
      },
    ],
    sitemap: 'https://stayward.vercel.app/sitemap.xml',
  }
}
