'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDataTable, { type Column } from '@/components/admin/AdminDataTable'
import PlayerForm from '@/components/admin/PlayerForm'
import { deletePlayer, bulkDeletePlayers } from '@/lib/admin/actions'
import type { DbPlayer } from '@/lib/types'

const COLUMNS: Column<DbPlayer>[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: 'Name' },
  { key: 'nickname', label: 'Nickname', render: row => row.nickname ?? <span className="text-mid">—</span> },
  { key: 'nationality', label: 'Nat.' },
  {
    key: 'image_link',
    label: 'Image URL',
    render: row => row.image_link
      ? (
        <a href={row.image_link} target="_blank" rel="noopener"
          className="text-green hover:underline text-[11px] truncate max-w-[200px] inline-block align-bottom">
          {row.image_link}
        </a>
      )
      : <span className="text-mid">—</span>,
  },
]

export default function PlayersView({ players }: { players: DbPlayer[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<DbPlayer | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(row: DbPlayer) {
    if (!confirm(`Delete "${row.name}"? This will also remove their points entries.`)) return
    await deletePlayer(row.id)
    router.refresh()
  }

  async function handleBulkDelete(rows: DbPlayer[]) {
    if (!confirm(`Delete ${rows.length} player(s)? This cannot be undone.`)) return
    await bulkDeletePlayers(rows.map(r => r.id))
    router.refresh()
  }

  function handleSaved() {
    setCreating(false)
    setEditing(null)
    router.refresh()
  }

  return (
    <>
      <AdminDataTable<DbPlayer>
        title="Players"
        columns={COLUMNS}
        rows={players}
        searchKeys={['name', 'nickname', 'nationality']}
        onAdd={() => setCreating(true)}
        onEdit={row => setEditing(row)}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />
      {(creating || editing) && (
        <PlayerForm
          player={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
