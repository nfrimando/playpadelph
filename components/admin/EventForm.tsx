'use client'

import { useState } from 'react'
import type { DbEvent, TournamentStatus } from '@/lib/types'
import { createEvent, updateEvent } from '@/lib/admin/actions'

interface EventFormProps {
  event?: DbEvent
  onClose: () => void
  onSaved: () => void
}

const CATEGORIES = [
  { value: 'mo', label: "Men's Open" },
  { value: 'ma', label: "Men's Amateur" },
  { value: 'wo', label: "Women's Open" },
  { value: 'wa', label: "Women's Amateur" },
]

const STATUSES: TournamentStatus[] = ['open', 'closed', 'full', 'upcoming', 'past']

const inputClass =
  'w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink focus:outline-none focus:border-green focus:bg-white transition-colors'

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export default function EventForm({ event, onClose, onSaved }: EventFormProps) {
  const [form, setForm] = useState({
    id: event?.id?.toString() ?? '',
    name: event?.name ?? '',
    category: event?.category ?? 'mo',
    start_date: event?.start_date ?? '',
    end_date: event?.end_date ?? '',
    venue: event?.venue ?? '',
    status: (event?.status ?? 'upcoming') as string,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.end_date < form.start_date) {
      setError('End date cannot be before start date.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data: DbEvent = {
        id: Number(form.id),
        name: form.name.trim(),
        category: form.category,
        start_date: form.start_date,
        end_date: form.end_date,
        venue: form.venue.trim() || null,
        status: (form.status || null) as TournamentStatus | null,
      }
      if (event) {
        await updateEvent(event.id, data)
      } else {
        await createEvent(data)
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
      <div className="bg-white border border-line rounded-[3px] w-full max-w-[480px] mx-4 shadow-[0_8px_40px_rgba(0,0,0,.18)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-[22px] font-semibold text-ink">
            {event ? 'Edit Event' : 'Add Event'}
          </h2>
          <button onClick={onClose} className="text-mid hover:text-ink transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-[11px] text-[#c0392b] bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              ID <span className="text-[#c0392b]">*</span>
            </label>
            <input type="number" value={form.id} onChange={set('id')} required
              disabled={!!event}
              className={`${inputClass} ${event ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Unique integer ID" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Name <span className="text-[#c0392b]">*</span>
            </label>
            <input type="text" value={form.name} onChange={set('name')} required
              className={inputClass} placeholder="e.g. Philippine Open 2026" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Category <span className="text-[#c0392b]">*</span>
            </label>
            <select value={form.category} onChange={set('category')} required className={inputClass}>
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
                Start date <span className="text-[#c0392b]">*</span>
              </label>
              <input type="date" value={form.start_date} onChange={set('start_date')} required
                className={inputClass} />
            </div>
            <div>
              <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
                End date <span className="text-[#c0392b]">*</span>
              </label>
              <input type="date" value={form.end_date} onChange={set('end_date')} required
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Venue
            </label>
            <input type="text" value={form.venue} onChange={set('venue')}
              className={inputClass} placeholder="e.g. Play Padel Greenfield, Mandaluyong" />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Status
            </label>
            <select value={form.status} onChange={set('status')} className={inputClass}>
              <option value="">— Select status —</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] text-mid hover:text-ink transition-colors font-body">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className={`px-5 py-2.5 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors
                ${loading ? 'bg-oat-dark text-line' : 'bg-green text-oat hover:bg-green-dark'}`}>
              {loading ? 'Saving…' : event ? 'Save changes' : 'Add event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
