import { NextRequest, NextResponse } from 'next/server'
import { postCustomerMessage } from '@/lib/listing'
import { getSessionUser } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  let body: { routingId?: string; bodyText?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const routingId = (body.routingId || '').trim()
  const bodyText = (body.bodyText || '').trim()

  if (!routingId) return NextResponse.json({ error: 'routingId required' }, { status: 400 })
  if (!bodyText || bodyText.length < 2) {
    return NextResponse.json({ error: 'Message is empty.' }, { status: 400 })
  }

  const result = await postCustomerMessage({
    routingId,
    userId: user.id,
    bodyText,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 })
  }

  return NextResponse.json({ ok: true })
}
