import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

// NextAuth v4 config — we use JWT sessions (no DB session storage needed)
// but still use the Supabase adapter for users/accounts tables.
//
// JWT sessions mean the dashboard can read `session.user.id` on the server
// without a DB round-trip per request.

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],

  // Use the Supabase adapter when available, else fall back to JWT-only
  // (lets the app build and run for SEO pages even without auth env vars).
  ...(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? {
        adapter: SupabaseAdapter({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
        }),
      }
    : {}),

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      // On sign in, persist the user id onto the JWT
      if (user) token.userId = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        // @ts-expect-error - extending session.user type at runtime
        session.user.id = token.userId
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
