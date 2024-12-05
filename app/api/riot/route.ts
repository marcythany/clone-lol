import { NextResponse } from 'next/server';

const CURRENT_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION || '13.24.1';
const DATA_DRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (!action) {
    return NextResponse.json({ error: 'Missing action parameter' }, { status: 400 });
  }

  try {
    switch (action) {
      case 'version':
        return NextResponse.json({ version: CURRENT_VERSION });

      case 'challenges':
        // For challenges, we'll return a simplified structure since we handle translations in the UI
        return NextResponse.json({ 
          challengeData: {} // Empty object since we handle translations in the UI
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Data Dragon API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
