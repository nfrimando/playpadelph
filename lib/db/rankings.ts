import { supabase } from '@/lib/supabase'
import type { Rankings, RankingCategory, PlayerRanking, RankingsMeta } from '@/lib/types'

const CATEGORY_MAP: Record<string, RankingCategory> = {
  "men's open": 'mo', mo: 'mo',
  "men's amateur": 'ma', ma: 'ma',
  "women's open": 'wo', wo: 'wo',
  "women's amateur": 'wa', wa: 'wa',
}

type PointRow = {
  points: number
  date_added: string
  player: { id: number; name: string; nationality: string | null; image_link: string | null } | null
  event: { id: number; name: string; category: string } | null
}

function fmtYearMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-').map(Number)
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${MONTHS[month - 1]} ${year}`
}

export async function getRankings(): Promise<{ rankings: Rankings; meta: RankingsMeta }> {
  const today = new Date()
  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() - 364)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('points')
    .select('points, date_added, player:players(id, name, nationality, image_link), event:events(id, name, category)')
    .gte('date_added', cutoffStr)

  if (error) throw new Error(error.message)

  const totals = new Map<string, {
    id: number
    name: string
    nationality: string
    image_link: string | null
    category: RankingCategory
    total: number
  }>()

  const tournamentNames = new Set<string>()
  const activeCategories = new Set<RankingCategory>()
  for (const row of (data ?? []) as unknown as PointRow[]) {
    if (!row.player || !row.event) continue
    const cat = CATEGORY_MAP[row.event.category.toLowerCase()]
    if (!cat) continue

    tournamentNames.add(row.event.name)
    activeCategories.add(cat)

    const key = `${row.player.id}:${cat}`
    const existing = totals.get(key)
    if (existing) {
      existing.total += row.points
    } else {
      totals.set(key, {
        id: row.player.id,
        name: row.player.name,
        nationality: row.player.nationality ?? '',
        image_link: row.player.image_link,
        category: cat,
        total: row.points,
      })
    }
  }

  const result: Rankings = { mo: [], ma: [], wo: [], wa: [] }

  for (const entry of totals.values()) {
    result[entry.category].push({
      id: entry.id,
      rank: 0,
      name: entry.name,
      nationality: entry.nationality,
      image_link: entry.image_link,
      points: entry.total,
    } as PlayerRanking)
  }

  for (const cat of Object.keys(result) as RankingCategory[]) {
    result[cat].sort((a, b) => b.points - a.points)
    let rank = 1
    result[cat].forEach((p, i) => {
      if (i > 0 && p.points < result[cat][i - 1].points) rank = i + 1
      p.rank = rank
    })
  }

  const meta: RankingsMeta = {
    tournamentCount: tournamentNames.size,
    categoryCount: activeCategories.size,
    periodStart: fmtYearMonth(cutoffStr),
    periodEnd: fmtYearMonth(todayStr),
  }

  return { rankings: result, meta }
}
