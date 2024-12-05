import { NextResponse } from 'next/server'
import { getChallengesInfo, RegionGroups } from '@/lib/riot'
import { createClient } from '@/utils/supabase/server'
import { defaultLocale } from '@/i18n/routing'
import { getRegionGroup } from '@/lib/riotConfig'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || defaultLocale

    // Get user profile from Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile with Riot info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile?.summoner_name || !profile?.tag_line || !profile?.region) {
      return NextResponse.json(
        { error: 'Summoner info not found' },
        { status: 404 }
      )
    }

    // Get challenges info using profile data
    const challengesInfo = await getChallengesInfo({
      summonerName: profile.summoner_name,
      tagLine: profile.tag_line,
      region: profile.region,
      locale,
      regionGroup: getRegionGroup(profile.region)
    })

    return NextResponse.json(challengesInfo)
  } catch (error) {
    console.error('[/api/challenges] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch challenges info' },
      { status: 500 }
    )
  }
}
