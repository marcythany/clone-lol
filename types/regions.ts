import { RegionGroups, Regions } from 'twisted/dist/constants'

export const REGION_GROUP_MAP: Record<RegionGroups, Regions[]> = {
  [RegionGroups.AMERICAS]: [
    Regions.BRAZIL,
    Regions.LAT_NORTH,
    Regions.LAT_SOUTH,
    Regions.AMERICA_NORTH,
  ],
  [RegionGroups.ASIA]: [
    Regions.KOREA,
    Regions.JAPAN,
  ],
  [RegionGroups.EUROPE]: [
    Regions.EU_WEST,
    Regions.EU_EAST,
    Regions.RUSSIA,
    Regions.TURKEY,
  ],
  [RegionGroups.SEA]: [
    Regions.OCEANIA,
    Regions.PHILIPPINES,
    Regions.SINGAPORE,
    Regions.TAIWAN,
    Regions.THAILAND,
    Regions.VIETNAM,
  ],
}

export const REGION_NAMES: Record<Regions, string> = {
  [Regions.BRAZIL]: 'Brasil',
  [Regions.LAT_NORTH]: 'América Latina Norte',
  [Regions.LAT_SOUTH]: 'América Latina Sul',
  [Regions.AMERICA_NORTH]: 'América do Norte',
  [Regions.KOREA]: 'Coreia',
  [Regions.JAPAN]: 'Japão',
  [Regions.EU_WEST]: 'Europa Ocidental',
  [Regions.EU_EAST]: 'Europa Oriental',
  [Regions.RUSSIA]: 'Rússia',
  [Regions.TURKEY]: 'Turquia',
  [Regions.OCEANIA]: 'Oceania',
  [Regions.PHILIPPINES]: 'Filipinas',
  [Regions.SINGAPORE]: 'Singapura',
  [Regions.TAIWAN]: 'Taiwan',
  [Regions.THAILAND]: 'Tailândia',
  [Regions.VIETNAM]: 'Vietnã',
  [Regions.MIDDLE_EAST]: '',
  [Regions.PBE]: ''
}

export function getDefaultRegion(regionGroup: RegionGroups): Regions {
  const regions = REGION_GROUP_MAP[regionGroup]
  return regions[0] // Retorna a primeira região do grupo
}

export function getRegionGroup(region: Regions): RegionGroups {
  for (const [group, regions] of Object.entries(REGION_GROUP_MAP)) {
    if (regions.includes(region)) {
      return group as RegionGroups
    }
  }
  return RegionGroups.AMERICAS // Fallback para AMERICAS
}

export function getRegionName(region: Regions): string {
  return REGION_NAMES[region]
}
