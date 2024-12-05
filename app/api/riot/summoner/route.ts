import { NextRequest, NextResponse } from 'next/server';
import { getSummonerData, getRankedInfo, getChampionScore, getChallengesInfo } from '@/lib/riot';
import { defaultConfig, Regions, getRegionGroup } from '@/lib/riotConfig';
import { z } from 'zod';
import { validateRequest } from '../config';
import { getSummonerData as getSummonerDataServer } from '@/lib/riot.server';
import { cookies } from 'next/headers';

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

export async function POST(request: Request) {
  const validation = await validateRequest(request);
  if (validation.error) return validation.error;
  
  const { config, session } = validation;
  
  try {
    const data = await getSummonerDataServer(config);
    
    // Create response with data
    const response = NextResponse.json(data);
    
    // Store summoner info in cookies
    const cookieStore = cookies();
    cookieStore.set('summoner_name', data.name, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    // Convert region to string before setting cookie
    if (config.region) {
      cookieStore.set('summoner_region', config.region.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }
    
    return response;
  } catch (error) {
    console.error('[/api/riot/summoner] Error:', error);
    
    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Summoner not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    // Generic error response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch summoner data' },
      { status: 500 }
    );
  }
}
