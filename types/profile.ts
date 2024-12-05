import { Database } from './supabase'
import { Region, Challenge, ChampionMastery } from "shieldbow";

export interface ChallengePreferences {
  title: string;
  crestBorder: string;
  bannerAccent: string;
  challengeIds: string[];
  prestigeCrestBorderLevel: number;
}

export type Profile = Database['public']['Tables']['profiles']['Row'] & {
  id: string;
  puuid: string;
  summoner_name: string;
  tag_line: string;
  region: Region;
  profile_icon_id: number;
  summoner_level: number;
  equipped_title?: string;
  challenges?: {
    challenges: Challenge[];
    preferences: ChallengePreferences;
    totalPoints: {
      max: number;
      level: string;
      current: number;
      percentile: number;
    };
    categoryPoints: {
      TEAMWORK: any;
      EXPERTISE: any;
      VETERANCY: any;
      COLLECTION: any;
      IMAGINATION: any;
    };
  };
  mastery_score?: ChampionMastery;
  created_at: string;
  updated_at: string;
}

export interface RankedInfo {
  queue_type: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR'
  tier: string
  division: string
  league_points: number
  wins: number
  losses: number
  veteran: boolean
  inactive: boolean
  freshBlood: boolean
  hotStreak: boolean
}

export interface ProfileWithRanked extends Profile {
  challenges: any
  mastery_score: any
  equipped_title: string
  ranked_info?: RankedInfo[]
}

export interface ProfileFormData {
  summoner_name: string
  tag_line: string
  region: Region
  userId: string
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
    TEAMWORK: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
    EXPERTISE: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
    VETERANCY: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
    COLLECTION: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
    IMAGINATION: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
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
