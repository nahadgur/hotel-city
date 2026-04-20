'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react'

// Custom date range picker, editorial styling, zero dependencies.
//
// Behaviour:
// - Single popover, two months visible side by side on desktop, one on mobile
// - First click sets check-in. Second click sets check-out.
// - If second click is before check-in, swap them (so you can also drag backwards)
// - Third click resets and starts again
// - Click outside to close
// - Keyboard: Escape closes
// - Past dates and dates more than 18 months out are disabled
// - ISO date strings (YYYY-MM-DD) on input/output

type Props = {
  checkIn: string
  checkOut: string
  onChange: (range: { checkIn: string; checkOut: string }) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function toISO(d: Date): string {
  // Local date to YYYY-MM-DD, avoiding timezone shifts from toISOString()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromISO(s: string): Date | null {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function isBetween(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime()
  return t > start.getTime() && t < end.getTime()
}

function formatPretty(iso: string): string {
  const d = fromISO(iso)
  if (!d) return ''
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()]
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()]
  return `${dow} ${d.getDate()} ${mon}`
}

function nightsBetween(a: string, b: string): number {
  const da = fromISO(a)
  const db = fromISO(b)
  if (!da || !db) return 0
  return Math.round((db.getTime() - da.getTime()) / 86400000)
}

export function DateRangePicker({ checkIn, checkOut, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  // Which month's first column is visible (always set to 1st of month)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const ci = fromISO(checkIn)
    const start = ci || today
    return new Date(start.getFullYear(), start.getMonth(), 1)
  })

  const rootRef = useRef<HTMLDivElement>(null)

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 18)
  maxDate.setHours(23, 59, 59, 999)

  const ci = fromISO(checkIn)
  const co = fromISO(checkOut)

  function handleDayClick(d: Date) {
    // Disallow past and > 18 months out
    if (d < today || d > maxDate) return

    if (!ci || (ci && co)) {
      // Start a new range
      onChange({ checkIn: toISO(d), checkOut: '' })
      return
    }

    if (ci && !co) {
      if (sameDay(d, ci)) {
        // Clicking the same day clears
        onChange({ checkIn: '', checkOut: '' })
        return
      }
      if (d < ci) {
        // User clicked earlier than check-in: swap
        onChange({ checkIn: toISO(d), checkOut: toISO(ci) })
      } else {
        onChange({ checkIn: toISO(ci), checkOut: toISO(d) })
      }
      setHoverDate(null)
      // Close shortly after selection complete for a crisp feel
      setTimeout(() => setOpen(false), 120)
    }
  }

  function clear() {
    onChange({ checkIn: '', checkOut: '' })
    setHoverDate(null)
  }

  function prev() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
  }

  function next() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
  }

  const nights = nightsBetween(checkIn, checkOut)

  return (
    <div ref={rootRef} className="relative">
      <label className="eyebrow mb-2 block">
        Dates <span className="text-ink-400 normal-case tracking-normal">(optional)</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full px-4 py-3 bg-paper-50 border text-left transition-colors ${open ? 'border-ink-900' : 'border-ink-900/15 hover:border-ink-900/40'}`}
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-ink-500 shrink-0" strokeWidth={1.5} />
          {checkIn || checkOut ? (
            <div className="flex items-center gap-2 flex-wrap text-base tabular">
              <span className={checkIn ? 'text-ink-900' : 'text-ink-400'}>
                {checkIn ? formatPretty(checkIn) : 'Check in'}
              </span>
              <span className="text-ink-300">&rarr;</span>
              <span className={checkOut ? 'text-ink-900' : 'text-ink-400'}>
                {checkOut ? formatPretty(checkOut) : 'Check out'}
              </span>
              {nights > 0 && (
                <span className="text-xs text-ink-500 italic ml-1">
                  ({nights} {nights === 1 ? 'night' : 'nights'})
                </span>
              )}
            </div>
          ) : (
            <span className="text-ink-400 text-base">Pick your dates</span>
          )}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 right-0 md:right-auto md:w-[640px] top-full mt-2 z-40 bg-paper-50 border border-ink-900/15 shadow-xl">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-ink-900/10">
            <div className="text-xs text-ink-500 italic">
              {!ci && 'Click a date to set check in'}
              {ci && !co && 'Click again to set check out'}
              {ci && co && `${nights} ${nights === 1 ? 'night' : 'nights'} selected`}
            </div>
            <div className="flex items-center gap-2">
              {(checkIn || checkOut) && (
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs text-ink-500 hover:text-ink-900 flex items-center gap-1 px-2 py-1"
                >
                  <X className="w-3 h-3" strokeWidth={1.5} />
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-ink-500 hover:text-ink-900 px-2 py-1"
                aria-label="Close calendar"
              >
                Done
              </button>
            </div>
          </div>

          {/* Month nav */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <button
              type="button"
              onClick={prev}
              className="p-1.5 hover:bg-ink-900/5 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-8">
              <div className="font-display text-lg">
                {MONTH_NAMES[viewMonth.getMonth()]} {viewMonth.getFullYear()}
              </div>
              <div className="hidden md:block font-display text-lg">
                {MONTH_NAMES[(viewMonth.getMonth() + 1) % 12]}{' '}
                {viewMonth.getMonth() === 11 ? viewMonth.getFullYear() + 1 : viewMonth.getFullYear()}
              </div>
            </div>
            <button
              type="button"
              onClick={next}
              className="p-1.5 hover:bg-ink-900/5 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Calendars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 md:px-6 pb-5">
            <MonthGrid
              monthDate={viewMonth}
              today={today}
              maxDate={maxDate}
              checkIn={ci}
              checkOut={co}
              hoverDate={hoverDate}
              onDayClick={handleDayClick}
              onDayHover={setHoverDate}
            />
            <div className="hidden md:block">
              <MonthGrid
                monthDate={new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1)}
                today={today}
                maxDate={maxDate}
                checkIn={ci}
                checkOut={co}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onDayHover={setHoverDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MonthGrid({
  monthDate,
  today,
  maxDate,
  checkIn,
  checkOut,
  hoverDate,
  onDayClick,
  onDayHover,
}: {
  monthDate: Date
  today: Date
  maxDate: Date
  checkIn: Date | null
  checkOut: Date | null
  hoverDate: Date | null
  onDayClick: (d: Date) => void
  onDayHover: (d: Date | null) => void
}) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()

  // First day of month, shifted so week starts Monday (0 = Mon, 6 = Sun)
  const firstDay = new Date(year, month, 1)
  const firstDow = (firstDay.getDay() + 6) % 7 // shift so Mon = 0

  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<Date | null> = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  // Pad to complete weeks
  while (cells.length % 7 !== 0) cells.push(null)

  // For range highlighting: when user has picked check-in but not check-out,
  // use hoverDate to preview the range.
  const rangeEnd = checkOut || (checkIn && hoverDate && hoverDate > checkIn ? hoverDate : null)

  return (
    <div>
      <div className="grid grid-cols-7 gap-0 mb-2">
        {DOW_SHORT.map((d) => (
          <div key={d} className="text-[10px] text-ink-500 uppercase tracking-wider text-center py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />

          const disabled = d < today || d > maxDate
          const isCheckIn = checkIn && sameDay(d, checkIn)
          const isCheckOut = checkOut && sameDay(d, checkOut)
          const inRange = checkIn && rangeEnd && isBetween(d, checkIn, rangeEnd)
          const isToday = sameDay(d, today)
          const isSelected = isCheckIn || isCheckOut

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onDayClick(d)}
              onMouseEnter={() => onDayHover(d)}
              onMouseLeave={() => onDayHover(null)}
              className={[
                'relative h-10 text-sm tabular transition-colors',
                disabled ? 'text-ink-300 cursor-not-allowed' : 'cursor-pointer',
                isSelected
                  ? 'bg-ink-900 text-paper-50 font-medium'
                  : inRange
                  ? 'bg-terracotta-500/15 text-ink-900'
                  : !disabled
                  ? 'hover:bg-ink-900/5 text-ink-800'
                  : '',
                isToday && !isSelected ? 'ring-1 ring-inset ring-ink-900/20' : '',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
