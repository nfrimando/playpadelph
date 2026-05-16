export interface PlayerRanking {
  rank: number
  name: string
  nationality: string
  points: number
}

export type RankingCategory = 'mo' | 'ma' | 'wo' | 'wa'

export type Rankings = Record<RankingCategory, PlayerRanking[]>

export type TournamentStatus = 'open' | 'closed' | 'full' | 'upcoming' | 'past'

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
  regUrl: string
}
