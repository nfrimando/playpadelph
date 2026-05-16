import type { Tournament } from '@/lib/types'
import { STATUS_CONFIG } from '@/lib/data/tournaments'

interface TournamentRowProps {
  tournament: Tournament
}

export default function TournamentRow({ tournament: t }: TournamentRowProps) {
  const status = STATUS_CONFIG[t.status]
  const dayPart = t.date.split('–')[0].split(' ').pop() ?? t.date

  return (
    <div className={`bg-white border border-line rounded-[3px] flex items-stretch overflow-hidden transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,.08)] ${t.status === 'past' ? 'opacity-50' : ''}`}>
      <div className="bg-green text-oat min-w-[80px] flex flex-col items-center justify-center px-3 py-4 text-center shrink-0">
        <div className="font-display text-[28px] font-bold leading-none text-butter">{dayPart}</div>
        <div className="text-[8px] tracking-[2px] uppercase text-oat/60 mt-[3px]">
          {t.month.substring(0, 3).toUpperCase()}
        </div>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col justify-center gap-1.5">
        <div className="font-display text-[19px] font-semibold text-ink leading-[1.2]">{t.name}</div>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[11px] text-mid flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {t.venue}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {t.categories.map(cat => (
            <span
              key={cat}
              className="text-[9px] tracking-[1px] uppercase px-2 py-0.5 rounded-[2px] bg-oat text-mid font-semibold"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col items-end justify-center gap-2 shrink-0 min-w-[160px]">
        <span className={`text-[9px] font-bold tracking-[1.5px] uppercase px-2.5 py-1 rounded-[20px] whitespace-nowrap ${status.bgClass}`}>
          {status.label}
        </span>

        {t.status === 'open' ? (
          t.regUrl ? (
            <a
              href={t.regUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 font-body text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] bg-green text-oat hover:bg-green-dark transition-colors whitespace-nowrap"
            >
              Register Now
            </a>
          ) : (
            <button className="px-4 py-2 font-body text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] bg-green text-oat hover:bg-green-dark transition-colors whitespace-nowrap">
              Register Now
            </button>
          )
        ) : (
          <button
            disabled
            className="px-4 py-2 font-body text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] bg-oat-dark text-line cursor-not-allowed whitespace-nowrap"
          >
            {t.status === 'full' ? 'Full' : t.status === 'past' ? 'Completed' : 'Closed'}
          </button>
        )}
      </div>
    </div>
  )
}
