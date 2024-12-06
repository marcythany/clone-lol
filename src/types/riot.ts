import { RegionGroups } from 'twisted/dist/constants';

export interface Token {
  id: string;
  name: string;
  description: string;
  descriptionShort: string;
  source: string;
  iconPath: string;
  level: 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
  equipped: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

export interface Trophy {
  contentId: string;
  objectName: string;
  localizedName: string;
  localizedDescription: string;
  theme: string;
  bracket: number;
  profileIcon: string;
  equipped: boolean;
}

export interface RiotProfile {
  id: string;
  user_id: string;
  puuid: string | null;
  summoner_name: string | null;
  tag_line: string | null;
  region: string | null;
  profile_icon_id: number | null;
  summoner_level: number | null;
  equipped_title: string | null;
  mastery_score: number | null;
  created_at: string;
  updated_at: string;
  ranked_info?: RankedInfo[];
  honor_info?: HonorInfo;
  champion_masteries?: ChampionMastery[];
  equipped_tokens: Token[];
  available_tokens: Token[];
  equipped_trophies: Trophy[];
  available_trophies: Trophy[];
}

export interface RankedInfo {
  queue_type: string;
  tier: string;
  division: string;
  league_points: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  fresh_blood: boolean;
  hot_streak: boolean;
}

export interface HonorInfo {
  level: number;
  checkpoint: number;
  emblem_url: string | null;
}

export interface ChampionMastery {
  champion_id: number;
  champion_level: number;
  champion_points: number;
  last_play_time: string | null;
  tokens_earned: number;
}

export interface LinkAccountRequest {
  riotId: string;
  tagLine: string;
  region: string;
}

export interface VerifyAccountResponse {
  success: boolean;
  message?: string;
  profile?: RiotProfile;
} 