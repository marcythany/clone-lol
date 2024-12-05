import { NextResponse } from 'next/server';
import { validateRequest } from '../config';
import { getRankedInfo } from '@/lib/riot.server';

export async function POST(request: Request) {
  const validation = await validateRequest(request);
  if (validation.error) return validation.error;
  
  const { config } = validation;
  
  try {
    const data = await getRankedInfo(config);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/riot/ranked] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch ranked data' },
      { status: 500 }
    );
  }
}
