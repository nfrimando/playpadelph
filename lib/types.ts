export interface PlayerRanking {
  id?: number
  rank: number
  name: string
  nationality: string
  points: number
  image_link?: string | null
}

export interface PlayerEventEntry {
  eventId: number
  eventName: string
  category: string
  points: number
  startDate: string
  endDate: string
  venue: string | null
}

export interface DbPlayer {
  id: number
  name: string
  nickname: string | null
  nationality: string
  image_link: string | null
}

export interface DbEvent {
  id: number
  name: string
  category: string
  start_date: string
  end_date: string
  venue: string | null
  status: TournamentStatus | null
}

export interface DbPoint {
  id: number
  player_id: number
  event_id: number
  points: number
  date_added: string
}

export type RankingCategory = 'mo' | 'ma' | 'wo' | 'wa'

export type Rankings = Record<RankingCategory, PlayerRanking[]>

export interface RankingsMeta {
  tournamentCount: number
  categoryCount: number
  periodStart: string // e.g. "Aug 2025"
  periodEnd: string   // e.g. "Apr 2026"
}

export type TournamentStatus = 'open' | 'closed' | 'full' | 'upcoming' | 'past'

export interface DbProfile {
  id: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Tournament {
  id: string
  year: number
  name: string
  date: string
  dateSort: string
  month: string
  categories: string[]
  venue: string
  status: TournamentStatus
}
