import { RegionGroups, Regions } from 'twisted/dist/constants'
import { Database } from './supabase'

export type Profile = Database['public']['Tables']['profiles']['Row']

export interface RankedInfo {
  queue_type: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR'
  tier: string
  division: string
  league_points: number
  wins: number
  losses: number
}

export interface ProfileWithRanked extends Profile {
  ranked_info?: RankedInfo[]
}

export interface ProfileFormData {
  summoner_name: string
  tag_line: string
  region: Regions
}

export interface ProfileFormProps {
  userId: string
  hasInitialProfile?: boolean
  initialProfile?: Profile | null | undefined
}

export interface SummonerData {
  summonerLevel: number
  profileIconId: number
}

export interface RankedData {
  queueType: string
  tier: string
  division: string
  leaguePoints: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
}

export interface ChampionMasteryData {
  championId: number
  championLevel: number
  championPoints: number
  lastPlayTime: number
  tokensEarned: number
}

export interface MasteryScoreData {
  total: number
  champions: ChampionMasteryData[]
}

export interface ChallengesData {
  categoryPoints: {
    VETERANCY: number
  }
  VETERANCY: number
}

export interface ProfileUpdateData {
  summoner: SummonerData
  rankedInfo: RankedData[]
  masteryScore: MasteryScoreData
  challenges: ChallengesData
  equipped_title?: string | null
  equipped_background?: string | null
  equipped_icon_border?: string | null
}
