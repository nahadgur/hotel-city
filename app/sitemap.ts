import type { MetadataRoute } from 'next'
import { hotels } from '@/data/hotels'

const SITE = 'https://hotel-city-khaki.vercel.app'
const LAST_MOD = '2026-04-20'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/plan', priority: 0.9 },
    { path: '/hotels', priority: 0.9 },
    { path: '/guide', priority: 0.9 },
    { path: '/guide/london', priority: 0.85 },
    { path: '/guide/rate-parity', priority: 0.7 },
    { path: '/guide/private-rates', priority: 0.7 },
    { path: '/about', priority: 0.8 },
    { path: '/for-hotels', priority: 0.8 },
  ]

  const hotelRoutes = hotels.map((h) => ({
    path: `/hotels/${h.slug}`,
    priority: 0.8,
  }))

  return [...staticRoutes, ...hotelRoutes].map(({ path, priority }) => ({
    url: `${SITE}${path}/`,
    lastModified: LAST_MOD,
    changeFrequency: 'weekly' as const,
    priority,
  }))
}
