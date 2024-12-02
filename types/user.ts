import { User } from "@supabase/supabase-js"
import { Database } from "./supabase"

export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserWithProfile = User & { profile: Profile | null }

export interface ProfileFormData {
  summonerName: string
  tagLine: string
}

export interface ProfileFormProps {
  userId: string
  hasInitialProfile?: boolean
  initialProfile?: Profile | null | undefined
}
