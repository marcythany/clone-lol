import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { RiotConfig } from '@/types/riot';

export async function validateRequest(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user?.id) {
      return {
        error: new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401 }
        )
      };
    }

    if (!process.env.RIOT_API_KEY) {
      return {
        error: new NextResponse(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500 }
        )
      };
    }

    const body = await request.json();
    const config: Partial<RiotConfig> = {
      ...body,
      apiKey: process.env.RIOT_API_KEY
    };

    return { session, config };
  } catch (error) {
    console.error('[validateRequest] Error:', error);
    return {
      error: new NextResponse(
        JSON.stringify({ error: 'Invalid request' }),
        { status: 400 }
      )
    };
  }
}
