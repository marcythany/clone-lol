'use client'

import { useQuery } from '@tanstack/react-query'
import { 
  MAP_IDS,
  LOCAL_MAP_IMAGES,
  Champion,
  ProfileIcon,
  SummonerSpell,
  GameModeId,
  MapId,
  UIElementType
} from '@/types/datadragon'

const DDRAGON_BASE_URL = 'https://ddragon.leagueoflegends.com'

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

  // Base URLs for different types of assets
  const getBaseUrls = (version: string) => ({
    champion: `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion`,
    item: `https://ddragon.leagueoflegends.com/cdn/${version}/img/item`,
    profileicon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon`,
    spell: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell`,
    sprite: `https://ddragon.leagueoflegends.com/cdn/${version}/img/sprite`,
    map: `https://ddragon.leagueoflegends.com/cdn/${version}/img/map`,
    ui: `https://ddragon.leagueoflegends.com/cdn/${version}/img/ui`,
    data: `https://ddragon.leagueoflegends.com/cdn/${version}/data`,
    gamemode: `https://ddragon.leagueoflegends.com/cdn/img/map`,
  }) as const;

  // Função para buscar URL do ícone de perfil
  const getProfileIconUrl = (iconId: number) => {
    if (!version) return ''
    return `${getBaseUrls(version).profileicon}/${iconId}.png`
  }

  // Função para buscar URL do ícone de campeão
  const getChampionIconUrl = (championId: string) => {
    if (!version) return ''
    return `${getBaseUrls(version).champion}/${championId}.png`
  }

  // Função para buscar URL do ícone de item
  const getItemIconUrl = (itemId: number) => {
    if (!version) return ''
    return `${getBaseUrls(version).item}/${itemId}.png`
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

  // Get URL for a game mode image
  const getGameModeImageUrl = (gameModeId: GameModeId): string => {
    return LOCAL_MAP_IMAGES[gameModeId];
  }

  // Get URL for summoner spell image
  const getSummonerSpellImageUrl = (spellId: string): string => {
    if (!version) return '';
    return `${getBaseUrls(version).spell}/Summoner${spellId}.png`;
  }

  // Get URL for map image
  const getMapImageUrl = (mapId: MapId): string => {
    if (!version) return '';
    return `${getBaseUrls(version).map}/map${MAP_IDS[mapId]}.png`;
  }

  // Get URL for sprite image
  const getSpriteImageUrl = (spriteName: string): string => {
    if (!version) return '';
    return `${getBaseUrls(version).sprite}/${spriteName}.png`;
  }

  // Get URL for UI element image (using version 5.5.1 as it's the stable version for UI elements)
  const getUIElementImageUrl = (elementName: UIElementType): string => {
    return `https://ddragon.leagueoflegends.com/cdn/5.5.1/img/ui/${elementName}.png`;
  }

  // Get summoner spells data
  const getSummonerSpellsData = async (locale: string = 'en_US') => {
    if (!version) return null;
    const response = await fetch(`${getBaseUrls(version).data}/${locale}/summoner.json`);
    const data = await response.json();
    return data.data as Record<string, SummonerSpell>;
  }

  return {
    version,
    getProfileIconUrl,
    getChampionIconUrl,
    getItemIconUrl,
    getChampionData,
    getAllChampions,
    getAllProfileIcons,
    getGameModeImageUrl,
    getSummonerSpellImageUrl,
    getMapImageUrl,
    getSpriteImageUrl,
    getUIElementImageUrl,
    getSummonerSpellsData,
  }
}
