import { Resend } from 'resend'
import { getOutboundFromAddress, getInboundDomain, getPublicBaseUrl } from './env'
import type { BriefRow, BriefRoutingRow } from './supabase'

let client: Resend | null = null
function getClient(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY not set')
    client = new Resend(key)
  }
  return client
}

// Build the reply-to address for a routing.
// If RESEND_INBOUND_DOMAIN is set, we use the full unique address.
// Without a domain, we encode the token in the subject and use a plain inbox.
export function buildReplyToAddress(token: string): string {
  const domain = getInboundDomain()
  if (domain) return `brief-${token}@${domain}`
  // Fallback: no domain yet. Use the outbound from-address so replies come
  // back to the Resend account; the token is in the subject for matching.
  return getOutboundFromAddress()
}

export function buildBriefSubject(briefCity: string | null, token: string): string {
  const cityPart = briefCity ? `${briefCity} ` : ''
  // The [ref: xxx] tag is what we match on if the domain fallback is in use.
  return `New ${cityPart}brief from Stayward [ref: ${token}]`
}

// Send the brief email to one hotel.
export async function sendBriefToHotel(params: {
  brief: BriefRow
  routing: BriefRoutingRow
  baseUrl?: string
}): Promise<{ messageId: string | null; error: string | null }> {
  const { brief, routing } = params
  const baseUrl = params.baseUrl || getPublicBaseUrl()
  const replyTo = buildReplyToAddress(routing.reply_to_token)
  const subject = buildBriefSubject(brief.city, routing.reply_to_token)

  const dates = brief.check_in && brief.check_out
    ? `${formatDate(brief.check_in)} to ${formatDate(brief.check_out)}`
    : 'Dates flexible'

  const budget = brief.max_price_gbp
    ? `Up to \u00a3${brief.max_price_gbp} per night`
    : 'Open on budget'

  const guests = brief.guests ? `${brief.guests} ${brief.guests === 1 ? 'guest' : 'guests'}` : '2 guests'

  const brandName = 'Stayward'
  const briefLink = `${baseUrl}/brief/${brief.id}/`

  const textBody = [
    `Hello ${routing.hotel_name},`,
    '',
    `A traveller has asked us to find a hotel matching their brief, and ${routing.hotel_name} is one of five we think fits. You're receiving this because your property matched what they described.`,
    '',
    `WHAT THEY WANT`,
    `"${brief.raw_query}"`,
    '',
    `WHEN`,
    dates,
    '',
    `WHO`,
    guests,
    '',
    `BUDGET`,
    budget,
    '',
    `HOW TO QUOTE`,
    `Just reply to this email with your best available rate and any notes on availability. The traveller's direct details won't be shared until they accept your quote.`,
    '',
    `Because ${brandName} routes quotes directly from hotel to traveller, you're free to offer any rate you'd quote for a direct booking, outside of any parity terms you have with OTAs.`,
    '',
    '---',
    `Matched because: ${(routing.match_reasons ?? []).slice(0, 3).join(', ') || 'vibe + location'}`,
    `Reference: ${routing.reply_to_token}`,
    `Reply to this email within 24 hours to be included in the traveller's shortlist.`,
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
  <p>A traveller has asked us to find a hotel matching their brief, and ${escapeHtml(routing.hotel_name)} is one of five we think fits.</p>

  <div style="background: white; border-left: 2px solid #B8522D; padding: 20px; margin: 24px 0;">
    <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; margin-bottom: 8px;">What they want</div>
    <div style="font-size: 17px; font-style: italic; line-height: 1.45;">&ldquo;${escapeHtml(brief.raw_query)}&rdquo;</div>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; width: 100px;">Dates</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(dates)}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Guests</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(guests)}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663;">Budget</td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(26,22,19,0.1);">${escapeHtml(budget)}</td>
    </tr>
  </table>

  <p><strong>How to quote:</strong> just reply to this email with your best available rate and any notes on availability. The traveller's direct details won't be shared until they accept your quote.</p>

  <p style="color: #6B6663; font-size: 14px;">Because Stayward routes quotes directly from hotel to traveller, you're free to offer any rate you'd quote for a direct booking, outside of any parity terms you have with OTAs.</p>

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(26,22,19,0.15); font-size: 12px; color: #6B6663;">
    <div><strong>Matched because:</strong> ${escapeHtml((routing.match_reasons ?? []).slice(0, 3).join(', ') || 'vibe + location')}</div>
    <div style="margin-top: 4px;">Reference: <code style="background: rgba(26,22,19,0.06); padding: 2px 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px;">${escapeHtml(routing.reply_to_token)}</code></div>
    <div style="margin-top: 8px; font-style: italic;">Reply within 24 hours to be included in the traveller's shortlist.</div>
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

// Notify the traveller that at least one quote has arrived.
export async function notifyTravellerOfQuote(params: {
  brief: BriefRow
  hotelName: string
  baseUrl?: string
}): Promise<void> {
  const { brief, hotelName } = params
  const baseUrl = params.baseUrl || getPublicBaseUrl()
  const { signBriefId } = await import('./signing')
  const token = signBriefId(brief.id)
  const link = `${baseUrl}/brief/${brief.id}/?t=${token}`

  const text = [
    `Hi ${brief.traveller_name.split(' ')[0] || 'there'},`,
    '',
    `${hotelName} just sent you a quote for your Stayward brief.`,
    '',
    `View it here: ${link}`,
    '',
    'More quotes may arrive over the next 24 hours. We\u2019ll email you each time.',
    '',
    'Stayward',
  ].join('\n')

  const html = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; color: #1A1613; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #F7F3EC;">
  <div style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6663; margin-bottom: 4px;">Stayward</div>
  <h1 style="font-size: 24px; margin: 0 0 16px 0; font-weight: 400;">A quote just arrived.</h1>
  <p>Hi ${escapeHtml(brief.traveller_name.split(' ')[0] || 'there')},</p>
  <p><strong>${escapeHtml(hotelName)}</strong> just sent you a quote for your brief.</p>
  <p style="margin: 32px 0;">
    <a href="${link}" style="display: inline-block; background: #1A1613; color: #F7F3EC; padding: 12px 24px; text-decoration: none; font-size: 14px;">View your quotes</a>
  </p>
  <p style="color: #6B6663; font-size: 14px;">More quotes may arrive over the next 24 hours. We&rsquo;ll email you each time.</p>
</body>
</html>`.trim()

  try {
    await getClient().emails.send({
      from: getOutboundFromAddress(),
      to: [brief.traveller_email],
      subject: `${hotelName} sent you a quote`,
      text,
      html,
    })
  } catch (err) {
    console.error('[notifyTravellerOfQuote] failed:', err)
  }
}

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
