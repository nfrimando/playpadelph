import { getRankings } from '@/lib/db/rankings'
import RankingsView from '@/components/rankings/RankingsView'
import type { Rankings, RankingsMeta } from '@/lib/types'

export default async function RankingsPage() {
  let data: Rankings
  let meta: RankingsMeta
  try {
    const result = await getRankings()
    data = result.rankings
    meta = result.meta
  } catch (err) {
    console.error('[rankings] fetch failed:', err)
    data = { mo: [], ma: [], wo: [], wa: [] }
    meta = { tournamentCount: 0, categoryCount: 0, periodStart: '—', periodEnd: '—' }
  }

  const playerCount = new Set(
    Object.values(data).flat().map(p => p.name)
  ).size

  return <RankingsView data={data} playerCount={playerCount} meta={meta} />
}
