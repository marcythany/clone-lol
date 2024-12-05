import { NextResponse } from 'next/server';
import { validateRequest } from '../config';
import { getChampionScore } from '@/lib/riot.server';

export async function POST(request: Request) {
  const validation = await validateRequest(request);
  if (validation.error) return validation.error;
  
  const { config } = validation;
  
  try {
    const data = await getChampionScore(config);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/riot/mastery] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch mastery data' },
      { status: 500 }
    );
  }
}
