import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  getSummonerData, 
  getRankedInfo, 
  getChampionScore, 
  getChallengesInfo,
  getHonorLevel
} from '@/lib/riot.server';
import { RiotConfig } from '@/types/riot';
import { z } from 'zod';
import { getLocale, getMessages } from '@/i18n/request';

if (!process.env.RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const syncBodySchema = z.object({
  userId: z.string(),
  puuid: z.string(),
  region: z.string(),
});

export async function POST(request: Request) {
  const locale = getLocale();
  const messages = await getMessages(locale);
  const t = messages.Profile.errors;

  try {
    const body = await request.json();
    const validatedBody = syncBodySchema.parse(body);

    const config: Partial<RiotConfig> = {
      region: validatedBody.region as any,
      puuid: validatedBody.puuid,
      apiKey: process.env.RIOT_API_KEY
    };

    // Get all profile data in parallel
    const [
      summoner,
      rankedInfo,
      championMasteriesData,
      challenges,
      honorData
    ] = await Promise.all([
      getSummonerData(config).catch(() => { throw new Error(t.fetchingSummoner); }),
      getRankedInfo(config).catch(() => { throw new Error(t.apiError); }),
      getChampionScore(config).catch(() => { throw new Error(t.apiError); }),
      getChallengesInfo(config).catch(() => { throw new Error(t.apiError); }),
      getHonorLevel(config).catch(() => { throw new Error(t.apiError); })
    ]);

    // Create Supabase client
    const supabase = await createClient();

    // Update profile data in database
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        summoner_name: summoner.name,
        profile_icon_id: summoner.profileIconId,
        summoner_level: summoner.summonerLevel,
        challenges,
        mastery_score: championMasteriesData,
        honor_level: honorData.honorLevel,
        honor_checkpoint: honorData.checkpoint,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedBody.userId);

    if (updateError) {
      console.error('[/api/riot/sync] Database update error:', updateError);
      throw new Error(t.databaseError);
    }

    return NextResponse.json({
      summoner,
      rankedInfo,
      championMasteries: championMasteriesData,
      challenges,
      honor: honorData
    });
  } catch (error) {
    console.error('[/api/riot/sync] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: t.missingFields }, { status: 400 });
    }

    if (error instanceof Error) {
      const status = 
        error.message === t.unauthorized ? 401 :
        error.message === t.rateLimitExceeded ? 429 :
        error.message === t.databaseError ? 500 :
        error.message === t.apiError ? 502 :
        500;

      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: t.unknown },
      { status: 500 }
    );
  }
}
