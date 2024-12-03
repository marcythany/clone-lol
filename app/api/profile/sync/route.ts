import { getSummonerData } from '@/lib/riot'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { userId, puuid, region } = await request.json()
    
    if (!userId || !puuid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const data = await getSummonerData({ puuid, region })
    
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[/api/profile/sync] Error:', error)
    return NextResponse.json(
      { error: 'Failed to sync profile' },
      { status: 500 }
    )
  }
}
