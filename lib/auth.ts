import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

// Singleton pattern: build once on first access (per serverless invocation),
// reuse thereafter. Reads env on first access at request time, not at module
// load, so Vercel env changes picked up on next cold start.

let _cached: NextAuthOptions | null = null

function buildAuthOptions(): NextAuthOptions {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || ''

  if (!secret) {
    console.error(
      '[auth] NEXTAUTH_SECRET is missing at runtime. Set it in Vercel env (Production tick) and redeploy.'
    )
  }

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),
    ],

    ...(hasSupabase
      ? {
          adapter: SupabaseAdapter({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
            secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          }),
        }
      : {}),

    session: {
      strategy: 'jwt',
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) token.userId = user.id
        return token
      },
      async session({ session, token }) {
        if (session.user && token.userId) {
          // @ts-expect-error extending session.user.id
          session.user.id = token.userId
        }
        return session
      },
    },

    pages: {
      signIn: '/login',
      error: '/login',
    },

    secret,

    useSecureCookies: process.env.NODE_ENV === 'production',
  }
}

export function getAuthOptions(): NextAuthOptions {
  if (!_cached) _cached = buildAuthOptions()
  return _cached
}

// Plain object export for NextAuth() handler registration.
// Evaluated at module load on first request, but since the route handler
// is already per-request, this is equivalent to request-time evaluation.
export const authOptions: NextAuthOptions = getAuthOptions()
