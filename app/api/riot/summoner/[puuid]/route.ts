import { NextRequest, NextResponse } from 'next/server'
import { lolApi } from '@/lib/riot'
import { Regions } from 'twisted/dist/constants'

export async function GET(
  request: NextRequest,
  { params }: { params: { puuid: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const region = searchParams.get('region')

    if (!region) {
      throw new Error('Region is required')
    }

    const { response: summoner } = await lolApi.Summoner.getByPUUID(
      params.puuid,
      region as Regions
    )

    return NextResponse.json({
      success: true,
      ...summoner
    })
  } catch (error) {
    console.error('Error fetching summoner:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Error fetching summoner'
      },
      { status: 404 }
    )
  }
}
