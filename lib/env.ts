export function hasPlanWebhook(): boolean {
  return Boolean(process.env.PLAN_WEBHOOK_URL)
}

export function getPlanWebhookUrl(): string {
  return process.env.PLAN_WEBHOOK_URL || ''
}

export function getPublicBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
