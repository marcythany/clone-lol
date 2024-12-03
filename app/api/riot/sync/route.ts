import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  getSummonerData, 
  getRankedInfo, 
  getChampionScore, 
  getChallengesInfo 
} from '@/lib/riot';
import { RiotConfig } from '@/lib/riotConfig';
import { z } from 'zod';

if (!process.env.RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const syncBodySchema = z.object({
  userId: z.string(),
  puuid: z.string(),
  region: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = syncBodySchema.parse(body);

    const config: RiotConfig = {
      summonerName: '',  // Not needed for sync as we use PUUID
      tagLine: '',       // Not needed for sync as we use PUUID
      region: validatedBody.region as any,
      regionGroup: validatedBody.region as any, // Will be converted by the API
      puuid: validatedBody.puuid,
      apiKey: process.env.RIOT_API_KEY // Add API key to config
    };

    // Get all profile data in parallel
    const [
      summoner,
      rankedInfo,
      championMasteriesData,
      challenges
    ] = await Promise.all([
      getSummonerData({ ...config, puuid: validatedBody.puuid }),
      getRankedInfo({ ...config, puuid: validatedBody.puuid }),
      getChampionScore({ ...config, puuid: validatedBody.puuid }),
      getChallengesInfo({ ...config, puuid: validatedBody.puuid })
    ]);

    // Extract champion masteries from the response
    const championMasteries = championMasteriesData.champions;

    // Start a transaction to update all data
    const supabase = await createClient();
    const { error: txnError } = await supabase.rpc('begin_transaction');
    
    try {
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          summoner_level: summoner.summonerLevel,
          profile_icon_id: summoner.profileIconId,
          challenges: challenges,
          updated_at: new Date().toISOString(),
        })
        .eq('id', validatedBody.userId);

      if (updateError) {
        throw updateError;
      }

      // Update ranked info
      for (const queue of rankedInfo) {
        const { error: rankedError } = await supabase
          .from('ranked_info')
          .upsert({
            profile_id: validatedBody.userId,
            queue_type: queue.queueType,
            tier: queue.tier,
            division: queue.rank,
            league_points: queue.leaguePoints,
            wins: queue.wins,
            losses: queue.losses,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'profile_id,queue_type'
          });

        if (rankedError) {
          throw rankedError;
        }
      }

      // Update champion masteries
      for (const mastery of championMasteries) {
        const { error: masteryError } = await supabase
          .from('champion_masteries')
          .upsert({
            profile_id: validatedBody.userId,
            champion_id: mastery.championId,
            champion_level: mastery.championLevel,
            champion_points: mastery.championPoints,
            last_play_time: mastery.lastPlayTime,
            champion_points_since_last_level: mastery.championPointsSinceLastLevel,
            champion_points_until_next_level: mastery.championPointsUntilNextLevel,
            chest_granted: mastery.chestGranted,
            tokens_earned: mastery.tokensEarned,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'profile_id,champion_id'
          });

        if (masteryError) {
          throw masteryError;
        }
      }

      // Commit transaction
      await supabase.rpc('commit_transaction');

      return NextResponse.json({
        success: true,
        data: {
          summoner: {
            summonerLevel: summoner.summonerLevel,
            profileIconId: summoner.profileIconId,
          },
          rankedInfo,
          championMasteries,
          challenges,
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  } catch (error) {
    console.error('[/api/riot/sync] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sync profile data',
      },
      { status: 500 }
    );
  }
}
