import crypto from 'crypto'

// Simple HMAC-based signing.
// Used to create magic links like /brief/[id]?t=<token>
// so travellers can view their brief without a login.
//
// The token is just an HMAC of the brief ID. Stateless, revocation impossible,
// but since we also tie expiry to brief status (expired/booked), that's fine for MVP.

function getSecret(): string {
  const s = process.env.BRIEF_SIGNING_SECRET
  if (!s || s.length < 16) {
    throw new Error('BRIEF_SIGNING_SECRET must be set and at least 16 chars.')
  }
  return s
}

export function signBriefId(briefId: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(briefId)
    .digest('hex')
    .slice(0, 32)
}

export function verifyBriefToken(briefId: string, token: string): boolean {
  if (!token || token.length !== 32) return false
  const expected = signBriefId(briefId)
  // constant-time compare
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token))
  } catch {
    return false
  }
}

// Reply-to token — short, URL-safe, for hotel reply routing.
// Each routing row gets its own so we can look up which brief + hotel
// an inbound email belongs to.
export function generateReplyToken(): string {
  // 10 bytes of base32 = 16 url-safe chars
  return crypto.randomBytes(10).toString('base64url').slice(0, 16).toLowerCase()
}
