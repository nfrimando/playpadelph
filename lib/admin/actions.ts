'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import type { DbPlayer, DbEvent, DbPoint } from '@/lib/types'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') throw new Error('Not authorized')
  return supabase
}

// ─── Players ────────────────────────────────────────────────────────────────

export async function createPlayer(data: Omit<DbPlayer, 'id'>) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('players').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/players')
  revalidatePath('/rankings')
}

export async function updatePlayer(id: number, data: Partial<Omit<DbPlayer, 'id'>>) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('players').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/players')
  revalidatePath('/rankings')
  revalidatePath(`/players/${id}`)
}

export async function deletePlayer(id: number) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('players').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/players')
  revalidatePath('/rankings')
}

export async function bulkDeletePlayers(ids: number[]) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('players').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/players')
  revalidatePath('/rankings')
}

// ─── Events ─────────────────────────────────────────────────────────────────

export async function createEvent(data: DbEvent) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('events').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/calendar')
}

export async function updateEvent(id: number, data: Partial<DbEvent>) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('events').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/calendar')
}

export async function deleteEvent(id: number) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/calendar')
}

export async function bulkDeleteEvents(ids: number[]) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('events').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/calendar')
}

export async function bulkUpdateEventStatus(ids: number[], status: string) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('events').update({ status }).in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/calendar')
}

// ─── Points ──────────────────────────────────────────────────────────────────

export async function createPoint(data: Omit<DbPoint, 'id'>) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('points').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}

export async function updatePoint(id: number, data: Partial<Omit<DbPoint, 'id'>>) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('points').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}

export async function deletePoint(id: number) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('points').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}

export async function bulkDeletePoints(ids: number[]) {
  const supabase = await assertAdmin()
  const { error } = await supabase.from('points').delete().in('id', ids)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}

export interface BulkCreateConflict {
  rowIndex: number
  player_id: number
  existing_points: number
}

export async function bulkCreatePoints(
  data: Omit<DbPoint, 'id'>[],
): Promise<{ conflicts: BulkCreateConflict[] }> {
  const supabase = await assertAdmin()

  // Check for existing (player_id, event_id) pairs — conflict detection
  const eventId = data[0]?.event_id
  const playerIds = data.map(d => d.player_id)
  const { data: existing, error: fetchErr } = await supabase
    .from('points')
    .select('player_id, points')
    .eq('event_id', eventId)
    .in('player_id', playerIds)
  if (fetchErr) throw new Error(fetchErr.message)

  const existingMap = new Map<number, number>(
    (existing ?? []).map(r => [r.player_id, r.points]),
  )
  const conflicts: BulkCreateConflict[] = data
    .map((row, i) =>
      existingMap.has(row.player_id)
        ? { rowIndex: i + 1, player_id: row.player_id, existing_points: existingMap.get(row.player_id)! }
        : null,
    )
    .filter((c): c is BulkCreateConflict => c !== null)

  if (conflicts.length > 0) return { conflicts }

  const { error } = await supabase.from('points').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
  return { conflicts: [] }
}

export async function bulkUpdatePoints(
  updates: { id: number; points: number; date_added: string }[],
) {
  const supabase = await assertAdmin()
  await Promise.all(
    updates.map(({ id, points, date_added }) =>
      supabase.from('points').update({ points, date_added }).eq('id', id),
    ),
  )
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}

export async function replaceEventPoints(
  eventId: number,
  data: Omit<DbPoint, 'id'>[],
) {
  const supabase = await assertAdmin()
  const { error: delErr } = await supabase.from('points').delete().eq('event_id', eventId)
  if (delErr) throw new Error(delErr.message)
  if (data.length > 0) {
    const { error: insErr } = await supabase.from('points').insert(data)
    if (insErr) throw new Error(insErr.message)
  }
  revalidatePath('/admin/points')
  revalidatePath('/rankings')
}
