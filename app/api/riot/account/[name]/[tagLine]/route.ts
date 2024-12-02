import { NextResponse } from 'next/server'
import { ritoApi } from '@/lib/riot'
import { RegionGroups } from 'twisted/dist/constants'

export async function GET(
  request: Request,
  { params }: { params: { name: string; tagLine: string } }
) {
  try {
    const { response: account } = await ritoApi.Account.getByRiotId(
      params.name, 
      params.tagLine, 
      RegionGroups.AMERICAS
    )

    return NextResponse.json({
      success: true,
      ...account
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar conta'
      },
      { status: 400 }
    )
  }
}
