import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { LoginClient } from './LoginClient'

export const metadata: Metadata = {
  title: 'Sign in',
  robots: { index: false, follow: false },
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  // If already signed in, skip the login UI and send them through
  // to wherever they were headed. Default to /dashboard.
  const user = await getSessionUser()
  if (user) {
    const nextRaw = searchParams?.next
    const next = typeof nextRaw === 'string' && nextRaw.startsWith('/') ? nextRaw : '/dashboard'
    redirect(next)
  }

  return (
    <section className="container-edge py-section">
      <div className="max-w-md mx-auto text-center pt-10">
        <div className="eyebrow eyebrow-rule mb-8 inline-block">Sign in</div>
        <h1 className="font-display text-display-md mb-4">
          One click. No passwords.
        </h1>
        <p className="text-ink-700 leading-relaxed mb-10">
          Sign in with Google to create a listing, see your quotes, and message hotels.
          We don't send marketing, ever.
        </p>

        <Suspense fallback={<div className="h-12 bg-paper-100 animate-pulse" />}>
          <LoginClient />
        </Suspense>

        <p className="mt-8 text-xs text-ink-500 italic">
          By signing in you agree to the Stayward terms. We store your name, email, and
          Google avatar. We never post anything to your account.
        </p>
      </div>
    </section>
  )
}
