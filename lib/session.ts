import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'

export type SessionUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  // @ts-expect-error - id is added in auth callback
  if (!session.user.id) return null
  return {
    // @ts-expect-error - id is added in auth callback
    id: session.user.id as string,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  }
}

export async function requireUser(redirectTo = '/dashboard'): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(redirectTo)}`)
  }
  return user
}
