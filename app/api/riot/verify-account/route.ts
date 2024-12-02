import { NextResponse } from 'next/server'
import { api, ritoApi } from '@/lib/riot'
import { RegionGroups, Regions } from 'twisted/dist/constants'
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/types/user'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const riotId = searchParams.get('riotId')
  const tagLine = searchParams.get('tagLine')
  const region = searchParams.get('region') as RegionGroups

  if (!riotId || !tagLine || !region) {
    return NextResponse.json(
      {
        success: false,
        message: 'Parâmetros inválidos'
      },
      { status: 400 }
    )
  }

  try {
    const supabase = createClient()

    // Verifica se a conta já está linkada
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('user_id, summoner_id')
      .eq('summoner_name', riotId)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          message: 'Esta conta já está vinculada a outro usuário'
        },
        { status: 400 }
      )
    }

    const { response: account } = await ritoApi.Account.getByRiotId(
      riotId,
      tagLine,
      region
    )

    return NextResponse.json({
      success: true,
      puuid: account.puuid,
      region: region
    })
  } catch (error) {
    console.error('Error verifying account:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao verificar conta'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Usuário não autenticado'
        },
        { status: 401 }
      )
    }

    const { puuid, riotId, tagLine, region } = await request.json()

    // Get account info using PUUID
    const { response: account } = await ritoApi.Account.getByPUUID(
      puuid,
      region as RegionGroups
    )

    // Get summoner info using the correct region
    const { response: summoner } = await api.Summoner.getByPUUID(
      puuid,
      Regions.BRAZIL // Using BR1 since we're focusing on Brazilian players for now
    )

    try {
      // Atualiza o perfil com as informações do Riot ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          puuid,
          summoner_name: riotId,
          tag_line: tagLine,
          region,
          profile_icon_id: summoner.profileIconId,
          summoner_level: summoner.summonerLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error linking account:', updateError)
        return NextResponse.json(
          { message: 'Error linking account', error: updateError },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'Account linked successfully',
        puuid,
        region
      })
    } catch (error) {
      console.error('Error linking account:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Erro ao vincular conta'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error linking account:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao vincular conta'
      },
      { status: 500 }
    )
  }
}
