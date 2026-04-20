# Stayward Part 3 — Brief Routing Setup

The brief pipeline connects three services: Supabase (database), Resend (email), and your existing agentic search. This guide gets you from zip upload to working end-to-end in about 30 minutes.

---

## Quick summary of what you're deploying

Travellers submit a brief. Claude + Pinecone pick 5 matching hotels. Resend emails each hotel. Hotels reply. Resend forwards replies to our webhook. We store quotes and notify the traveller. The traveller picks one.

Four new env vars, three accounts to create, one DNS decision to make later.

---

## 1. Supabase setup (10 min)

1. Go to [supabase.com](https://supabase.com) → create a project. The free tier is fine.
2. Once provisioned, go to **Project Settings → API** and copy:
   - Project URL → this is `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key (under "Project API keys") → this is `SUPABASE_SERVICE_ROLE_KEY`

   Treat the service role key like a password — it bypasses RLS.

3. Go to **SQL Editor → New Query**.
4. Paste the contents of `supabase/schema.sql` (included in this zip).
5. Click **Run**. You should see "Success. No rows returned."
6. Optional: go to **Table Editor** and confirm you see `briefs`, `brief_routings`, `quotes`.

---

## 2. Resend setup (5 min, no domain required today)

1. Go to [resend.com](https://resend.com) → sign up.
2. **API Keys → Create API Key** — name it "Stayward production". Copy it — this is `RESEND_API_KEY`.
3. That's it for now. You can send emails immediately using Resend's shared sender (`onboarding@resend.dev`) — no DNS setup needed.

**Important quirk of Resend's test mode:** outbound emails from `onboarding@resend.dev` can **only be sent to the email address that owns the Resend account**. So during initial testing, you will want to either:
- Register the Resend account with `jerwinmanongsong2@gmail.com` (since that's where we're routing all 12 hotel emails), **or**
- Register with your main email but verify a sending domain later (see Section 5).

I recommend option A for the pilot — sign up to Resend using `jerwinmanongsong2@gmail.com`. It keeps the test emails flowing without needing DNS.

---

## 3. Environment variables (Vercel)

Go to your Vercel project → **Settings → Environment Variables** and add these six for Part 3 (alongside the four from Part 2):

```
# Part 2 — already set (agentic search)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=stayward-vibes

# Part 3 — new (brief pipeline)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
BRIEF_SIGNING_SECRET=<generate a random 32-char string>

# Optional (leave unset until you have a domain)
# RESEND_INBOUND_DOMAIN=reply.stayward.com
# RESEND_FROM_ADDRESS=Stayward <hotels@stayward.com>
# NEXT_PUBLIC_SITE_URL=https://stayward.com
```

### Generating BRIEF_SIGNING_SECRET

On Windows:
```cmd
powershell -Command "[Convert]::ToBase64String((1..24 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])"
```

Or just bash any 32+ random characters into the value — this is used to HMAC-sign brief URLs so travellers can't guess each other's inbox links.

**Redeploy after adding** — env var changes don't pick up on already-running deployments.

---

## 4. Configure the Resend inbound webhook

This is how hotel replies get captured into the quotes table.

**If you DON'T have a domain yet** (current state):

Skip this section for now. Without an inbound domain, replies will go to the address that sent the brief (whichever Resend account email is tied to `onboarding@resend.dev`) — you'll see them land in your Gmail. You can still test the whole user flow manually by simulating an inbound webhook (see Section 6).

**If you HAVE a domain** (future state — `stayward.com` say):

1. In Resend: **Domains → Add Domain → `reply.stayward.com`** (a subdomain dedicated to inbound).
2. Add the MX records Resend gives you to your DNS provider.
3. Wait for Resend to verify (usually 5-30 minutes).
4. **Webhooks → Add Webhook**:
   - URL: `https://your-vercel-url.vercel.app/api/inbound`
   - Events: **Inbound Email**
   - Save.
5. In Vercel env vars, set `RESEND_INBOUND_DOMAIN=reply.stayward.com` and redeploy.
6. From this point on, every hotel reply is automatically captured and the traveller is emailed.

---

## 5. Verify a sending domain (when you have one)

Still in Resend, under **Domains**:

1. Add `stayward.com` (the root domain you send from).
2. Add the SPF, DKIM, and DMARC records to your DNS.
3. Once verified, set `RESEND_FROM_ADDRESS=Stayward <hotels@stayward.com>` in Vercel.
4. Now emails come from your own domain, deliverability is much higher, and you can send to any address (not just your own inbox).

---

## 6. Test the whole flow end-to-end

### Option A — Real end-to-end test (needs a domain for inbound)

1. Go to `/brief/new/` on your deployed site.
2. Fill out a brief with your own email as the traveller.
3. Submit.
4. Check `jerwinmanongsong2@gmail.com` — you should receive 5 emails, one per matched hotel.
5. Reply to one of them with a rate (e.g. "We can offer you £320/night for those dates").
6. Within a few seconds, `/brief/[id]/` shows the quote, and the traveller inbox gets a notification email.

### Option B — Partial test without a domain (today)

Everything up to step 5 works. Replies from your Gmail won't automatically create quotes until you have the inbound domain + webhook set up.

To test quote capture manually:

```bash
curl -X POST https://your-site.vercel.app/api/inbound \
  -H "Content-Type: application/json" \
  -d '{
    "from": "reservations@somehotel.com",
    "to": "reply",
    "subject": "Re: New Paris brief from Stayward [ref: YOUR_TOKEN_HERE]",
    "text": "Hi, we can offer you £340 per night for those dates. Best rate we can do direct. Happy to confirm when you are ready.\n\nJohn\nReservations, The Hotel"
  }'
```

Replace `YOUR_TOKEN_HERE` with a real token from the `brief_routings` table. You can find one in Supabase → Table Editor → `brief_routings`, `reply_to_token` column.

After this POST, refresh `/brief/[id]/?t=...` and you'll see the quote appear.

---

## 7. Known limitations of this MVP

- **No hotel-facing UI.** Hotels reply by email only. No dashboard.
- **No auth.** Brief inbox links use a signed token. Anyone with the link gets access.
- **No calendar / availability.** Every hotel gets every matching brief regardless of known occupancy.
- **No quote parsing with Claude.** We just extract obvious GBP amounts via regex (`£350`). If the hotel writes "rate: three hundred fifty pounds" we miss it but still store the body.
- **No rate-limiting.** An attacker could spam briefs. Add Vercel rate limiting in settings if you go public.

---

## 8. What you'll learn from the pilot

The three questions this build is designed to answer:

1. **Do hotels actually reply?** Watch the ratio of emails sent → quotes received.
2. **Do their rates beat Booking.com meaningfully?** Compare `parsed_price_gbp` in the `quotes` table against the `priceFrom` in `data/hotels.ts` for the same hotel.
3. **Do travellers accept quotes?** You'll know when the traveller emails the hotel directly — ask hotels to tell you when it converts.

If the answer to 1 and 2 is yes, you have a business and Part 4 is about scaling: more hotels, a hotel dashboard, real domain, and eventually pricing.

If the answer to 1 or 2 is no, you have useful learning much faster than if you'd built the full product first.
