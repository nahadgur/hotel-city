# Stayward

A human-run concierge for direct hotel quotes. Travellers describe the stay they want, a small team in London reads every brief and emails back quotes within 24 hours. Not a search engine, not a booking site, not a marketplace.

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind v3
- **Google Sheets + Apps Script** — where every brief lands for the team to action
- **Supabase** — stores listings for logged-in users so they can see history at `/dashboard/`
- **NextAuth + Google OAuth** — optional sign-in for traveller dashboard
- **Vercel** — deployment

No Resend, no OpenAI, no Pinecone, no Anthropic SDK in this build. The team replies to travellers by email manually.

## Routes

- `/` homepage
- `/plan/` submission form (no login required)
- `/plan/received/` confirmation page with brief echo
- `/about/` how it works
- `/for-hotels/` partner pitch
- `/login/` Google sign-in (optional)
- `/dashboard/` signed-in user's brief history
- `/dashboard/listings/[id]/` individual brief with current status

## Setup

### 1. Google Sheet + Apps Script webhook (required)

1. Create a new Google Sheet.
2. Extensions -> Apps Script.
3. Delete default code, paste `scripts/stayward-webhook.gs`.
4. Update `NOTIFY_EMAIL` at the top of the script to your real email.
5. Deploy -> New deployment -> Web app -> Execute as Me, Access for Anyone -> Deploy, authorise.
6. Copy the Web app URL.

### 2. Supabase (required for logged-in users)

1. Create a project at supabase.com.
2. SQL Editor -> run `supabase/schema.sql` then `supabase/migration_part4a.sql`.
3. Run the additional grant SQL (see "One-time DB setup" below) to enable the `next_auth` schema and permissions.
4. Project Settings -> API -> copy Project URL and service_role key.

### 3. Google OAuth (required for sign-in)

1. console.cloud.google.com -> new project.
2. OAuth consent screen -> External -> fill in name and contact.
3. Credentials -> Create OAuth client ID -> Web application.
4. Authorised origins: `http://localhost:3000` and your Vercel URL.
5. Authorised redirect URIs: `http://localhost:3000/api/auth/callback/google` and `https://YOUR-VERCEL-URL/api/auth/callback/google`.

### 4. Env vars

Copy `.env.example` to `.env.local`, fill in all values. Generate secrets with:

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

In Vercel, set the same values under Project -> Settings -> Environment Variables (tick Production, Preview, Development on each).

Then **redeploy** (Deployments -> latest -> Redeploy, untick Build Cache).

## One-time DB setup

After running the two SQL files in Supabase, run these grants to make NextAuth work:

```sql
-- Expose the next_auth schema to PostgREST (also do this via dashboard:
-- Project Settings -> Data API -> Exposed schemas -> add next_auth)

-- Create the next_auth schema tables NextAuth expects
CREATE SCHEMA IF NOT EXISTS next_auth;
GRANT USAGE ON SCHEMA next_auth TO service_role, authenticated, anon;

CREATE TABLE IF NOT EXISTS next_auth.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text,
  email text,
  "emailVerified" timestamp with time zone,
  image text,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL,
  "userId" uuid REFERENCES next_auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id),
  UNIQUE ("sessionToken")
);

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid REFERENCES next_auth.users(id) ON DELETE CASCADE,
  PRIMARY KEY (id),
  UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier text,
  token text NOT NULL,
  expires timestamp with time zone NOT NULL,
  PRIMARY KEY (token),
  UNIQUE (token, identifier)
);

GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA next_auth TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA next_auth GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Public tables written via service_role only
ALTER TABLE public.listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_routings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.listings TO service_role;
GRANT ALL ON public.listing_routings TO service_role;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Point listings.user_id FK at next_auth.users (where NextAuth writes users)
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_user_id_fkey;
ALTER TABLE public.listings
  ADD CONSTRAINT listings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES next_auth.users(id) ON DELETE SET NULL;

NOTIFY pgrst, 'reload config';
```

## Listing statuses

Update the `status` column in Supabase Table Editor as you work through a brief:

| Status | Meaning | What the user sees |
|---|---|---|
| `received` | New brief, not yet worked | "We\'ve got your brief. Expect a reply within 24 hours." |
| `working` | Team is reaching out to hotels | "The team is reaching out to hotels that fit." |
| `quotes_sent` | You\'ve emailed them quotes | "Check your inbox. We\'ve emailed you the quotes." |
| `closed` | Archived | "This listing is archived." |

## Dev

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub. Vercel auto-deploys. Redeploy manually after any env var change (Deployments -> latest -> Redeploy, untick Build Cache).
