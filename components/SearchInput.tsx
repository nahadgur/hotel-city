'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, FormEvent } from 'react'
import { ArrowRight, Sparkles } from 'lucide-react'

const PLACEHOLDERS = [
  'a quiet room in Paris with a deep soaking tub and fast Wi-Fi for a 3-day work sprint',
  'somewhere on an island, off-grid, for a week with my partner',
  'a design-led loft in Copenhagen, under \u00A3300, with a canal view',
  'a silent place in Kyoto for our honeymoon, ideally with a private bath',
  'a hotel in Shoreditch where I can actually work, with a proper desk',
]

const SUGGESTIONS = [
  'Quiet Paris, deep tub, fast wifi',
  'Off-grid Scotland, just the two of us',
  'Design-led Copenhagen under \u00A3300',
  'Silent Kyoto, honeymoon',
]

export function SearchInput({ initialQuery = '', autoFocus = false }: { initialQuery?: string; autoFocus?: boolean }) {
  const router = useRouter()
  const [value, setValue] = useState(initialQuery)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)

  useEffect(() => {
    if (value.length > 0) return
    const t = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length)
    }, 4200)
    return () => clearInterval(t)
  }, [value])

  function submit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    router.push(`/search/?q=${encodeURIComponent(q)}`)
  }

  function useSuggestion(s: string) {
    setValue(s)
    router.push(`/search/?q=${encodeURIComponent(s)}`)
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="relative">
        <div className="relative border border-ink-900/15 bg-paper-50 transition-colors focus-within:border-ink-900">
          <div className="flex items-start gap-4 p-5 md:p-7">
            <Sparkles className="w-5 h-5 mt-1 text-terracotta-500 shrink-0" strokeWidth={1.5} />
            <textarea
              autoFocus={autoFocus}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={PLACEHOLDERS[placeholderIdx]}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  submit(e as unknown as FormEvent)
                }
              }}
              className="flex-1 bg-transparent resize-none outline-none font-display text-xl md:text-2xl leading-snug placeholder:text-ink-400 placeholder:font-display placeholder:italic"
            />
          </div>

          <div className="flex items-center justify-between px-5 md:px-7 pb-5">
            <div className="text-xs text-ink-500">
              <span className="hidden md:inline">Press Enter. Shift + Enter for a new line.</span>
              <span className="md:hidden">Tell us what you\u2019re after.</span>
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={!value.trim()}
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="text-xs text-ink-500 self-center mr-1">Try:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => useSuggestion(s)}
            className="text-xs px-3 py-1.5 border border-ink-900/15 text-ink-700 hover:border-ink-900 hover:bg-ink-900 hover:text-paper-50 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
