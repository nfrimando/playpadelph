import { createClient } from '@/lib/supabase-server'
import PlayersView from './PlayersView'
import type { DbPlayer } from '@/lib/types'

export default async function AdminPlayersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('players')
    .select('id, name, nickname, nationality, image_link')
    .order('name')

  return <PlayersView players={(data ?? []) as DbPlayer[]} />
}
