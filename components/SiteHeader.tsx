'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { User, LogOut, LayoutGrid } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="container-edge pt-7 pb-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight -ml-0.5">
          Stayward
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-700">
          <Link href="/dashboard/new/" className="link-underline">Start a listing</Link>
          <Link href="/search/" className="link-underline">Browse hotels</Link>
          <Link href="/about/" className="link-underline">How it works</Link>
          <Link href="/for-hotels/" className="link-underline">For hotels</Link>
        </nav>

        <div className="flex items-center gap-4">
          <AuthCorner />
        </div>
      </div>
      <div className="hairline" />
    </header>
  )
}

function AuthCorner() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  if (status === 'loading') {
    return <div className="w-8 h-8 bg-paper-100 animate-pulse rounded-full" />
  }

  if (!session?.user) {
    return (
      <>
        <Link href="/login/" className="hidden md:inline-block text-sm text-ink-700 link-underline">
          Sign in
        </Link>
        <Link
          href="/dashboard/new/"
          className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-900 text-paper-50 text-xs"
        >
          Start a listing
        </Link>
      </>
    )
  }

  const user = session.user
  const initials = (user.name || user.email || '?')
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="flex items-center gap-2 group"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || 'User'}
            width={32}
            height={32}
            className="rounded-full border border-ink-900/15 group-hover:border-ink-900 transition-colors"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-ink-900 text-paper-50 flex items-center justify-center text-xs font-medium">
            {initials}
          </div>
        )}
        <span className="hidden md:inline text-sm text-ink-700 group-hover:text-ink-900">
          {user.name?.split(' ')[0] || 'You'}
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-paper-50 border border-ink-900/15 shadow-lg z-30">
          <div className="p-3 border-b border-ink-900/10">
            <div className="text-sm font-medium truncate">{user.name}</div>
            <div className="text-xs text-ink-500 truncate">{user.email}</div>
          </div>
          <Link
            href="/dashboard/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-paper-100 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-paper-100 transition-colors w-full text-left border-t border-ink-900/10"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span>Sign out</span>
          </button>
        </div>
      )}
    </div>
  )
}
