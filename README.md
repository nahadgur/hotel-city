# Stayward

A Next.js hotel quote-routing platform. Think HeadBox for hotel rooms.

Customers sign in with Google, create a listing describing what they want, and five matching hotels quote them directly by email — usually below the public rate, because direct quotes sit outside OTA parity clauses. Bidirectional email threads live in the customer dashboard.

---

## Deploy checklist

1. **Push this repo to GitHub** (nahadgur or vimldn).
2. **Import to Vercel.** Build will succeed with no env vars — the site runs in mock mode (no auth, no emails, no agentic matching).
3. **Set up the four services** — full walkthroughs in the `PART*_SETUP.md` files:
   - Anthropic + OpenAI + Pinecone → agentic search (`PART3_SETUP.md` covers all services including these two parts)
   - Supabase → database
   - Resend → email
   - Google Cloud Console → OAuth (`PART4A_SETUP.md`)
4. **Run both SQL migrations** in Supabase in order:
   - `supabase/schema.sql` (Part 3)
   - `supabase/migration_part4a.sql` (Part 4a — upgrades Part 3 schema to thread-aware)
5. **Set env vars** on Vercel (see `.env.example`).
6. **Redeploy.**
7. **Seed Pinecone** once locally with `npm run seed` after cloning and setting `.env.local`.

---

## What you get

**Public site (indexable):**
- `/` — homepage
- `/hotels/[slug]/` — 12 hotel detail pages (SSG)
- `/search/` — natural-language search (agentic when API keys present, mock otherwise)
- `/about/` — how it works
- `/for-hotels/` — B2B pitch

**Authenticated dashboard:**
- `/login/` — Google sign-in
- `/dashboard/` — user's listings
- `/dashboard/new/` — create a listing (auth required)
- `/dashboard/listings/[id]/` — per-hotel message threads with reply box

**Under the hood:**
- `POST /api/listings` — create a listing (auth)
- `GET /api/listings/[id]` — poll for updates (auth + owner)
- `POST /api/listings/[id]/messages` — customer sends a reply (auth + owner)
- `POST /api/inbound` — Resend webhook captures hotel replies
- `/api/auth/[...nextauth]` — NextAuth handler

---

## File map

```
app/
  layout.tsx, page.tsx, globals.css, not-found.tsx
  sitemap.ts, robots.ts
  search/page.tsx, search/loading.tsx
  hotels/[slug]/page.tsx                  SSG, 12 pages
  about/page.tsx                          How it works
  for-hotels/page.tsx                     B2B
  login/page.tsx + LoginClient.tsx        Google sign-in
  dashboard/page.tsx                      Listings list
  dashboard/new/page.tsx + ListingFormClient.tsx
  dashboard/listings/[id]/page.tsx + ListingDetailClient.tsx
  api/auth/[...nextauth]/route.ts
  api/listings/route.ts
  api/listings/[id]/route.ts
  api/listings/[id]/messages/route.ts
  api/inbound/route.ts

components/
  SiteHeader.tsx                Auth-aware nav with user dropdown
  SiteFooter.tsx
  SearchInput.tsx               Rotating placeholder input
  HotelCard.tsx                 Used on search results
  AuthProvider.tsx              NextAuth SessionProvider wrapper

lib/
  types.ts                      Hotel, Amenity, ParsedQuery, MatchResult
  env.ts                        hasAgenticKeys, hasBriefPipeline, hasAuth
  auth.ts                       NextAuth config (Google + Supabase adapter)
  session.ts                    getSessionUser, requireUser
  supabase.ts                   Server client with service role
  signing.ts                    HMAC tokens for magic links + reply routing
  claude.ts                     Query parser + match reasons
  embeddings.ts                 OpenAI text-embedding-3-small
  pinecone.ts                   ANN query + upsert
  search.ts                     Mock fallback search
  search-agentic.ts             Real search orchestrator with graceful fallback
  email.ts                      Resend: sendBriefToHotel, sendCustomerMessageToHotel, notifyCustomerOfReply
  listing.ts                    Listings orchestration: create, fetch, postMessage

data/
  hotels.ts                     12 seed hotels with hidden amenity metadata

supabase/
  schema.sql                    Part 3 base schema
  migration_part4a.sql          Part 4a upgrade (run after schema.sql)

scripts/
  seed-pinecone.ts              One-shot seed for Pinecone vibe index

Setup docs:
  PART3_SETUP.md                Supabase + Resend walkthrough
  PART4A_SETUP.md               Google OAuth + migration walkthrough
```

---

## Local development

```cmd
npm install
npm run dev
```

Visit http://localhost:3000.

For auth to work locally, you need to:
1. Add `http://localhost:3000/api/auth/callback/google` as an Authorised Redirect URI in Google Cloud Console.
2. Set `NEXTAUTH_URL=http://localhost:3000` in `.env.local`.

Without the env vars, the site still runs — just with mock search and no auth.

---

## Design system

- Fonts: Fraunces (display serif) + Inter Tight (body) + JetBrains Mono (tabular)
- Palette: Paper `#F7F3EC` / Ink `#1A1613` / Terracotta `#B8522D` / Sage `#6B7A5C`
- `trailingSlash: true` everywhere
- Editorial layout, generous whitespace, no urgency theatre

---

## What's next (Part 4b)

SEO programmatic pages:
- `/hotels/` — all hotels index
- `/[city]/` — city landing pages
- `/[city]/hotels-with-[tag]/` — hidden-tag programmatic pages

Not yet built. Ask for "Part 4b" when ready.
