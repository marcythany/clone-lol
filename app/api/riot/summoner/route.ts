import { NextRequest, NextResponse } from 'next/server';
import { getSummonerData, getRankedInfo, getChampionScore, getChallengesInfo } from '@/lib/riot';
import { defaultConfig, Regions, getRegionGroup } from '@/lib/riotConfig';
import { z } from 'zod';

const summonerQuerySchema = z.object({
  summonerName: z.string().optional(),
  tagLine: z.string().optional(),
  region: z.string().optional(),
  include: z.array(z.enum(['ranked', 'mastery', 'challenges'])).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const validatedQuery = summonerQuerySchema.parse({
      ...query,
      include: query.include?.split(',') as string[]
    });
    
    const config = {
      ...defaultConfig,
      ...validatedQuery,
      region: validatedQuery.region as Regions,
      regionGroup: getRegionGroup(validatedQuery.region as Regions)
    };

    const summoner = await getSummonerData(config);
    const response: any = {
      success: true,
      data: {
        summoner
      }
    };

    // Fetch additional data based on include parameter
    if (validatedQuery.include?.includes('ranked')) {
      const ranked = await getRankedInfo(config);
      response.data.ranked = ranked;
    }

    if (validatedQuery.include?.includes('mastery')) {
      const mastery = await getChampionScore(config);
      response.data.mastery = mastery;
    }

    if (validatedQuery.include?.includes('challenges')) {
      const challenges = await getChallengesInfo(config);
      response.data.challenges = challenges;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in summoner route:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch summoner data'
    }, { status: 400 });
  }
}
