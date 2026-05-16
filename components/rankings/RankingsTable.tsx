'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PlayerRanking, RankingCategory } from '@/lib/types'

const FLAGS: Record<string, string> = {
  PH: '🇵🇭', PHI: '🇵🇭', JPN: '🇯🇵', JP: '🇯🇵', FRA: '🇫🇷', ARG: '🇦🇷',
  AUS: '🇦🇺', SWE: '🇸🇪', ESP: '🇪🇸', DEN: '🇩🇰', IRI: '🇮🇷', RUS: '🇷🇺',
  US: '🇺🇸', USA: '🇺🇸', CHN: '🇨🇳', TH: '🇹🇭', THA: '🇹🇭', NL: '🇳🇱',
  ITA: '🇮🇹', GER: '🇩🇪', CAN: '🇨🇦', MEX: '🇲🇽', BRA: '🇧🇷', KOR: '🇰🇷',
  IND: '🇮🇳', IDN: '🇮🇩', VIE: '🇻🇳', MAS: '🇲🇾', SGP: '🇸🇬',
}

function getFlag(nat: string) {
  return FLAGS[nat?.toUpperCase()] ?? null
}

function getInitials(name: string) {
  return name
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

const CATEGORY_LABELS: Record<RankingCategory, string> = {
  mo: "Men's Open",
  ma: "Men's Amateur",
  wo: "Women's Open",
  wa: "Women's Amateur",
}

interface RankingsTableProps {
  category: RankingCategory
  players: PlayerRanking[]
}

export default function RankingsTable({ category, players }: RankingsTableProps) {
  const [query, setQuery] = useState('')

  const maxPoints = Math.max(...players.map(p => p.points))
  const filtered = query
    ? players.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : players

  return (
    <div className="bg-white rounded-[3px] border border-line overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-line">
        <span className="text-[9px] tracking-[3px] uppercase text-mid font-semibold">
          Full Rankings · {CATEGORY_LABELS[category]}
        </span>
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mid pointer-events-none"
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="pl-8 pr-3 py-2 border border-line rounded-[3px] font-body text-xs text-ink bg-oat outline-none w-[200px] transition-all focus:border-green focus:bg-white"
            placeholder="Search player…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line text-center w-[50px]">
              Rank
            </th>
            <th className="px-4 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line">
              Player
            </th>
            <th className="px-4 py-[10px] text-center text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line w-[52px]">
              Flag
            </th>
            <th className="px-4 py-[10px] text-right text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line pr-2">
              Points
            </th>
            <th className="bg-oat border-b border-line w-[140px] pr-5" />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-mid text-[13px]">
                No players match &ldquo;<strong>{query}</strong>&rdquo;
              </td>
            </tr>
          ) : (
            filtered.map((player, i) => {
              const pct = maxPoints > 0 ? (player.points / maxPoints) * 100 : 0
              const flag = getFlag(player.nationality)
              const isTop = player.rank <= 3

              return (
                <tr
                  key={i}
                  className="border-b border-oat-dark last:border-b-0 hover:bg-[#f6f8f3] transition-colors"
                >
                  <td className={`px-4 py-3 font-display text-[21px] font-semibold text-center w-[50px] ${isTop ? 'text-green' : 'text-mid'}`}>
                    {player.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-[11px]">
                      {player.image_link ? (
                        <img
                          src={player.image_link}
                          alt={player.name}
                          className="w-[34px] h-[34px] rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-[34px] h-[34px] rounded-full bg-green text-oat flex items-center justify-center font-display text-[13px] font-semibold shrink-0">
                          {getInitials(player.name)}
                        </div>
                      )}
                      {player.id != null ? (
                        <Link
                          href={`/players/${player.id}`}
                          className="font-semibold text-[13.5px] text-ink hover:text-green transition-colors"
                        >
                          {player.name}
                        </Link>
                      ) : (
                        <span className="font-semibold text-[13.5px] text-ink">{player.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-[20px] w-[52px]">
                    {flag ?? (
                      player.nationality ? (
                        <span className="text-[9px] tracking-[1px] uppercase text-mid">
                          {player.nationality}
                        </span>
                      ) : null
                    )}
                  </td>
                  <td className="px-4 py-3 pr-2 text-right font-display text-2xl font-semibold text-green">
                    {player.points.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 pr-5 w-[140px]">
                    <div className="h-[3px] bg-oat-dark rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-matcha to-green rounded-sm"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
