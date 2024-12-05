import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getSummonerByRiotId, getChampionScore, getChallengesInfo, getHonorLevel } from '@/lib/riot.server';
import { RiotConfig } from '@/types/riot';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { RegionGroups, Regions } from 'twisted/dist/constants';

if (!process.env.RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const linkBodySchema = z.object({
  userId: z.string(),
  summonerName: z.string(),
  tagLine: z.string(),
  region: z.nativeEnum(Regions)
});

interface SummonerResponse {
  puuid: string;
  id: string;
  accountId: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  gameName: string;
  tagLine: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[/api/riot/link] Request body:', body);
    
    const validatedBody = linkBodySchema.safeParse(body);
    if (!validatedBody.success) {
      console.error('[/api/riot/link] Validation error:', validatedBody.error);
      return NextResponse.json(
        { error: 'Invalid request data', details: validatedBody.error.errors },
        { status: 400 }
      );
    }

    // Get the current user from Supabase auth
    const cookieStore = cookies();
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('[/api/riot/link] Auth error:', userError);
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify user ID matches
    if (user.id !== validatedBody.data.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const config: RiotConfig = {
      summonerName: validatedBody.data.summonerName,
      tagLine: validatedBody.data.tagLine,
      region: validatedBody.data.region,
      apiKey: process.env.RIOT_API_KEY!,
      regionGroup: RegionGroups.AMERICAS
    };

    // Get summoner data from Riot API
    const summoner = await getSummonerByRiotId(config) as SummonerResponse;
    console.log('[/api/riot/link] Summoner data:', summoner);

    if (!summoner) {
      return NextResponse.json(
        { error: 'Summoner not found' },
        { status: 404 }
      );
    }

    // Get additional profile data
    let masteryScore = null;
    let challengesInfo = null;
    let honorLevel = null;
    let honorData = null;

    try {
      console.log('[/api/riot/link] Fetching mastery score...');
      masteryScore = await getChampionScore({ ...config, puuid: summoner.puuid });
      console.log('[/api/riot/link] Mastery score:', masteryScore);
    } catch (error) {
      console.error('[/api/riot/link] Error fetching mastery score:', error);
    }

    try {
      console.log('[/api/riot/link] Fetching challenges info...');
      challengesInfo = await getChallengesInfo({ ...config, puuid: summoner.puuid });
      console.log('[/api/riot/link] Challenges info:', challengesInfo);
    } catch (error) {
      console.error('[/api/riot/link] Error fetching challenges info:', error);
    }

    try {
      console.log('[/api/riot/link] Fetching honor level...');
      honorData = await getHonorLevel({ ...config, puuid: summoner.puuid });
      honorLevel = honorData.honorLevel;
      console.log('[/api/riot/link] Honor data:', honorData);
    } catch (error) {
      console.error('[/api/riot/link] Error fetching honor level:', error);
    }

    // Update profile in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        puuid: summoner.puuid,
        summoner_name: validatedBody.data.summonerName,
        tag_line: validatedBody.data.tagLine,
        region: validatedBody.data.region,
        profile_icon_id: summoner.profileIconId,
        summoner_level: summoner.summonerLevel,
        honor_level: honorLevel,
        honor_checkpoint: honorData?.checkpoint || 0,
        honor_locked: honorData?.rewardsLocked || false,
        mastery_score: masteryScore,
        challenges: challengesInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[/api/riot/link] Database error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        summoner: {
          puuid: summoner.puuid,
          summonerLevel: summoner.summonerLevel,
          profileIconId: summoner.profileIconId,
        },
      },
    });
  } catch (error) {
    console.error('[/api/riot/link] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to link Riot account' },
      { status: 500 }
    );
  }
}
