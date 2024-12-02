import { NextResponse } from 'next/server'
import { api } from '@/lib/riot'
import { RegionGroups } from 'twisted/dist/constants'
import { getDefaultRegion } from '@/types/regions'

export async function GET(
  request: Request,
  { params }: { params: { puuid: string } }
) {
  const { searchParams } = new URL(request.url)
  const region = (searchParams.get('region') || RegionGroups.AMERICAS) as RegionGroups

  try {
    const summonerRegion = getDefaultRegion(region)
    const { response: summoner } = await api.Summoner.getByPUUID(params.puuid, summonerRegion)

    return NextResponse.json({
      success: true,
      ...summoner
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar invocador'
      },
      { status: 400 }
    )
  }
}
