import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container-edge py-section">
      <div className="max-w-reading">
        <div className="eyebrow eyebrow-rule mb-8">Not found</div>
        <h1 className="font-display text-display-lg mb-6">
          That page doesn't exist.
        </h1>
        <p className="font-display italic text-xl text-ink-700 mb-10">
          Or it did, and we retired it. Either way, you're here now.
        </p>
        <Link href="/" className="btn-primary">
          Start again
        </Link>
      </div>
    </section>
  )
}
