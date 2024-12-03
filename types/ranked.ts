import { Tiers, Divisions } from 'twisted/dist/constants';

export type QueueType = 'RANKED_SOLO_5x5' | 'RANKED_DUO' | 'RANKED_FLEX_SR'

export interface RankedInfo {
  queueType: QueueType
  tier: Tiers
  division: Divisions
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
}

export interface SeasonRank {
  season: number
  queueType: QueueType
  tier: Tiers
  division: Divisions
}

export interface Honor {
  level: number
  checkpoint: number
  rewards: string[]
}

export interface MasteryScore {
  total: number
  champions: ChampionMastery[]
}

export interface ChampionMastery {
  championId: number
  championLevel: number
  championPoints: number
  lastPlayTime: number
  tokensEarned: number
}

export interface Trophy {
  id: string
  name: string
  description: string
  imageUrl: string
  earnedAt: string
}

export interface Banner {
  id: string
  name: string
  imageUrl: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  equipped: boolean
}

export interface Title {
  id: string
  name: string
  description: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  equipped: boolean
}
