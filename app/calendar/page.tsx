import { tournaments } from '@/lib/data/tournaments'
import CalendarView from '@/components/calendar/CalendarView'

export default function CalendarPage() {
  const years = [2026, 2025].map(year => ({
    year,
    tournaments: tournaments.filter(t => t.year === year),
    total: tournaments.filter(t => t.year === year).length,
  }))

  return <CalendarView years={years} />
}
