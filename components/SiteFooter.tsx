import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="mt-24">
      <div className="hairline" />
      <div className="container-edge py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-2 max-w-reading">
            <div className="font-display text-2xl mb-4">Stayward</div>
            <p className="text-sm text-ink-600 leading-relaxed">
              A different way to book a hotel. You describe the stay, five hotels quote you direct, no OTA in the middle. No public prices, no dark patterns, no surprise taxes.
            </p>
          </div>

          <div>
            <div className="eyebrow mb-4">Travellers</div>
            <ul className="space-y-2.5 text-sm text-ink-700">
              <li><Link href="/plan/" className="link-underline">Plan a stay</Link></li>
              <li><Link href="/about/" className="link-underline">How it works</Link></li>
              <li><Link href="/dashboard/" className="link-underline">My listings</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Hotels</div>
            <ul className="space-y-2.5 text-sm text-ink-700">
              <li><Link href="/for-hotels/" className="link-underline">Join the pilot</Link></li>
              <li><Link href="/for-hotels/#pricing" className="link-underline">Pricing</Link></li>
              <li><Link href="/for-hotels/#vs-ota" className="link-underline">vs Booking.com</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 hairline flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-ink-500">
          <div>&copy; {new Date().getFullYear()} Stayward. Built in London.</div>
          <div className="flex gap-6">
            <Link href="/terms/" className="link-underline">Terms</Link>
            <Link href="/privacy/" className="link-underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
