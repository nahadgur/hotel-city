# Stayward

A deployable Next.js MVP for the Stayward hotel booking platform.

Natural-language agentic search that matches travellers to boutique hotels by vibe and verified detail. Parses queries with Claude, embeds vibe with OpenAI, retrieves with Pinecone, ranks with a hybrid vibe/structured/quality score.

---

## Two modes — no wrong way to deploy

**Mock mode** (zero dependencies): if no API keys are set, the site uses a local rule-based search. Still impressive, still demo-worthy, still deployable. This was Part 1.

**Agentic mode** (Part 2): add Anthropic + OpenAI + Pinecone keys and the search becomes real. Handles queries like *"somewhere that feels like a Wes Anderson film"* or *"a hotel where I can actually focus for a week"*. Falls back gracefully to mock on any failure.

---

## Deploy to Vercel in 3 minutes (mock mode)

1. Upload this folder to GitHub (nahadgur or vimldn).
2. Import the repo into Vercel.
3. Deploy. **No env vars needed.**

That's it. Live URL with mock search.

---

## Upgrade to agentic mode (Part 2)

### Step 1 — Create API accounts (10 minutes total)

| Service | What you need | Cost |
|---|---|---|
| **[Anthropic](https://console.anthropic.com)** | API key | $5 free credit, ~$0.01/search after |
| **[OpenAI](https://platform.openai.com)** | API key | Pay-as-you-go, ~$0.0001/search |
| **[Pinecone](https://pinecone.io)** | API key + new index | Free tier covers this build |

For Pinecone, create an index with these exact settings:
- **Name**: `stayward-vibes`
- **Dimensions**: `1536`
- **Metric**: `cosine`
- **Cloud**: AWS
- **Region**: us-east-1
- **Type**: Serverless

### Step 2 — Set env vars on Vercel

In your Vercel project, Settings, Environment Variables, add these four:

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=stayward-vibes
```

Redeploy after adding.

### Step 3 — Seed the Pinecone index (one-time, local)

On your machine, create `.env.local` in the project root with the same four vars as above.

Then:

```cmd
npm install
npm run seed
```

You should see:
```
Target index: stayward-vibes
Hotels to embed: 12
Embedding (OpenAI text-embedding-3-small, 1536-dim)...
   Got 12 vectors, each 1536 dimensions
Upserting to Pinecone...
   Upserted 12 vectors
Done. Your search index is live.
```

Re-run `npm run seed` any time you edit `data/hotels.ts`.

### Step 4 — Test it

Visit your Vercel URL. The search results page should now show a small terracotta badge: *"Claude read your request"*. If you don't see that, mock mode is still running. Check your env vars.

Good queries to stress-test the agentic search:

- `somewhere that feels like a Wes Anderson film`
- `a room I can cry in without being bothered`
- `make me feel like I'm not on Earth`
- `a hotel where my partner and I can fight and still be friends in the morning`
- `Wi-Fi that actually works, ideally near a decent coffee shop`

Mock mode would match none of these. Agentic mode handles them all.

---

## Architecture

### Search pipeline (agentic mode)

```
raw query
  |
  v
1. Claude parses query to structured JSON
   { city, maxPriceGbp, requiredAmenities, workMode, noisePreference, vibeDescription }
  |
  v
2. OpenAI embeds vibeDescription (1536-dim vector)
  |
  v
3. Pinecone returns top-20 hotels by cosine similarity
  |
  v
4. Hard-filter on city / maxPrice
  |
  v
5. Score = 0.6 * vibe + 0.3 * structured + 0.1 * quality
  |
  v
6. Claude generates "why we matched" bullets for top 5
  |
  v
ranked results with reasons
```

### Fallback strategy

Every layer has a fallback. If Claude fails, the whole pipeline falls back to mock. If Pinecone is empty, structured matches still work. If only Claude's reason-generation fails for one hotel, that hotel falls back to amenity-based reasons. **Users never see an error page**. Worst case they get the mock experience.

---

## Structure

```
app/
  page.tsx                 Homepage
  layout.tsx               Root layout, fonts, SEO
  globals.css              Base styles
  search/
    page.tsx               Search results (async, uses agentic search)
    loading.tsx            Loading state
  hotels/[slug]/
    page.tsx               Hotel detail (SSG, 12 routes)
  about/page.tsx           Philosophy
  for-hotels/page.tsx      B2B landing
  sitemap.ts
  robots.ts
  not-found.tsx

components/
  SiteHeader.tsx
  SiteFooter.tsx
  SearchInput.tsx
  HotelCard.tsx

lib/
  types.ts                 Hotel / Amenity / ParsedQuery / MatchResult
  env.ts                   Centralised check for agentic keys
  claude.ts                Claude SDK wrapper (parse + reasons)
  embeddings.ts            OpenAI embeddings wrapper
  pinecone.ts              Pinecone ANN wrapper
  search.ts                Mock fallback search
  search-agentic.ts        Orchestrator with fallback

data/
  hotels.ts                12 seed hotels

scripts/
  seed-pinecone.ts         One-shot seed for Pinecone index
```

---

## Design system

- **Fonts**: Fraunces (display) + Inter Tight (body) + JetBrains Mono (tabular)
- **Palette**: Paper #F7F3EC / Ink #1A1613 / Terracotta #B8522D / Sage #6B7A5C
- **Layout**: Editorial, asymmetric, generous whitespace
- **Motion**: One orchestrated page-load stagger. Subtle hover states.

---

## What's coming in Part 3

| Feature | Part 1 | Part 2 | Part 3 |
|---|---|---|---|
| Search parser | Rule-based | Claude API (done) | Same |
| Vibe matching | Token overlap | Pinecone ANN (done) | Same |
| Hotel data | data/hotels.ts | data/hotels.ts | Supabase Postgres |
| Hotel onboarding | None | None | Self-serve + Stripe subscription |
| Bookings | Disabled | Disabled | Stripe PaymentIntents |
| Price Drop Protection | Explained only | Explained only | pg_cron + Stripe credits |

Part 3 only makes sense once real hotels want to list. Focus after Part 2 should be **hotel outreach**, not more code.
