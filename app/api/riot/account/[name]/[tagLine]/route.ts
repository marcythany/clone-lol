import { NextRequest, NextResponse } from 'next/server'
import { riotClient } from '@/lib/services/riot'

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
    const account = await riotClient.accounts.fetchByRiotId(params.name, params.tagLine)

    return NextResponse.json({
      success: true,
      data: account
    })
  } catch (error) {
    console.error('[Shieldbow] Error:', error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar conta'
      },
      { status: 400 }
    )
  }
}
