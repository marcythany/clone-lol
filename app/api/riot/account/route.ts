import { NextRequest, NextResponse } from 'next/server';
import { getSummonerData, Regions } from '@/lib/riot';
import { defaultConfig, getRegionGroup } from '@/lib/riotConfig';
import { z } from 'zod';

const accountQuerySchema = z.object({
  summonerName: z.string().optional(),
  tagLine: z.string().optional(),
  region: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams);
    
    const validatedQuery = accountQuerySchema.parse(query);
    
    const config = {
      ...defaultConfig,
      ...validatedQuery,
      region: validatedQuery.region ? Regions[validatedQuery.region as keyof typeof Regions] : defaultConfig.region,
      regionGroup: validatedQuery.region 
        ? getRegionGroup(Regions[validatedQuery.region as keyof typeof Regions]) 
        : defaultConfig.regionGroup
    };

    const summoner = await getSummonerData(config);

    return NextResponse.json({
      success: true,
      data: summoner
    });
  } catch (error) {
    console.error('Error in account route:', error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch account data'
    }, { status: 400 });
  }
}
