import { supabase } from '@/lib/supabase'
import type { DbEvent } from '@/lib/types'

export async function getEvents(): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, category, start_date, end_date, venue, status')
    .order('start_date', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getEventsByCategory(category: string): Promise<DbEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('id, name, category, start_date, end_date, venue, status')
    .eq('category', category)
    .order('start_date', { ascending: true })
  if (error) throw new Error(error.message)
  return data ?? []
}
