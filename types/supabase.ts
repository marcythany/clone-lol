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
      banners: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      cache: {
        Row: {
          id: string;
          key: string;
          value: Json;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          expires_at?: string;
          created_at?: string;
        };
      };
      champion_mastery: {
        Row: {
          id: string;
          profile_id: string;
          champion_id: number;
          champion_level: number;
          champion_points: number;
          last_play_time: number;
          champion_points_since_last_level: number;
          champion_points_until_next_level: number;
          chest_granted: boolean;
        };
        Insert: {
          id?: string;
          profile_id: string;
          champion_id: number;
          champion_level: number;
          champion_points: number;
          last_play_time: number;
          champion_points_since_last_level: number;
          champion_points_until_next_level: number;
          chest_granted: boolean;
        };
        Update: {
          id?: string;
          profile_id?: string;
          champion_id?: number;
          champion_level?: number;
          champion_points?: number;
          last_play_time?: number;
          champion_points_since_last_level?: number;
          champion_points_until_next_level?: number;
          chest_granted?: boolean;
        };
      };
      honor: {
        Row: {
          id: string;
          profile_id: string;
          level: number;
          checkpoint: number;
          votes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          level: number;
          checkpoint: number;
          votes: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          level?: number;
          checkpoint?: number;
          votes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
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
          participants: Json;
          teams: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
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
          participants: Json;
          teams: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
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
          participants?: Json;
          teams?: Json;
          created_at?: string;
        };
      };
      profile_banners: {
        Row: {
          id: string;
          profile_id: string;
          banner_id: string;
          equipped: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          banner_id: string;
          equipped: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          banner_id?: string;
          equipped?: boolean;
          created_at?: string;
        };
      };
      profile_titles: {
        Row: {
          id: string;
          profile_id: string;
          title_id: string;
          equipped: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          title_id: string;
          equipped: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          title_id?: string;
          equipped?: boolean;
          created_at?: string;
        };
      };
      profile_trophies: {
        Row: {
          id: string;
          profile_id: string;
          trophy_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          trophy_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          trophy_id?: string;
          created_at?: string;
        };
      };
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
      ranked_info: {
        Row: {
          id: string;
          profile_id: string;
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          queue_type?: string;
          tier?: string;
          division?: string;
          league_points?: number;
          wins?: number;
          losses?: number;
          veteran?: boolean;
          inactive?: boolean;
          fresh_blood?: boolean;
          hot_streak?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      season_ranks: {
        Row: {
          id: string;
          profile_id: string;
          season: number;
          queue_type: string;
          tier: string;
          division: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          season: number;
          queue_type: string;
          tier: string;
          division: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          season?: number;
          queue_type?: string;
          tier?: string;
          division?: string;
          created_at?: string;
        };
      };
      titles: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          created_at?: string;
        };
      };
      trophies: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          image_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          image_url?: string;
          created_at?: string;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

import { CookieOptions } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
// Reuse types from riot.ts
import { MatchParticipant, TeamStats } from './riot';

// Cookie types for Supabase client
export interface CookieItem {
  name: string;
  value: string;
  options?: CookieOptions;
}

export type CookieList = CookieItem[];

export interface ResponseWithSupabase {
  supabase: SupabaseClient<Database>
  response: Response
}
