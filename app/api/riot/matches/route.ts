import { NextResponse } from 'next/server';
import { validateRequest } from '../config';
import { getMatchHistory } from '@/lib/riot.server';

export async function POST(request: Request) {
  const validation = await validateRequest(request);
  if (validation.error) return validation.error;
  
  const { config } = validation;
  const options = {
    queue: config.queue,
    count: config.count
  };
  
  try {
    const data = await getMatchHistory(config, options);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/riot/matches] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch match history' },
      { status: 500 }
    );
  }
}
