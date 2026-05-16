'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDataTable, { type Column } from '@/components/admin/AdminDataTable'
import PointForm, { type PointRow } from '@/components/admin/PointForm'
import { deletePoint, bulkDeletePoints } from '@/lib/admin/actions'
import type { DbPlayer, DbEvent } from '@/lib/types'

const COLUMNS: Column<PointRow>[] = [
  { key: 'id', label: 'ID', width: '60px' },
  {
    key: 'player',
    label: 'Player',
    render: row => row.player?.name ?? <span className="text-mid text-[11px]">ID {row.player_id}</span>,
  },
  {
    key: 'event',
    label: 'Event',
    render: row => row.event?.name ?? <span className="text-mid text-[11px]">ID {row.event_id}</span>,
  },
  {
    key: 'event_category',
    label: 'Cat.',
    render: row => row.event?.category
      ? <span className="text-[11px] text-mid uppercase tracking-[1px]">{row.event.category}</span>
      : <span className="text-mid">—</span>,
  },
  {
    key: 'points',
    label: 'Points',
    render: row => (
      <span className="font-display text-[18px] font-semibold text-green">
        {row.points.toLocaleString()}
      </span>
    ),
  },
  { key: 'date_added', label: 'Date Added' },
]

interface PointsViewProps {
  points: PointRow[]
  players: DbPlayer[]
  events: DbEvent[]
}

export default function PointsView({ points, players, events }: PointsViewProps) {
  const router = useRouter()
  const [editing, setEditing] = useState<PointRow | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(row: PointRow) {
    const playerName = row.player?.name ?? `Player #${row.player_id}`
    const eventName = row.event?.name ?? `Event #${row.event_id}`
    if (!confirm(`Delete ${row.points} pts for ${playerName} at ${eventName}?`)) return
    await deletePoint(row.id)
    router.refresh()
  }

  async function handleBulkDelete(rows: PointRow[]) {
    if (!confirm(`Delete ${rows.length} points entry(s)? This cannot be undone.`)) return
    await bulkDeletePoints(rows.map(r => r.id))
    router.refresh()
  }

  function handleSaved() {
    setCreating(false)
    setEditing(null)
    router.refresh()
  }

  return (
    <>
      <AdminDataTable<PointRow>
        title="Points"
        columns={COLUMNS}
        rows={points}
        searchKeys={['date_added']}
        onAdd={() => setCreating(true)}
        onEdit={row => setEditing(row)}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
      />
      {(creating || editing) && (
        <PointForm
          point={editing ?? undefined}
          players={players}
          events={events}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
