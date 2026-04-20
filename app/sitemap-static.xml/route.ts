const SITE = 'https://hotel-city-khaki.vercel.app'
const LAST_MOD = '2026-04-21'

type StaticEntry = { path: string; priority: number; changefreq: string }

const STATIC: StaticEntry[] = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/hotels/', priority: 0.9, changefreq: 'weekly' },
  { path: '/plan/', priority: 0.9, changefreq: 'monthly' },
  { path: '/about/', priority: 0.8, changefreq: 'monthly' },
  { path: '/for-hotels/', priority: 0.8, changefreq: 'monthly' },
]

export async function GET() {
  const urls = STATIC.map((s) => `
  <url>
    <loc>${SITE}${s.path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${s.changefreq}</changefreq>
    <priority>${s.priority}</priority>
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
