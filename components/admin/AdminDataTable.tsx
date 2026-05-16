'use client'

import { useState, useMemo } from 'react'

export interface Column<T> {
  key: string
  label: string
  width?: string
  render?: (row: T) => React.ReactNode
}

interface AdminDataTableProps<T extends { id: number | string }> {
  title: string
  columns: Column<T>[]
  rows: T[]
  searchKeys: string[]
  onAdd: () => void
  onEdit: (row: T) => void
  onDelete: (row: T) => void
  onBulkDelete?: (rows: T[]) => void
  onBulkStatusUpdate?: (rows: T[], status: string) => void
}

const EVENT_STATUSES = ['open', 'closed', 'full', 'upcoming', 'past']

export default function AdminDataTable<T extends { id: number | string }>({
  title,
  columns,
  rows,
  searchKeys,
  onAdd,
  onEdit,
  onDelete,
  onBulkDelete,
  onBulkStatusUpdate,
}: AdminDataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Set<number | string>>(new Set())
  const [bulkStatus, setBulkStatus] = useState('')

  const filtered = useMemo(() => {
    if (!query) return rows
    const q = query.toLowerCase()
    return rows.filter(row =>
      searchKeys.some(k =>
        String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(q)
      )
    )
  }, [rows, query, searchKeys])

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id))

  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev)
      if (allSelected) {
        filtered.forEach(r => next.delete(r.id))
      } else {
        filtered.forEach(r => next.add(r.id))
      }
      return next
    })
  }

  function toggleRow(id: number | string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedRows = rows.filter(r => selected.has(r.id))
  const singularTitle = title.replace(/s$/, '')

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[9px] tracking-[3px] uppercase text-matcha font-semibold mb-1">Admin</p>
          <h1 className="font-display text-[32px] font-semibold text-ink">{title}</h1>
        </div>
        <button
          onClick={onAdd}
          className="bg-green text-oat px-4 py-2.5 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] hover:bg-green-dark transition-colors font-body"
        >
          + Add {singularTitle}
        </button>
      </div>

      <div className="bg-white rounded-[3px] border border-line overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <span className="text-[9px] tracking-[2.5px] uppercase text-mid font-semibold">
            {rows.length} {title.toLowerCase()}
          </span>
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mid pointer-events-none"
              width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="pl-8 pr-3 py-2 border border-line rounded-[3px] font-body text-xs text-ink bg-oat outline-none w-[240px] transition-all focus:border-green focus:bg-white"
              placeholder={`Search ${title.toLowerCase()}…`}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-5 py-3 bg-green/[0.06] border-b border-green/20">
            <span className="text-[11px] text-green font-semibold font-body">
              {selected.size} selected
            </span>
            {onBulkStatusUpdate && (
              <div className="flex items-center gap-2">
                <select
                  className="bg-oat border border-line rounded-[3px] px-2 py-1 text-[11px] text-ink font-body outline-none focus:border-green"
                  value={bulkStatus}
                  onChange={e => setBulkStatus(e.target.value)}
                >
                  <option value="">Set status…</option>
                  {EVENT_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  disabled={!bulkStatus}
                  onClick={() => {
                    if (!bulkStatus) return
                    onBulkStatusUpdate(selectedRows, bulkStatus)
                    setBulkStatus('')
                    setSelected(new Set())
                  }}
                  className="px-3 py-1 text-[9.5px] font-bold tracking-[1px] uppercase rounded-[2px] bg-green text-oat hover:bg-green-dark disabled:bg-oat-dark disabled:text-line cursor-pointer disabled:cursor-not-allowed transition-colors font-body"
                >
                  Apply
                </button>
              </div>
            )}
            {onBulkDelete && (
              <button
                onClick={() => {
                  onBulkDelete(selectedRows)
                  setSelected(new Set())
                }}
                className="px-3 py-1 text-[9.5px] font-bold tracking-[1px] uppercase rounded-[2px] bg-[#fceaea] text-[#c0392b] hover:bg-[#f5c6c6] transition-colors font-body ml-auto"
              >
                Delete {selected.size}
              </button>
            )}
          </div>
        )}

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-[10px] bg-oat border-b border-line w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-green"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-[10px] bg-oat border-b border-line w-20 text-right pr-5">
                <span className="text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="text-center py-12 text-mid text-[13px]">
                  {query
                    ? `No results for "${query}"`
                    : `No ${title.toLowerCase()} yet`
                  }
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr
                  key={row.id}
                  className="border-b border-oat-dark last:border-b-0 hover:bg-[#f6f8f3] transition-colors"
                >
                  <td className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="accent-green"
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-[13px] text-ink">
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-4 py-3 pr-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-mid hover:text-green rounded-[2px] hover:bg-green/[0.08] transition-colors"
                        title="Edit"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 text-mid hover:text-[#c0392b] rounded-[2px] hover:bg-[#fceaea] transition-colors"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
