import type { MetadataRoute } from 'next'

const SITE = 'https://hotel-city-khaki.vercel.app'
const LAST_MOD = '2026-04-20'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: '', priority: 1 },
    { path: '/plan', priority: 0.9 },
    { path: '/about', priority: 0.8 },
    { path: '/for-hotels', priority: 0.8 },
  ]

  return staticRoutes.map(({ path, priority }) => ({
    url: `${SITE}${path}/`,
    lastModified: LAST_MOD,
    changeFrequency: 'weekly' as const,
    priority,
  }))
}
