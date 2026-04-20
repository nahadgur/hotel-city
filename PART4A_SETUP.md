# Stayward Part 4a — Auth + Dashboard Setup

Part 4a adds Google sign-in, a user dashboard, and bidirectional email threads between customers and hotels. The customer creates a listing, hotels reply by email, customer replies from the dashboard, and the whole conversation lives as a thread.

This guide assumes Parts 1–3 are already deployed. If not, do those first — `PART3_SETUP.md` covers Supabase and Resend.

---

## Before unzipping — files to delete from your Part 3 project

Part 4a replaces some Part 3 files with new locations. After unzipping the 4a delta over your project, **delete these stale files** manually (or they'll compile against the new vocabulary and break):

```
lib/brief.ts                       ← replaced by lib/listing.ts
app/brief/                         ← whole folder, replaced by app/dashboard/
app/api/brief/                     ← whole folder, replaced by app/api/listings/
```

On Windows CMD:
```cmd
rmdir /s /q lib\brief.ts  REM if somehow created as dir
del lib\brief.ts
rmdir /s /q app\brief
rmdir /s /q app\api\brief
```

Or just delete through your file explorer / GitHub UI before pushing.

---

## What's new in 4a

- **Google sign-in required** before creating a listing
- **`/dashboard/`** — list of the user's listings
- **`/dashboard/new/`** — create a listing (the old `/brief/new/` flow, behind auth)
- **`/dashboard/listings/[id]/`** — listing detail with one thread per matched hotel
- **Thread UI** — customer can reply to hotels without leaving the site; hotels still just reply to emails
- **Schema migration** — `briefs` → `listings`, `quotes` → `messages` (thread-aware)

---

## 1. Run the schema migration

1. Go to your Supabase project → **SQL Editor → New Query**.
2. Paste the contents of `supabase/migration_part4a.sql` (in this zip).
3. **Run**.

What the migration does:
- Creates `users`, `accounts`, `sessions`, `verification_tokens` (NextAuth needs these)
- Renames `briefs` → `listings` and adds `user_id`, `title`, `rooms` columns
- Renames `brief_routings` → `listing_routings` and adds `thread_token`
- Creates `messages` table (replaces `quotes` with thread-aware structure)
- Migrates any existing Part 3 data over automatically
- Drops the old `quotes` table and helper view

The migration is idempotent — you can run it twice without breaking anything.

---

## 2. Set up Google OAuth

This is the longest step. Takes about 8 minutes the first time.

### 2.1 Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Top-left project dropdown → **New Project**. Name it "Stayward" or similar. Create.
3. Make sure that project is selected in the top-left.

### 2.2 Configure the OAuth consent screen

1. Left sidebar → **APIs & Services → OAuth consent screen**.
2. User Type: **External**. Create.
3. App information:
   - App name: `Stayward`
   - User support email: your email
   - App logo: skip for now
4. App domain:
   - Application home page: `https://your-vercel-url.vercel.app` (or your real domain once bought)
   - Privacy policy / Terms: leave blank during development (required before going public)
5. Authorised domains: add `vercel.app` (or your real domain's apex)
6. Developer contact: your email. Save and continue.
7. **Scopes**: add `userinfo.email` and `userinfo.profile` and `openid`. Save.
8. **Test users**: add your own Gmail and `jerwinmanongsong2@gmail.com`. Save.
9. Back to dashboard.

### 2.3 Create OAuth credentials

1. Left sidebar → **APIs & Services → Credentials**.
2. **+ Create Credentials → OAuth client ID**.
3. Application type: **Web application**. Name: `Stayward Web`.
4. **Authorised JavaScript origins** — add:
   - `https://your-vercel-url.vercel.app`
   - `http://localhost:3000` (if you want local dev to work)
5. **Authorised redirect URIs** — add:
   - `https://your-vercel-url.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
6. **Create**. A modal pops up with **Client ID** and **Client Secret**. Copy both now — you can retrieve them later too.

These become `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## 3. Environment variables

Add these four to Vercel → Settings → Environment Variables (alongside the ones from Parts 1–3):

```
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXTAUTH_SECRET=<random 32-char string>
NEXTAUTH_URL=https://your-vercel-url.vercel.app
```

Your full env var list at this point should be:

```
# Agentic search (Part 2)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=stayward-vibes

# Brief pipeline (Part 3)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
BRIEF_SIGNING_SECRET=<32 random chars>

# Auth (Part 4a — new)
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
NEXTAUTH_SECRET=<32 random chars, different from BRIEF_SIGNING_SECRET>
NEXTAUTH_URL=https://your-vercel-url.vercel.app

# Optional (when you have a domain)
# RESEND_INBOUND_DOMAIN=reply.stayward.com
# RESEND_FROM_ADDRESS=Stayward <hotels@stayward.com>
# NEXT_PUBLIC_SITE_URL=https://stayward.com
```

### Generating NEXTAUTH_SECRET

On Windows:
```cmd
powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])"
```

Or on any machine with openssl:
```bash
openssl rand -base64 32
```

**Redeploy** after adding the vars.

---

## 4. Important: NEXTAUTH_URL must match your deployment

NextAuth uses `NEXTAUTH_URL` to construct the OAuth callback. If this doesn't match what you put in Google Cloud Console's "Authorised redirect URIs", sign-in will fail with a redirect URI mismatch error.

If you deploy to a new Vercel URL (e.g. you buy a custom domain and switch), you must:
1. Update `NEXTAUTH_URL` in Vercel
2. Add the new callback URL to Google Cloud Console
3. Redeploy

---

## 5. Test the flow

1. Visit your deployed site → `/` should show the homepage.
2. Click "Start a listing" → redirected to `/login/`.
3. Click "Continue with Google" → Google consent screen (first time only) → redirected back to `/dashboard/`.
4. Click "New listing" → `/dashboard/new/`.
5. Fill in the form, submit → redirected to `/dashboard/listings/[id]/` showing the 5 routed hotels.
6. Check `jerwinmanongsong2@gmail.com` — you should receive 5 emails.
7. Reply to one of them from Gmail (simulating the hotel) with a rate like "Happy to offer £280/night for those dates."
8. Visit `/api/inbound` as a POST with the reply (see Part 3 setup for the curl command and how to find the token).
9. Refresh `/dashboard/listings/[id]/` — the reply should appear in the thread with the parsed £280 price.
10. Click "Open thread" → type a reply like "Can you confirm breakfast is included?" → Send.
11. Check `jerwinmanongsong2@gmail.com` again — you should get the customer's reply as an email from Stayward.

Once you have a real domain and inbound webhook set up, steps 7–8 become automatic and step 11 closes the loop without you needing to manually trigger anything.

---

## 6. What's still stubbed

- **Hotels never log in.** By design. They only reply to emails. No hotel dashboard in 4a.
- **No email verification.** We trust that a Google-authed email is valid.
- **No account deletion or data export UI.** Required for GDPR before real launch; trivial to add but out of scope here.
- **No rate limiting on listings.** One user could submit 100 listings in a row. Add Vercel rate limits or a DB check before going public.
- **No soft-delete.** Deleting a listing (not implemented) would cascade and lose thread history. Add archive status before launch.
- **Google is the only provider.** Adding email/magic link, Apple, or Microsoft is a two-line config change per provider.

---

## 7. The SEO side (Part 4b — next)

Part 4a built the product. Part 4b builds the traffic:

- `/hotels/` — all hotels index with city grouping
- `/[city]/` — one landing per city with curated write-up + hotel list
- `/[city]/hotels-with-[tag]/` — programmatic tag pages driven by the hidden-tag taxonomy
- Expanded sitemap
- Proper `Hotel` schema markup on the SEO pages

Come back with "do 4b" when ready.
