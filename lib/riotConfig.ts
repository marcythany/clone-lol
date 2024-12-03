import { Regions, RegionGroups, regionToRegionGroup } from 'twisted/dist/constants';

/**
 * Interface for the Riot configuration.
 */
export interface RiotConfig {
  summonerName: string;
  tagLine: string;
  region: Regions;
  regionGroup: RegionGroups;
  puuid?: string;
  apiKey?: string;
}

// This will be replaced with data from the database
export const defaultConfig: RiotConfig = {
  summonerName: process.env.RIOT_SUMMONER_NAME || '',
  tagLine: process.env.RIOT_TAG_LINE || '',
  region: (process.env.RIOT_REGION || 'BR1') as Regions,
  regionGroup: (process.env.RIOT_REGION_GROUP || 'AMERICAS') as RegionGroups,
  apiKey: process.env.RIOT_API_KEY
};

/**
 * Converts a region to its corresponding region group.
 * 
 * @param region The region to convert.
 * @returns The region group of the given region.
 */
export function getRegionGroup(region: Regions): RegionGroups {
  return regionToRegionGroup(region);
}

export { Regions };
