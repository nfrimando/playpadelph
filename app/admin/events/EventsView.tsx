'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDataTable, { type Column } from '@/components/admin/AdminDataTable'
import EventForm from '@/components/admin/EventForm'
import { deleteEvent, bulkDeleteEvents, bulkUpdateEventStatus } from '@/lib/admin/actions'
import type { DbEvent } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  open:     'bg-[#e8f5ee] text-green',
  closed:   'bg-[#f5f0e8] text-[#8a7040]',
  full:     'bg-[#fceaea] text-[#c0392b]',
  upcoming: 'bg-[#eaf0f5] text-[#1e3a7b]',
  past:     'bg-oat-dark text-mid',
}

const CATEGORY_LABELS: Record<string, string> = {
  mo: "Men's Open",
  ma: "Men's Amateur",
  wo: "Women's Open",
  wa: "Women's Amateur",
}

const COLUMNS: Column<DbEvent>[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category', render: row => CATEGORY_LABELS[row.category] ?? row.category },
  { key: 'start_date', label: 'Start' },
  { key: 'end_date', label: 'End' },
  { key: 'venue', label: 'Venue', render: row => row.venue ?? <span className="text-mid">—</span> },
  {
    key: 'status',
    label: 'Status',
    render: row => row.status
      ? (
        <span className={`inline-block px-2 py-0.5 rounded-[20px] text-[9px] font-semibold tracking-[1px] uppercase ${STATUS_COLORS[row.status] ?? 'bg-oat text-mid'}`}>
          {row.status}
        </span>
      )
      : <span className="text-mid">—</span>,
  },
]

export default function EventsView({ events }: { events: DbEvent[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<DbEvent | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(row: DbEvent) {
    if (!confirm(`Delete "${row.name}"? This will also remove related points entries.`)) return
    await deleteEvent(row.id)
    router.refresh()
  }

  async function handleBulkDelete(rows: DbEvent[]) {
    if (!confirm(`Delete ${rows.length} event(s)? This cannot be undone.`)) return
    await bulkDeleteEvents(rows.map(r => r.id))
    router.refresh()
  }

  async function handleBulkStatus(rows: DbEvent[], status: string) {
    await bulkUpdateEventStatus(rows.map(r => r.id), status)
    router.refresh()
  }

  function handleSaved() {
    setCreating(false)
    setEditing(null)
    router.refresh()
  }

  return (
    <>
      <AdminDataTable<DbEvent>
        title="Events"
        columns={COLUMNS}
        rows={events}
        searchKeys={['name', 'category', 'venue', 'status']}
        onAdd={() => setCreating(true)}
        onEdit={row => setEditing(row)}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatus}
      />
      {(creating || editing) && (
        <EventForm
          event={editing ?? undefined}
          onClose={() => { setCreating(false); setEditing(null) }}
          onSaved={handleSaved}
        />
      )}
    </>
  )
}
