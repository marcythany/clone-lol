'use client'

import { useQuery } from '@tanstack/react-query'

const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com'

interface DataDragonVersion {
  version: string
}

interface ProfileIcon {
  id: number
  image: {
    full: string
  }
}

interface Champion {
  id: string
  key: string
  name: string
  title: string
  image: {
    full: string
    sprite: string
    group: string
  }
}

export function useDataDragon() {
  // Busca a última versão do DataDragon
  const { data: version } = useQuery({
    queryKey: ['ddragon', 'version'],
    queryFn: async () => {
      const response = await fetch(`${DDRAGON_BASE_URL}/api/versions.json`)
      const versions: string[] = await response.json()
      return versions[0] // Pega a versão mais recente
    },
  })

  // Função para buscar URL do ícone de perfil
  const getProfileIconUrl = (iconId: number) => {
    if (!version) return ''
    return `${DDRAGON_BASE_URL}/cdn/${version}/img/profileicon/${iconId}.png`
  }

  // Função para buscar URL do ícone de campeão
  const getChampionIconUrl = (championId: string) => {
    if (!version) return ''
    return `${DDRAGON_BASE_URL}/cdn/${version}/img/champion/${championId}.png`
  }

  // Função para buscar URL do ícone de item
  const getItemIconUrl = (itemId: number) => {
    if (!version) return ''
    return `${DDRAGON_BASE_URL}/cdn/${version}/img/item/${itemId}.png`
  }

  // Função para buscar dados de um campeão específico
  const getChampionData = async (championId: string) => {
    if (!version) return null
    const response = await fetch(
      `${DDRAGON_BASE_URL}/cdn/${version}/data/pt_BR/champion/${championId}.json`
    )
    const data = await response.json()
    return data.data[championId]
  }

  // Função para buscar todos os campeões
  const getAllChampions = async () => {
    if (!version) return null
    const response = await fetch(
      `${DDRAGON_BASE_URL}/cdn/${version}/data/pt_BR/champion.json`
    )
    const data = await response.json()
    return data.data as Record<string, Champion>
  }

  // Função para buscar todos os ícones de perfil
  const getAllProfileIcons = async () => {
    if (!version) return null
    const response = await fetch(
      `${DDRAGON_BASE_URL}/cdn/${version}/data/pt_BR/profileicon.json`
    )
    const data = await response.json()
    return data.data as Record<string, ProfileIcon>
  }

  return {
    version,
    getProfileIconUrl,
    getChampionIconUrl,
    getItemIconUrl,
    getChampionData,
    getAllChampions,
    getAllProfileIcons,
  }
}
