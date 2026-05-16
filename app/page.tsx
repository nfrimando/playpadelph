import { rankingsData } from '@/lib/data/rankings'
import RankingsView from '@/components/rankings/RankingsView'

export default function RankingsPage() {
  const uniquePlayers = new Set(
    Object.values(rankingsData).flatMap(arr => arr.map(r => r.name))
  ).size

  return <RankingsView data={rankingsData} playerCount={uniquePlayers} />
}
