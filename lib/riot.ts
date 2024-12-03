import { RiotApi, LolApi } from 'twisted';
import { defaultConfig, RiotConfig } from './riotConfig';
import { RegionGroups, Regions, regionToRegionGroup } from 'twisted/dist/constants/regions';
import { Queues, Tiers, Divisions, Champions } from 'twisted/dist/constants';

function createRiotApi(config: Partial<RiotConfig> = {}) {
  const apiKey = config.apiKey || process.env.RIOT_API_KEY;
  if (!apiKey) {
    throw new Error('Riot API key not found');
  }
  return new RiotApi({ key: apiKey });
}

function createLolApi(config: Partial<RiotConfig> = {}) {
  const apiKey = config.apiKey || process.env.RIOT_API_KEY;
  if (!apiKey) {
    throw new Error('Riot API key not found');
  }
  return new LolApi({ key: apiKey });
}

// Helper function to get summoner data
export async function getSummonerData(config: Partial<RiotConfig> = defaultConfig) {
  const mergedConfig = { ...defaultConfig, ...config };
  const rApi = createRiotApi(mergedConfig);
  const api = createLolApi(mergedConfig);
  
  // If puuid is provided directly, use it
  const puuid = mergedConfig.puuid || (await rApi.Account.getByRiotId(
    mergedConfig.summonerName,
    mergedConfig.tagLine,
    regionToRegionGroup(mergedConfig.region as Regions)
  )).response.puuid;

  console.log('[getSummonerData] Getting summoner data for PUUID:', puuid);
  const summonerResponse = await api.Summoner.getByPUUID(puuid, mergedConfig.region);
  console.log('[getSummonerData] Summoner response:', summonerResponse.response);
  
  return {
    ...summonerResponse.response,
    summonerLevel: summonerResponse.response.summonerLevel,
    profileIconId: summonerResponse.response.profileIconId
  };
}

// Get champion mastery score
export async function getChampionScore(config: RiotConfig = defaultConfig) {
  const summoner = await getSummonerData(config);
  const api = createLolApi(config);
  console.log('[getChampionScore] Getting mastery score for summoner:', summoner);
  
  try {
    const mastery = await api.Champion.championsScore(summoner.puuid, config.region);
    const champions = await api.Champion.masteryByPUUID(summoner.puuid, config.region);
    
    console.log('[getChampionScore] Mastery score:', mastery);
    console.log('[getChampionScore] Champions mastery:', champions);
    
    return {
      total: mastery,
      champions: champions.response
    };
  } catch (error) {
    console.error('[getChampionScore] Error:', error);
    // Return default values if there's an error
    return {
      total: 0,
      champions: []
    };
  }
}

// Get ranked information
export async function getRankedInfo(config: RiotConfig = defaultConfig) {
  const summoner = await getSummonerData(config);
  const api = createLolApi(config);
  const ranked = await api.League.bySummoner(summoner.id, config.region);
  return ranked.response;
}

// Get challenges information
export async function getChallengesInfo(config: RiotConfig = defaultConfig) {
  const summoner = await getSummonerData(config);
  const api = createLolApi(config);
  const challenges = await api.Challenges.PlayerChallenges(summoner.puuid, config.region);
  return challenges.response;
}

// Get champion mastery details
export async function getChampionMastery(championId: number, config: RiotConfig = defaultConfig) {
  const summoner = await getSummonerData(config);
  const api = createLolApi(config);
  return await api.Champion.masteryByPUUIDChampion(summoner.puuid, championId, config.region);
}

// Get match history
export async function getMatchHistory(config: RiotConfig = defaultConfig, options?: { queue?: number, count?: number }) {
  const summoner = await getSummonerData(config);
  const api = createLolApi(config);
  const matchlist = await api.MatchV5.list(
    summoner.puuid,
    regionToRegionGroup(config.region as Regions),
    { queue: options?.queue, count: options?.count || 20 }
  );
  return matchlist;
}

// Get match details
export async function getMatchDetails(matchId: string, config: RiotConfig = defaultConfig) {
  const api = createLolApi(config);
  const match = await api.MatchV5.get(matchId, regionToRegionGroup(config.region as Regions));
  const timeline = await api.MatchV5.timeline(matchId, regionToRegionGroup(config.region as Regions));
  return { match: match.response, timeline: timeline.response };
}

// Utility functions for game data
export async function getGameData() {
  const api = createLolApi();
  const versions = await api.DataDragon.getVersions();
  const champions = await api.DataDragon.getChampion();
  const runes = await api.DataDragon.getRunesReforged();
  const maps = await api.DataDragon.getMaps();
  
  return {
    versions,
    champions: champions.data,
    runes,
    maps
  };
}

// Server status
export async function getServerStatus(config: RiotConfig = defaultConfig) {
  const api = createLolApi(config);
  return await api.StatusV4.get(config.region);
}

export {
  Regions,
  RegionGroups,
  Queues,
  Tiers,
  Divisions,
  Champions
};