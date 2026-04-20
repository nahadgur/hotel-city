import { hotels } from '@/data/hotels'

const SITE = 'https://hotel-city-khaki.vercel.app'
const LAST_MOD = '2026-04-21'

export async function GET() {
  const urls = hotels.map((h) => `
  <url>
    <loc>${SITE}/hotels/${h.slug}/</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
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
