'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="container-edge pt-7 pb-5 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight -ml-0.5" onClick={() => setMobileOpen(false)}>
          Stayward
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-700">
          <Link href="/plan/" className="link-underline">Plan a stay</Link>
          <Link href="/about/" className="link-underline">How it works</Link>
          <Link href="/for-hotels/" className="link-underline">For hotels</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/plan/"
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-900 text-paper-50 text-xs"
          >
            Plan a stay
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-1.5 text-ink-700"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-ink-900/10 bg-paper-50">
          <nav className="container-edge py-4 flex flex-col gap-1">
            <Link href="/plan/" onClick={() => setMobileOpen(false)} className="py-3 text-ink-900">Plan a stay</Link>
            <Link href="/about/" onClick={() => setMobileOpen(false)} className="py-3 text-ink-900">How it works</Link>
            <Link href="/for-hotels/" onClick={() => setMobileOpen(false)} className="py-3 text-ink-900">For hotels</Link>
          </nav>
        </div>
      )}

      <div className="hairline" />
    </header>
  )
}
