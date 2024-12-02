import { Database } from './supabase'
import { RegionGroups } from 'twisted/dist/constants'

export type Profile = Database['public']['Tables']['profiles']['Row']

export interface VerifyAccountResponse {
  success: boolean
  message?: string
  puuid?: string
  region?: RegionGroups
}

export interface LinkAccountRequest {
  puuid: string
  riotId: string
  tagLine: string
  region: RegionGroups
}
