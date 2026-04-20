# Stayward \u2014 Part 1

A deployable Next.js shell for the Stayward hotel booking platform. **Zero external dependencies to deploy.** Mock data, mock agentic search, real UI, real SEO.

---

## Deploy in 3 minutes

1. Upload this folder to GitHub (nahadgur or vimldn).
2. Import the repo into Vercel.
3. Deploy. No env vars needed.

That's it. You'll have a live URL with:

- Homepage with hero, manifesto, featured hotels, and "what you won't find"
- Natural-language search (mock-parsed) that returns ranked results with match reasons
- 12 hotel detail pages (London, Paris, Lisbon, Kyoto, Copenhagen, NYC x 2, Venice, Skye, Antwerp, Granada, Bergen)
- `/about/` philosophy page (Price Drop Protection, Insider membership)
- `/for-hotels/` B2B landing with pricing tiers and OTA comparison
- Sitemap, robots, SEO metadata, 404

---

## What to try in the live demo

Paste these into the search box on the homepage:

- `quiet Paris, deep soaking tub, fast wifi for a 3-day work sprint`
- `off-grid Scotland for a week with my partner`
- `design-led Copenhagen under \u00A3300 with a canal view`
- `silent Kyoto honeymoon, private bath`
- `Shoreditch, proper desk, I need to work`

You'll see the intent bar at the top (\u201CWhat we heard\u2026\u201D), the parsed vibe summary, and hotels ranked with specific match reasons.

---

## Local development

```cmd
npm install
npm run dev
```

Visit http://localhost:3000

---

## Structure

```
app/
  page.tsx              Homepage
  layout.tsx            Root layout, fonts, SEO
  globals.css           Base styles
  search/
    page.tsx            Search results
    loading.tsx         Loading state
  hotels/[slug]/
    page.tsx            Hotel detail (SSG, 12 routes)
  about/page.tsx        Philosophy
  for-hotels/page.tsx   B2B landing
  sitemap.ts
  robots.ts
  not-found.tsx

components/
  SiteHeader.tsx
  SiteFooter.tsx
  SearchInput.tsx       The natural-language input
  HotelCard.tsx

lib/
  types.ts              Hotel / Amenity / ParsedQuery / MatchResult
  search.ts             Mock agentic search (swappable for real Claude + Pinecone in Part 2)

data/
  hotels.ts             12 seed hotels with rich natural-language inventory
```

---

## Design system

- **Fonts:** Fraunces (display, variable) + Inter Tight (body) + JetBrains Mono (tabular)
- **Palette:** Paper #F7F3EC / Ink #1A1613 / Terracotta #B8522D / Sage #6B7A5C
- **Layout:** Editorial, asymmetric, generous whitespace
- **Motion:** One orchestrated page-load stagger. Subtle hover states. No scroll gimmicks.

---

## What\u2019s coming in Part 2

| Feature | Part 1 | Part 2 |
| --- | --- | --- |
| Search parser | Rule-based (lib/search.ts) | Claude API with structured JSON output |
| Vibe matching | Token overlap | OpenAI embeddings \u2192 Pinecone ANN |
| Hotel data | Hardcoded (12 hotels) | Supabase Postgres + RLS |
| Bookings | Disabled (stub button) | Stripe PaymentIntents |
| Hotel onboarding | None | Self-serve + Stripe subscription |
| Price Drop Protection | Explained only | pg_cron + Stripe customer_balance |
| Insider membership | Explained only | Stripe recurring subscription |

All env vars for Part 2 are scaffolded in `.env.example`. The interfaces in `lib/search.ts` are designed to be swapped in-place without touching any UI component.

---

## Tech

- Next.js 14 (App Router)
- TypeScript strict
- Tailwind CSS v3
- Framer Motion (animations)
- Lucide icons
- `trailingSlash: true` throughout
- All pages SSG where possible (hotel pages, homepage, about, for-hotels)

---

## Build verified

Run locally:

```cmd
npm install
npm run build
```

You should see 18 static routes generated, including the 12 hotel pages via `generateStaticParams`.
