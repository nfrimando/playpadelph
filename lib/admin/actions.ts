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
