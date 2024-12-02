import { RegionGroups } from 'twisted/dist/constants'
import { User } from '@supabase/supabase-js'

export interface Profile {
  id: string
  puuid: string | null
  summoner_name: string | null
  tag_line: string | null
  region: RegionGroups | null
  created_at?: string
  updated_at?: string
}

export interface ProfileFormState {
  summoner_name: string
  tag_line: string
  region: RegionGroups | null
}

export interface ProfileFormProps {
  user: User
  initialProfile?: Partial<ProfileFormState>
}

export interface UserWithProfile extends User {
  profile: Profile | null
}
