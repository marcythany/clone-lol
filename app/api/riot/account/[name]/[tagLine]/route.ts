import { NextRequest, NextResponse } from 'next/server'
import { RiotApi } from 'twisted'
import { RegionGroups } from 'twisted/dist/constants'

const riotApi = new RiotApi({
  key: process.env.NEXT_PUBLIC_RIOT_API_KEY as string
})

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string; tagLine: string } }
) {
  if (!params.name || !params.tagLine) {
    return NextResponse.json(
      {
        success: false,
        message: 'Nome do invocador e tag são obrigatórios'
      },
      { status: 400 }
    )
  }

  try {
    const { response: account } = await riotApi.Account.getByRiotId(
      params.name, 
      params.tagLine, 
      RegionGroups.AMERICAS
    )

    return NextResponse.json({
      success: true,
      data: account
    })
  } catch (error) {
    console.error('[RiotAPI] Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar conta'
      },
      { status: 400 }
    )
  }
}
