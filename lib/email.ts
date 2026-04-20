import { Resend } from 'resend'
import { getOutboundFromAddress, getInboundDomain, getPublicBaseUrl } from './env'
import type { ListingRow, ListingRoutingRow } from './listing'

let client: Resend | null = null
function getClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY not set')
    client = new Resend(key)
  }
  return client
}

// --- Reply-to address construction ---

// For initial brief: hotel replies land via `brief-{token}@...` (hotel initiated)
export function buildBriefReplyToAddress(token: string): string {
  const domain = getInboundDomain()
  if (domain) return `brief-${token}@${domain}`
  return getOutboundFromAddress()
}

// For ongoing thread: hotel replies to customer messages land via `thread-{token}@...`
export function buildThreadReplyToAddress(token: string): string {
  const domain = getInboundDomain()
  if (domain) return `thread-${token}@${domain}`
  return getOutboundFromAddress()
}

export function buildBriefSubject(city: string | null, token: string): string {
  const cityPart = city ? `${city} ` : ''
  return `New ${cityPart}brief from Stayward [ref: ${token}]`
}

export function buildThreadSubject(listingTitle: string, token: string): string {
  return `Re: ${listingTitle} [thread: ${token}]`
}

// ======================================================
// 1. Initial brief → hotel (Stayward-generated)
// ======================================================

export async function sendBriefToHotel(params: {
  listing: ListingRow
  routing: ListingRoutingRow
  baseUrl?: string
}): Promise<{ messageId: string | null; error: string | null }> {
  const { listing, routing } = params
  const baseUrl = params.baseUrl || getPublicBaseUrl()
  const replyTo = buildBriefReplyToAddress(routing.reply_to_token)
  const subject = buildBriefSubject(listing.city, routing.reply_to_token)

  const dates =
    listing.check_in && listing.check_out
      ? `${formatDate(listing.check_in)} to ${formatDate(listing.check_out)}`
      : 'Dates flexible'

  const budget = listing.max_price_gbp
    ? `Up to \u00a3${listing.max_price_gbp} per night`
    : 'Open on budget'

  const guests = listing.guests
    ? `${listing.guests} ${listing.guests === 1 ? 'guest' : 'guests'}`
    : '2 guests'

  const rooms = listing.rooms && listing.rooms > 1 ? `${listing.rooms} rooms` : null

  const textBody = [
    `Hello ${routing.hotel_name},`,
    '',
    `A traveller using Stayward has described what they're after and asked for quotes from five hotels that fit. ${routing.hotel_name} is one of them.`,
    '',
    `WHAT THEY WANT`,
    `"${listing.raw_query}"`,
    '',
    `WHEN: ${dates}`,
    `GUESTS: ${guests}${rooms ? ` \u00b7 ${rooms}` : ''}`,
    `BUDGET: ${budget}`,
    '',
    `HOW TO QUOTE`,
    `Reply to this email with your best available rate. The traveller's email is kept private \u2014 your reply goes through Stayward to them.`,
    '',
    `Because this is a direct quote to a specific traveller (not a public rate), you're free to offer a rate outside of any OTA parity terms.`,
    '',
    '---',
    `Matched because: ${(routing.match_reasons ?? []).slice(0, 3).join(', ') || 'city + vibe fit'}`,
    `Reference: ${routing.reply_to_token}`,
  ].join('\n')

  const htmlBody = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #1A1613; max-width: 560px; margin: 0 auto; padding: 32px 24px; line-height: 1.55; background: #F7F3EC;">
  <div style="padding-bottom: 16px; border-bottom: 1px solid rgba(26,22,19,0.15); margin-bottom: 24px;">
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Stayward</div>
    <div style="font-size: 20px; margin-top: 4px;">New quote request</div>
  </div>

  <p>Hello ${escapeHtml(routing.hotel_name)},</p>
  <p>A traveller has asked us for quotes from five hotels that fit their brief. ${escapeHtml(routing.hotel_name)} is one of them.</p>

  <div style="background: white; border-left: 2px solid #B8522D; padding: 20px; margin: 24px 0;">
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; margin-bottom: 8px;">What they want</div>
    <div style="font-size: 17px; font-style: italic; line-height: 1.45;">&ldquo;${escapeHtml(listing.raw_query)}&rdquo;</div>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; width: 100px;">Dates</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(dates)}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Guests</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(guests)}${rooms ? ' &middot; ' + escapeHtml(rooms) : ''}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Budget</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(budget)}</td>
    </tr>
  </table>

  <p><strong>How to quote:</strong> reply to this email with your best rate. The traveller stays anonymous \u2014 your reply is routed to them through Stayward.</p>

  <p style="color: #6B6663; font-size: 14px;">Because this is a direct quote, you're free to offer any rate outside of OTA parity terms.</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(26,22,19,0.15); font-size: 12px; color: #6B6663;">
    <div><strong>Matched because:</strong> ${escapeHtml((routing.match_reasons ?? []).slice(0, 3).join(', ') || 'city + vibe fit')}</div>
    <div style="margin-top: 4px;">Reference: <code style="background: rgba(26,22,19,0.06); padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(routing.reply_to_token)}</code></div>
  </div>
</body>
</html>`.trim()

  try {
    const result = await getClient().emails.send({
      from: getOutboundFromAddress(),
      to: [routing.hotel_contact_email],
      replyTo: replyTo,
      subject,
      text: textBody,
      html: htmlBody,
    })

    if ('error' in result && result.error) {
      return { messageId: null, error: String(result.error.message || result.error) }
    }
    const id = (result as any)?.data?.id || (result as any)?.id || null
    return { messageId: id, error: null }
  } catch (err) {
    return { messageId: null, error: err instanceof Error ? err.message : String(err) }
  }
}

// ======================================================
// 2. Customer → hotel (ongoing thread message)
// ======================================================

export async function sendCustomerMessageToHotel(params: {
  hotelEmail: string
  hotelName: string
  customerName: string
  threadToken: string
  listingTitle: string
  bodyText: string
}): Promise<{ messageId: string | null; error: string | null }> {
  const replyTo = buildThreadReplyToAddress(params.threadToken)
  const subject = buildThreadSubject(params.listingTitle, params.threadToken)

  const textBody = [
    `Hello ${params.hotelName},`,
    '',
    `${params.customerName} has sent a reply regarding your quote:`,
    '',
    params.bodyText,
    '',
    '---',
    `Reply to this email to respond to ${params.customerName} directly.`,
    `Their email is routed through Stayward.`,
    `Thread: ${params.threadToken}`,
  ].join('\n')

  const htmlBody = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #1A1613; max-width: 560px; margin: 0 auto; padding: 32px 24px; line-height: 1.55; background: #F7F3EC;">
  <div style="padding-bottom: 16px; border-bottom: 1px solid rgba(26,22,19,0.15); margin-bottom: 24px;">
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Stayward</div>
    <div style="font-size: 20px; margin-top: 4px;">Reply from ${escapeHtml(params.customerName)}</div>
  </div>

  <p>Hello ${escapeHtml(params.hotelName)},</p>
  <p>${escapeHtml(params.customerName)} has responded to your quote:</p>

  <div style="background: white; border-left: 2px solid #B8522D; padding: 20px; margin: 24px 0; white-space: pre-wrap;">${escapeHtml(params.bodyText)}</div>

  <p style="color: #6B6663; font-size: 14px;">Reply to this email to respond directly. ${escapeHtml(params.customerName)}'s email stays private \u2014 your reply is routed through Stayward.</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(26,22,19,0.15); font-size: 12px; color: #6B6663;">
    Thread: <code style="background: rgba(26,22,19,0.06); padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(params.threadToken)}</code>
  </div>
</body>
</html>`.trim()

  try {
    const result = await getClient().emails.send({
      from: getOutboundFromAddress(),
      to: [params.hotelEmail],
      replyTo,
      subject,
      text: textBody,
      html: htmlBody,
    })
    if ('error' in result && result.error) {
      return { messageId: null, error: String(result.error.message || result.error) }
    }
    const id = (result as any)?.data?.id || (result as any)?.id || null
    return { messageId: id, error: null }
  } catch (err) {
    return { messageId: null, error: err instanceof Error ? err.message : String(err) }
  }
}

