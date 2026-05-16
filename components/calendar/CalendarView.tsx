'use client'

import { useState } from 'react'
import TournamentRow from './TournamentRow'
import type { Tournament } from '@/lib/types'

interface YearData {
  year: number
  tournaments: Tournament[]
  total: number
}

interface CalendarViewProps {
  years: YearData[]
  currentYear: number
}

function groupByMonth(tournaments: Tournament[]) {
  const months = [...new Set(tournaments.map(t => t.month))]
  return months.map(month => ({
    month,
    tournaments: tournaments.filter(t => t.month === month),
  }))
}

export default function CalendarView({ years, currentYear }: CalendarViewProps) {
  const [activeYear, setActiveYear] = useState(years[0]?.year ?? currentYear)
  const [showCompleted, setShowCompleted] = useState(false)

  const currentYearData = years.find(y => y.year === activeYear)
  const allTournaments = currentYearData?.tournaments ?? []
  const tournaments =
    activeYear === currentYear && !showCompleted
      ? allTournaments.filter(t => t.status !== 'past')
      : allTournaments

  const monthGroups = groupByMonth(tournaments)

  return (
    <>
      {/* Hero */}
      <div className="bg-green px-9 pt-[60px] pb-[52px] overflow-hidden relative cal-hero-watermark">
        <div className="text-[9.5px] tracking-[4px] uppercase text-matcha mb-3">
          Philippine Islands Padel Tour
        </div>
        <h1 className="font-display text-[68px] font-semibold text-oat leading-[.9] tracking-[-1px] mb-[18px]">
          Tournament<br />
          <em className="text-oat/50">Calendar</em>
        </h1>
        <p className="text-xs text-oat/45 leading-[1.7] max-w-[460px]">
          Official national tournaments counting toward Padel Pilipinas rankings.
          All dates subject to confirmation.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-[2px] px-3.5 py-1.5 mt-5 text-[10px] tracking-[2px] uppercase text-oat/60">
          <span className="w-1.5 h-1.5 rounded-full bg-matcha shrink-0" />
          Season 2025 – 2026
        </div>
      </div>

      {/* Year Tabs */}
      <div className="bg-white border-b border-line px-9 flex sticky top-[62px] z-[200]">
        {years.map(({ year, total }) => {
          const isActive = activeYear === year
          return (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`px-6 h-[50px] flex items-center gap-2 text-[11px] font-semibold tracking-[2px] uppercase cursor-pointer border-b-2 -mb-px transition-all select-none font-body
                ${isActive
                  ? 'text-green border-green'
                  : 'text-mid border-transparent hover:text-green'
                }`}
            >
              {year}
              <span className={`text-[9px] px-[7px] py-0.5 rounded-[20px] font-semibold tracking-[0]
                ${isActive ? 'bg-green text-oat' : 'bg-oat text-mid'}`}>
                {total} events
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="max-w-content mx-auto px-9 py-12 pb-[72px]">
        {activeYear === currentYear && (
          <label className="flex items-center gap-2.5 mb-6 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={e => setShowCompleted(e.target.checked)}
              className="accent-green w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-mid tracking-[0.5px] cursor-pointer">
              Show completed tournaments
            </span>
          </label>
        )}

        {monthGroups.length === 0 ? (
          <p className="text-mid text-sm">No tournaments to display.</p>
        ) : (
          monthGroups.map(({ month, tournaments: ts }) => (
            <div key={month} className="mb-12">
              <div className="font-display text-[52px] font-semibold text-green leading-none mb-5 pb-3 border-b-2 border-line">
                {month}
              </div>
              <div className="flex flex-col gap-3">
                {ts.map(t => (
                  <TournamentRow key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
