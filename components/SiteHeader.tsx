import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="container-edge pt-7 pb-5 flex items-baseline justify-between">
        <Link href="/" className="font-display text-2xl tracking-tight -ml-0.5">
          Stayward
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-700">
          <Link href="/brief/new/" className="link-underline">Start a brief</Link>
          <Link href="/search/" className="link-underline">Browse</Link>
          <Link href="/about/" className="link-underline">How it works</Link>
          <Link href="/for-hotels/" className="link-underline">For hotels</Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/brief/new/"
            className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-900 text-paper-50 text-xs"
          >
            Start a brief
          </Link>
          <Link href="/for-hotels/" className="hidden md:inline-block text-sm text-ink-700 link-underline">
            List your hotel
          </Link>
        </div>
      </div>
      <div className="hairline" />
    </header>
  )
}
