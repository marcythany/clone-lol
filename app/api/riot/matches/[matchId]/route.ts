import { NextResponse } from 'next/server';
import { validateRequest } from '../../config';
import { getMatchDetails } from '@/lib/riot.server';
import { regionToRegionGroup, Regions } from 'twisted/dist/constants';

export async function POST(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  const validation = await validateRequest(request);
  if (validation.error) return validation.error;
  
  const { config } = validation;
  const { matchId } = params;

  if (!config.region) {
    return NextResponse.json(
      { error: 'Region is required' },
      { status: 400 }
    );
  }
  
  try {
    const data = await getMatchDetails(matchId, config);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/riot/matches/[matchId]] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch match details' },
      { status: 500 }
    );
  }
}
