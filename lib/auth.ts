import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

// NextAuth v4 config returned from a factory function.
//
// WHY A FACTORY: reading process.env at module load in Next.js 14 App
// Router can get cached between builds. A factory called on each request
// reads fresh env each time. Cold starts re-evaluate, hot requests reuse.

export function getAuthOptions(): NextAuthOptions {
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || ''

  if (!secret) {
    console.error(
      '[auth] NEXTAUTH_SECRET is not set. NextAuth will refuse to run. ' +
        'Set NEXTAUTH_SECRET in Vercel Environment Variables (Production tick required) and redeploy.'
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

// Back-compat export so existing imports of `authOptions` keep working.
// Evaluated lazily via a Proxy that re-runs the factory on first property
// access, so we still get runtime env resolution.
export const authOptions: NextAuthOptions = new Proxy({} as NextAuthOptions, {
  get(_target, prop, _receiver) {
    const opts = getAuthOptions()
    // @ts-expect-error dynamic access
    return opts[prop]
  },
})
