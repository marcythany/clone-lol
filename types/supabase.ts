export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          puuid: string | null;
          summoner_name: string | null;
          tag_line: string | null;
          region: string | null;
          profile_icon_id: number | null;
          summoner_level: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          puuid?: string | null;
          summoner_name?: string | null;
          tag_line?: string | null;
          region?: string | null;
          profile_icon_id?: number | null;
          summoner_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          puuid?: string | null;
          summoner_name?: string | null;
          tag_line?: string | null;
          region?: string | null;
          profile_icon_id?: number | null;
          summoner_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          created_at: string;
          match_id: string;
          queue_type: string;
          game_creation: number;
          game_duration: number;
          game_end_timestamp: number;
          game_mode: string;
          game_type: string;
          game_version: string;
          map_id: number;
          platform_id: string;
          queue_id: number;
          participants: MatchParticipant[];
          teams: TeamStats[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          match_id: string;
          queue_type: string;
          game_creation: number;
          game_duration: number;
          game_end_timestamp: number;
          game_mode: string;
          game_type: string;
          game_version: string;
          map_id: number;
          platform_id: string;
          queue_id: number;
          participants: MatchParticipant[];
          teams: TeamStats[];
        };
        Update: {
          id?: string;
          created_at?: string;
          match_id?: string;
          queue_type?: string;
          game_creation?: number;
          game_duration?: number;
          game_end_timestamp?: number;
          game_mode?: string;
          game_type?: string;
          game_version?: string;
          map_id?: number;
          platform_id?: string;
          queue_id?: number;
          participants?: MatchParticipant[];
          teams?: TeamStats[];
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

import { CookieOptions } from '@supabase/ssr';
// Reuse types from riot.ts
import { MatchParticipant, TeamStats } from './riot';

// Cookie types for Supabase client
export interface CookieItem {
  name: string;
  value: string;
  options?: CookieOptions;
}

export type CookieList = CookieItem[];
