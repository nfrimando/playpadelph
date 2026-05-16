'use client'

import { useState } from 'react'
import Podium from './Podium'
import RankingsTable from './RankingsTable'
import type { Rankings, RankingCategory, RankingsMeta } from '@/lib/types'

const CATEGORIES: { key: RankingCategory; label: string }[] = [
  { key: 'mo', label: "Men's Open" },
  { key: 'ma', label: "Men's Amateur" },
  { key: 'wo', label: "Women's Open" },
  { key: 'wa', label: "Women's Amateur" },
]

interface RankingsViewProps {
  data: Rankings
  playerCount: number
  meta: RankingsMeta
}

export default function RankingsView({ data, playerCount, meta }: RankingsViewProps) {
  const [active, setActive] = useState<RankingCategory>('mo')

  return (
    <>
      {/* Hero */}
      <div className="bg-green px-9 pt-[60px] pb-[52px] overflow-hidden relative hero-watermark">
        <div className="text-[9.5px] tracking-[4px] uppercase text-matcha mb-3">
          Philippine Islands Padel Tour
        </div>
        <h1 className="font-display text-[68px] font-semibold text-oat leading-[.9] tracking-[-1px] mb-[18px]">
          Player<br />
          <em className="text-oat/50">Rankings</em>
        </h1>
        <p className="text-xs text-oat/45 leading-[1.7] max-w-[460px]">
          Cumulative points across all sanctioned tournaments. Points expire upon the
          next running of the same event or after 52 weeks.
        </p>
        <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-[2px] px-3.5 py-1.5 mt-5 text-[10px] tracking-[2px] uppercase text-oat/60">
          <span className="w-1.5 h-1.5 rounded-full bg-matcha shrink-0" />
          {meta.periodStart} – {meta.periodEnd}
        </div>
        <div className="flex gap-10 mt-9 pt-8 border-t border-oat/10">
          {[
            { value: String(meta.categoryCount), label: 'Categories' },
            { value: `${playerCount}+`,           label: 'Ranked Players' },
            { value: String(meta.tournamentCount), label: 'Tournaments' },
            { value: 'Rolling',     label: '52-Week Points' },
          ].map(({ value, label }) => (
            <div key={label}>
              <span className="font-display text-[38px] font-semibold text-oat block">{value}</span>
              <span className="text-[9px] tracking-[2.5px] uppercase text-oat/35 block mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b border-line px-9 flex sticky top-[62px] z-[200] overflow-x-auto">
        {CATEGORIES.map(({ key, label }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-[22px] h-[50px] flex items-center gap-[7px] text-[10px] font-semibold tracking-[1.5px] uppercase cursor-pointer border-b-2 -mb-px whitespace-nowrap transition-all select-none font-body
                ${isActive
                  ? 'text-green border-green'
                  : 'text-mid border-transparent hover:text-green'
                }`}
            >
              {label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-[20px] font-semibold tracking-[0]
                ${isActive ? 'bg-green text-oat' : 'bg-oat text-mid'}`}>
                {data[key].length}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="max-w-content mx-auto px-9 py-10 pb-[72px]">
        <Podium players={data[active]} />
        <RankingsTable category={active} players={data[active]} />
      </div>
    </>
  )
}
