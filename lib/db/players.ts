import { supabase } from '@/lib/supabase'
import type { DbPlayer, PlayerEventEntry } from '@/lib/types'

export async function getPlayers(): Promise<DbPlayer[]> {
  const { data, error } = await supabase
    .from('players')
    .select('id, name, nickname, nationality, image_link')
    .order('name')
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getPlayer(id: number): Promise<DbPlayer | null> {
  const { data, error } = await supabase
    .from('players')
    .select('id, name, nickname, nationality, image_link')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

type PointWithEvent = {
  points: number
  date_added: string
  event: {
    id: number
    name: string
    category: string
    start_date: string
    end_date: string
    venue: string | null
  } | null
}

export async function getPlayerWithEvents(id: number): Promise<{
  player: DbPlayer
  events: PlayerEventEntry[]
  categoryPoints: { category: string; points: number }[]
} | null> {
  const [playerRes, pointsRes] = await Promise.all([
    supabase
      .from('players')
      .select('id, name, nickname, nationality, image_link')
      .eq('id', id)
      .single(),
    supabase
      .from('points')
      .select('points, date_added, event:events(id, name, category, start_date, end_date, venue)')
      .eq('player_id', id)
      .order('date_added', { ascending: false }),
  ])

  if (playerRes.error || !playerRes.data) return null

  const today = new Date()
  const cutoff = new Date(today)
  cutoff.setDate(today.getDate() - 364)
  const cutoffStr = cutoff.toISOString().split('T')[0]

  const events: PlayerEventEntry[] = []
  const pointsByCategory = new Map<string, number>()

  for (const row of (pointsRes.data ?? []) as unknown as PointWithEvent[]) {
    if (!row.event) continue
    events.push({
      eventId: row.event.id,
      eventName: row.event.name,
      category: row.event.category,
      points: row.points,
      startDate: row.event.start_date,
      endDate: row.event.end_date,
      venue: row.event.venue,
    })
    if (row.date_added >= cutoffStr) {
      const cat = row.event.category
      pointsByCategory.set(cat, (pointsByCategory.get(cat) ?? 0) + row.points)
    }
  }

  const categoryPoints = Array.from(pointsByCategory.entries()).map(
    ([category, points]) => ({ category, points })
  )

  return { player: playerRes.data, events, categoryPoints }
}
