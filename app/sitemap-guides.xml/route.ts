const SITE = 'https://hotel-city-khaki.vercel.app'
const LAST_MOD = '2026-04-21'

type GuideEntry = { path: string; priority: number; changefreq: string }

const GUIDES: GuideEntry[] = [
  // Pillar
  { path: '/guide/', priority: 0.9, changefreq: 'weekly' },
  // Regional hubs
  { path: '/guide/london/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/cotswolds/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/scotland/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/lake-district/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/cornwall/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/yorkshire/', priority: 0.85, changefreq: 'weekly' },
  { path: '/guide/bath-oxford-and-country/', priority: 0.85, changefreq: 'weekly' },
  // Themed guides
  { path: '/guide/afternoon-tea/', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/michelin-starred-hotels/', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/dog-friendly-hotels/', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/historic-hotels/', priority: 0.8, changefreq: 'monthly' },
  { path: '/guide/small-luxury-hotels/', priority: 0.8, changefreq: 'monthly' },
  // Editorial spokes
  { path: '/guide/rate-parity/', priority: 0.7, changefreq: 'monthly' },
  { path: '/guide/private-rates/', priority: 0.7, changefreq: 'monthly' },
]

export async function GET() {
  const urls = GUIDES.map((g) => `
  <url>
    <loc>${SITE}${g.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${g.changefreq}</changefreq>
    <priority>${g.priority}</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
