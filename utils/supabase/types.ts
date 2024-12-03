import { NextResponse } from 'next/server'
import { SupabaseClient } from '@supabase/supabase-js'

export interface ResponseWithSupabase extends NextResponse {
  supabase: SupabaseClient
}
