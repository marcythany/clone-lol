import { Constants } from 'twisted';

export type Regions =
  (typeof Constants.Regions)[keyof typeof Constants.Regions];

export interface Token {
  id: string;
  name: string;
  description: string;
  descriptionShort: string;
  source: string;
  iconPath: string;
  level:
    | 'IRON'
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | 'DIAMOND'
    | 'MASTER'
    | 'GRANDMASTER'
    | 'CHALLENGER';
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

export interface RiotSummonerData {
  summoner: any;
  id: string;
  puuid: string;
  summonerName: string;
  summoner_level: number;
  profile_icon_id: number;
  tagLine: string;
  region: string;
  user_id: string;
  equipped_title: number;
  mastery_score: number;
  created_at: string;
  updated_at: string;
  equipped_tokens: [];
  available_tokens: [];
  equipped_trophies: [];
  available_trophies: [];
  leagues: Array<{
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }>;
}

export interface UserData {
  user_id: string;
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

export interface ChampionData {
  id: string;
  key: string;
  name: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
}
