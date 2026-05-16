import { supabase } from '@/lib/supabase'
import type { Tournament, TournamentStatus } from '@/lib/types'

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T00:00:00Z')
  const e = new Date(end + 'T00:00:00Z')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  if (start === end)
    return `${months[s.getUTCMonth()]} ${s.getUTCDate()}`
  if (s.getUTCMonth() === e.getUTCMonth())
    return `${months[s.getUTCMonth()]} ${s.getUTCDate()}–${e.getUTCDate()}`
  return `${months[s.getUTCMonth()]} ${s.getUTCDate()} – ${months[e.getUTCMonth()]} ${e.getUTCDate()}`
}

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, c => c.toUpperCase())
}

export async function getTournamentsForCalendar(): Promise<Tournament[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, category, start_date, end_date, venue, status')
    .order('start_date', { ascending: true })
  if (error) throw new Error(error.message)

  const grouped = new Map<string, {
    id: string; name: string; start: string; end: string
    venue: string | null; status: string | null; categories: string[]
  }>()

  for (const row of data ?? []) {
    const key = `${row.name}__${row.start_date}`
    if (!grouped.has(key)) {
      grouped.set(key, {
        id: String(row.id),
        name: row.name,
        start: row.start_date,
        end: row.end_date,
        venue: row.venue,
        status: row.status,
        categories: [],
      })
    }
    grouped.get(key)!.categories.push(toTitleCase(row.category))
  }

  return Array.from(grouped.values()).map(t => ({
    id: t.id,
    year: new Date(t.start + 'T00:00:00Z').getUTCFullYear(),
    name: t.name,
    date: formatDateRange(t.start, t.end),
    dateSort: t.start,
    month: new Date(t.start + 'T00:00:00Z').toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }),
    categories: t.categories,
    venue: t.venue ?? '',
    status: (t.status ?? 'upcoming') as TournamentStatus,
  }))
}
