import { RegionGroups, Regions } from 'twisted/dist/constants'
import { getDefaultRegion } from '@/types/regions'

// Tipos de resposta
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Funções de API
export async function verifyRiotAccount(riotId: string, tagLine: string, region: RegionGroups): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/riot/verify-account?riotId=${riotId}&tagLine=${tagLine}&region=${region}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message)
    }

    return {
      success: true,
      data: {
        puuid: data.puuid
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar conta'
    }
  }
}

export async function getSummonerByPuuid(puuid: string, region: RegionGroups): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/riot/summoner/${puuid}?region=${region}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message)
    }

    return {
      success: true,
      data: data
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar invocador'
    }
  }
}
