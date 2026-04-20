import type { MetadataRoute } from 'next'
import { hotels } from '@/data/hotels'

const SITE = 'https://stayward.vercel.app'
const LAST_MOD = '2026-04-20'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/about',
    '/for-hotels',
  ].map((path) => ({
    url: `${SITE}${path}/`,
    lastModified: LAST_MOD,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const hotelRoutes = hotels.map((h) => ({
    url: `${SITE}/hotels/${h.slug}/`,
    lastModified: LAST_MOD,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...hotelRoutes]
}
