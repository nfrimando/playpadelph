import { createClient } from '@/lib/supabase-server'
import EventsView from './EventsView'
import type { DbEvent } from '@/lib/types'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('id, name, category, start_date, end_date, venue, status')
    .order('start_date', { ascending: false })

  return <EventsView events={(data ?? []) as DbEvent[]} />
}
