import { User } from "@supabase/supabase-js"
import { Database } from "./supabase"

export type UserWithProfile = User & { profile: any | null }
