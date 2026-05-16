import Link from 'next/link'
import type { PlayerRanking } from '@/lib/types'

const FLAGS: Record<string, string> = {
  PH: '🇵🇭', PHI: '🇵🇭', JPN: '🇯🇵', JP: '🇯🇵', FRA: '🇫🇷', ARG: '🇦🇷',
  AUS: '🇦🇺', SWE: '🇸🇪', ESP: '🇪🇸', DEN: '🇩🇰', IRI: '🇮🇷', RUS: '🇷🇺',
  US: '🇺🇸', USA: '🇺🇸', CHN: '🇨🇳', TH: '🇹🇭', THA: '🇹🇭', NL: '🇳🇱',
  ITA: '🇮🇹', GER: '🇩🇪', CAN: '🇨🇦', MEX: '🇲🇽', BRA: '🇧🇷', KOR: '🇰🇷',
  IND: '🇮🇳', IDN: '🇮🇩', VIE: '🇻🇳', MAS: '🇲🇾', SGP: '🇸🇬',
}

const NUMERALS = ['I', 'II', 'III']

function getFlag(nat: string) {
  return FLAGS[nat?.toUpperCase()] ?? null
}

interface PodiumCardProps {
  player: PlayerRanking
  position: 0 | 1 | 2
}

function PodiumCard({ player, position }: PodiumCardProps) {
  const flag = getFlag(player.nationality)
  const numeral = NUMERALS[position]

  const pointColors = ['text-butter', 'text-silver', 'text-bronze']
  const numeralColors = ['text-butter', 'text-silver', 'text-bronze']

  if (position === 0) {
    return (
      <div className="rounded-[3px] p-7 pb-6 text-center bg-green shadow-[0_14px_40px_rgba(26,92,56,.26)] -translate-y-2.5">
        <span className={`font-display text-5xl font-semibold leading-none mb-3 block ${numeralColors[0]}`}>
          {numeral}
        </span>
        {player.image_link ? (
          <img src={player.image_link} alt={player.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2" />
        ) : flag ? (
          <span className="text-[26px] block mb-1.5">{flag}</span>
        ) : null}
        {player.id != null ? (
          <Link href={`/players/${player.id}`} className="font-display text-lg font-semibold leading-tight mb-0.5 text-oat hover:opacity-75 transition-opacity block">
            {player.name}
          </Link>
        ) : (
          <div className="font-display text-lg font-semibold leading-tight mb-0.5 text-oat">{player.name}</div>
        )}
        {player.nationality && <span className="text-[9px] tracking-[2px] uppercase block mb-[18px] text-oat/42">{player.nationality}</span>}
        <span className={`font-display text-[42px] font-bold block ${pointColors[0]}`}>
          {player.points.toLocaleString()}
        </span>
        <span className="text-[8.5px] tracking-[2.5px] uppercase block mt-0.5 text-oat/35">pts</span>
      </div>
    )
  }

  return (
    <div className="rounded-[3px] p-7 pb-6 text-center bg-white border border-line shadow-[0_3px_12px_rgba(0,0,0,.06)]">
      <span className={`font-display text-5xl font-semibold leading-none mb-3 block ${numeralColors[position]}`}>
        {numeral}
      </span>
      {player.image_link ? (
        <img src={player.image_link} alt={player.name} className="w-14 h-14 rounded-full object-cover mx-auto mb-2" />
      ) : flag ? (
        <span className="text-[26px] block mb-1.5">{flag}</span>
      ) : null}
      {player.id != null ? (
        <Link href={`/players/${player.id}`} className="font-display text-lg font-semibold leading-tight mb-0.5 text-ink hover:text-green transition-colors block">
          {player.name}
        </Link>
      ) : (
        <div className="font-display text-lg font-semibold leading-tight mb-0.5 text-ink">{player.name}</div>
      )}
      {player.nationality && <span className="text-[9px] tracking-[2px] uppercase block mb-[18px] text-mid">{player.nationality}</span>}
      <span className={`font-display text-[42px] font-bold block ${pointColors[position]}`}>
        {player.points.toLocaleString()}
      </span>
      <span className="text-[8.5px] tracking-[2.5px] uppercase block mt-0.5 text-mid">pts</span>
    </div>
  )
}

interface PodiumProps {
  players: PlayerRanking[]
}

export default function Podium({ players }: PodiumProps) {
  const top3 = players.slice(0, 3)
  if (top3.length === 0) return null

  // Visual order: 2nd, 1st, 3rd
  const visualOrder = [
    top3[1] ? { player: top3[1], position: 1 as const } : null,
    top3[0] ? { player: top3[0], position: 0 as const } : null,
    top3[2] ? { player: top3[2], position: 2 as const } : null,
  ]

  return (
    <div className="grid grid-cols-3 gap-3.5 mb-9 items-end">
      {visualOrder.map((item, i) =>
        item ? (
          <PodiumCard key={i} player={item.player} position={item.position} />
        ) : (
          <div key={i} />
        )
      )}
    </div>
  )
}
