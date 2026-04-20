# Stayward

A human-run concierge for direct hotel quotes. Travellers describe the stay they want. A small team in London reads each brief and replies by email with quotes within 24 hours.

## What this is, and isn\'t

- Not a search engine
- Not a booking site
- Not a marketplace
- No automated outreach
- No accounts, no logins, no user dashboards
- Just a form + a Google Sheet + a team replying by email

## Stack

- **Next.js 14** App Router, TypeScript, Tailwind v3
- **Google Sheets + Apps Script** — every brief lands here for the team
- **Vercel** — deployment

That\'s the whole stack. No database, no auth, no email-sending service.

## Routes

- `/` homepage
- `/plan/` brief submission form
- `/plan/received/` confirmation page that echoes the brief
- `/about/` how it works
- `/for-hotels/` partner pitch

## Setup

### 1. Google Sheet + Apps Script

1. Create a new Google Sheet.
2. Extensions -> Apps Script.
3. Delete default code, paste `scripts/stayward-webhook.gs`.
4. Update `NOTIFY_EMAIL` at the top to your real email.
5. Deploy -> New deployment -> Web app.
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy, authorise when prompted.
6. Copy the Web app URL.

### 2. Vercel env var

Set `PLAN_WEBHOOK_URL` to the Web app URL from step 1.

Tick Production, Preview, Development. Save. Redeploy (untick Build Cache).

That\'s it. No Supabase, no Google OAuth, no NextAuth, no Resend. Just this one variable.

## Your workflow when a brief lands

1. Apps Script notification email hits your inbox.
2. You see the traveller\'s brief, email, dates, any details.
3. You reach out to hotels that fit, from your own email.
4. Hotels quote you back.
5. You forward or summarise the quotes to the traveller.
6. They pick one, you introduce them to the hotel directly.
7. Booking happens between traveller and hotel.

## Dev

```bash
npm install
npm run dev
```

## Deploy

Push to GitHub. Vercel auto-deploys.
