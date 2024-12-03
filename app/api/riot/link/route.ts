import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getSummonerByRiotId } from '@/lib/riot';
import { RiotConfig } from '@/lib/riotConfig';
import { cookies } from 'next/headers';
import { z } from 'zod';

if (!process.env.RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const linkBodySchema = z.object({
  summoner_name: z.string(),
  tag_line: z.string(),
  region: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = linkBodySchema.parse(body);

    // Get the current user from Supabase auth
    const cookieStore = cookies();
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('Not authenticated');
    }

    const config: RiotConfig = {
      summonerName: validatedBody.summoner_name,
      tagLine: validatedBody.tag_line,
      region: validatedBody.region as any,
      regionGroup: validatedBody.region as any,
      apiKey: process.env.RIOT_API_KEY
    };

    // Get summoner data from Riot API
    const summoner = await getSummonerByRiotId(config);

    if (!summoner) {
      return NextResponse.json(
        {
          success: false,
          message: 'Summoner not found',
        },
        { status: 404 }
      );
    }

    // Update profile in database with Riot ID info
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        puuid: summoner.puuid,
        summoner_name: validatedBody.summoner_name,
        tag_line: validatedBody.tag_line,
        region: validatedBody.region,
        profile_icon_id: summoner.profileIconId,
        summoner_level: summoner.summonerLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      throw updateError;
    }

    // Now that we have linked the account, sync all the data
    const syncResponse = await fetch('/api/riot/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        puuid: summoner.puuid,
        region: validatedBody.region,
      }),
    });

    if (!syncResponse.ok) {
      throw new Error('Failed to sync profile data after linking account');
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
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to link Riot account',
      },
      { status: 500 }
    );
  }
}
