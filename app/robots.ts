import type { MetadataRoute } from 'next'

const SITE = 'https://hotel-city-khaki.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',              // API routes
          '/plan/received/',    // thank-you confirmation page, no SEO value
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