// ======================================================
// 3. Notify customer when a hotel replies
// ======================================================

export async function notifyCustomerOfReply(params: {
  customerEmail: string
  customerName: string
  hotelName: string
  listingId: string
  baseUrl?: string
}): Promise<void> {
  const baseUrl = params.baseUrl || getPublicBaseUrl()
  const link = `${baseUrl}/dashboard/listings/${params.listingId}/`
  const firstName = params.customerName.split(' ')[0] || 'there'

  const text = [
    `Hi ${firstName},`,
    '',
    `${params.hotelName} just replied to your Stayward listing.`,
    '',
    `View the message: ${link}`,
    '',
    'Stayward',
  ].join('\n')

  const html = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #1A1613; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F7F3EC;">
  <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; margin-bottom: 4px;">Stayward</div>
  <h1 style="font-size: 24px; margin: 0 0 16px 0; font-weight: 400;">A reply just arrived.</h1>
  <p>Hi ${escapeHtml(firstName)},</p>
  <p><strong>${escapeHtml(params.hotelName)}</strong> just replied to your listing.</p>
  <p style="margin: 32px 0;">
    <a href="${link}" style="display: inline-block; background: #1A1613; color: #F7F3EC; padding: 12px 24px; text-decoration: none; font-size: 14px;">View the message</a>
  </p>
</body>
</html>`.trim()

  try {
    await getClient().emails.send({
      from: getOutboundFromAddress(),
      to: [params.customerEmail],
      subject: `${params.hotelName} replied to your listing`,
      text,
      html,
    })
  } catch (err) {
    console.error('[notifyCustomerOfReply] failed:', err)
  }
}

// --- Helpers ---

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
