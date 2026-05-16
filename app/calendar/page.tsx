import { getTournamentsForCalendar } from '@/lib/db/tournaments'
import CalendarView from '@/components/calendar/CalendarView'

export default async function CalendarPage() {
  const all = await getTournamentsForCalendar()

  const uniqueYears = [...new Set(all.map(t => t.year))].sort((a, b) => b - a)
  const years = uniqueYears.map(year => ({
    year,
    tournaments: all.filter(t => t.year === year),
    total: all.filter(t => t.year === year).length,
  }))

  const currentYear = new Date().getFullYear()

  return <CalendarView years={years} currentYear={currentYear} />
}
