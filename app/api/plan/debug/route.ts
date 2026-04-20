import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const v = process.env.PLAN_WEBHOOK_URL
  return NextResponse.json({
    hasVar: typeof v === 'string' && v.length > 0,
    length: v ? v.length : 0,
    startsWith: v ? v.slice(0, 35) : null,
    endsWith: v ? v.slice(-10) : null,
    allPlanKeys: Object.keys(process.env).filter(k => k.toUpperCase().includes('PLAN')),
  })
}
