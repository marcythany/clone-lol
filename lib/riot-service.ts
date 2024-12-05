import { LolApi, RiotApi } from 'twisted';
import { Regions, RegionGroups } from 'twisted/dist/constants';
import {
  SummonerData,
  ChampionInfo,
  RankedInfo,
  ChallengesInfo,
  MatchInfo,
  MatchTimelineInfo
} from '@/types/riot';

if (!process.env.RIOT_API_KEY) {
  throw new Error('RIOT_API_KEY environment variable is not set');
}

const config = {
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3,
  concurrency: 1,
  debug: {
    logTime: process.env.NODE_ENV === 'development',
    logUrls: process.env.NODE_ENV === 'development',
    logRateLimit: process.env.NODE_ENV === 'development',
  },
  key: process.env.RIOT_API_KEY,
};

const lolApi = new LolApi(config);
const riotApi = new RiotApi(config);

export class RiotService {
  private static async handleApiCall<T>(
    apiCall: () => Promise<{ response: T }>,
    errorMessage: string
  ): Promise<{ response: T }> {
    try {
      const { response } = await apiCall();
      return { response };
    } catch (error: any) {
      console.error(`${errorMessage}: ${error.message}`, {
        status: error.status,
        headers: error.headers,
      });
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  private static transformSummonerDTO(dto: any): SummonerData {
    return {
      id: dto.id,
      accountId: dto.accountId,
      puuid: dto.puuid,
      name: dto.name || dto.gameName || '',
      profileIconId: dto.profileIconId,
      revisionDate: dto.revisionDate,
      summonerLevel: dto.summonerLevel
    };
  }

  private static transformChampionDTO(dto: any): ChampionInfo {
    return {
      id: dto.championId.toString(),
      key: dto.championId.toString(),
      name: dto.championName || dto.championId.toString(),
      title: dto.championLevel ? `Mastery Level ${dto.championLevel}` : '',
      image: {
        full: `${dto.championId}.png`,
        sprite: 'champion0.png',
        group: 'champion'
      }
    };
  }

  static async getSummonerByAccountID(accountID: string, region: Regions): Promise<{ response: SummonerData }> {
    const result = await this.handleApiCall(
      () => lolApi.Summoner.getByAccountID(accountID, region),
      'Error fetching summoner by accountID'
    );
    return { response: this.transformSummonerDTO(result.response) };
  }

  static async getSummonerById(summonerId: string, region: Regions): Promise<{ response: SummonerData }> {
    const result = await this.handleApiCall(
      () => lolApi.Summoner.getById(summonerId, region),
      'Error fetching summoner by ID'
    );
    return { response: this.transformSummonerDTO(result.response) };
  }

  static async getSummonerByPUUID(puuid: string, region: Regions): Promise<{ response: SummonerData }> {
    const result = await this.handleApiCall(
      () => lolApi.Summoner.getByPUUID(puuid, region),
      'Error fetching summoner by PUUID'
    );
    return { response: this.transformSummonerDTO(result.response) };
  }

  static async getAccountByRiotId(
    gameName: string,
    tagLine: string,
    region: RegionGroups
  ): Promise<{ response: { puuid: string; gameName: string; tagLine: string } }> {
    const result = await this.handleApiCall(
      () => riotApi.Account.getByRiotId(gameName, tagLine, region),
      'Error fetching account by Riot ID'
    );
    return { 
      response: {
        puuid: result.response.puuid,
        gameName: result.response.gameName,
        tagLine: result.response.tagLine
      }
    };
  }

  static async getChampionMasteries(puuid: string, region: Regions): Promise<{ response: ChampionInfo[] }> {
    const result = await this.handleApiCall(
      () => lolApi.Champion.masteryByPUUID(puuid, region),
      'Error fetching champion masteries'
    );
    return { response: result.response.map(dto => this.transformChampionDTO(dto)) };
  }

  static async getChampionMasteryScore(puuid: string, region: Regions): Promise<{ response: number }> {
    return this.handleApiCall(
      async () => {
        const { score } = await lolApi.Champion.championsScore(puuid, region);
        return { response: score };
      },
      'Error fetching champion mastery score'
    );
  }

  static async getCurrentGameInfo(puuid: string, region: Regions): Promise<{ response: ChampionInfo[] }> {
    try {
      const apiResponse = await lolApi.SpectatorV5.activeGame(puuid, region);
      
      // If player is not in game, SpectatorV5 returns SpectatorNotAvailableDTO
      if (!('response' in apiResponse)) {
        return { response: [] };
      }

      // Transform the response to match ChampionInfo[]
      const championInfoList: ChampionInfo[] = apiResponse.response.participants.map((participant: any) => ({
        id: participant.championId.toString(),
        key: participant.championId.toString(),
        name: participant.championName || participant.championId.toString(),
        title: participant.championName || participant.championId.toString(),
        image: {
          full: `${participant.championName || participant.championId}.png`,
          sprite: 'champion0.png',
          group: 'champion'
        }
      }));

      return { response: championInfoList };
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        // Return empty array if summoner is not in game
        return { response: [] };
      }
      throw error;
    }
  }

  static async getChampionRotation(
    region: Regions
  ): Promise<{ response: { freeChampionIds: number[]; freeChampionIdsForNewPlayers: number[] } }> {
    const result = await this.handleApiCall(
      () => lolApi.Champion.rotation(region),
      'Error fetching champion rotation'
    );

    // Transform the response to match the expected type
    return {
      response: {
        freeChampionIds: result.response.freeChampionIds || [],
        freeChampionIdsForNewPlayers: result.response.freeChampionIdsForNewPlayers || []
      }
    };
  }

  static async getRankedInfo(summonerId: string, region: Regions): Promise<{ response: RankedInfo[] }> {
    return this.handleApiCall(
      () => lolApi.League.bySummoner(summonerId, region),
      'Error fetching ranked info'
    );
  }

  static async getChallengesInfo(puuid: string, region: Regions): Promise<{ response: ChallengesInfo }> {
    return this.handleApiCall(
      () => lolApi.Challenges.PlayerChallenges(puuid, region),
      'Error fetching challenges info'
    );
  }

  static async getMatchHistory(
    puuid: string,
    region: RegionGroups,
    options: { 
      start?: number; 
      count?: number; 
      queue?: number; 
      type?: string;
      startTime?: number;
      endTime?: number;
    } = {}
  ): Promise<{ response: string[] }> {
    return this.handleApiCall(
      () => lolApi.MatchV5.list(puuid, region, options),
      'Error fetching match history'
    );
  }

  static async getMatchDetails(matchId: string, region: RegionGroups): Promise<{ response: MatchInfo }> {
    return this.handleApiCall(
      () => lolApi.MatchV5.get(matchId, region),
      'Error fetching match details'
    );
  }

  static async getMatchTimeline(matchId: string, region: RegionGroups): Promise<{ response: MatchTimelineInfo }> {
    return this.handleApiCall(
      () => lolApi.MatchV5.timeline(matchId, region),
      'Error fetching match timeline'
    );
  }

  static async getChallengerLeague(queue: string, region: Regions): Promise<{ response: RankedInfo[] }> {
    return this.handleApiCall(
      () => lolApi.League.getChallengerLeaguesByQueue(queue, region),
      'Error fetching challenger league'
    );
  }

  static async getGrandmasterLeague(queue: string, region: Regions): Promise<{ response: RankedInfo[] }> {
    return this.handleApiCall(
      () => lolApi.League.getGrandMasterLeagueByQueue(queue, region),
      'Error fetching grandmaster league'
    );
  }

  static async getMasterLeague(queue: string, region: Regions): Promise<{ response: RankedInfo[] }> {
    return this.handleApiCall(
      () => lolApi.League.getMasterLeagueByQueue(queue, region),
      'Error fetching master league'
    );
  }

  static async getFeaturedGames(region: Regions): Promise<{ response: any }> {
    return this.handleApiCall(
      () => lolApi.SpectatorV5.featuredGames(region),
      'Error fetching featured games'
    );
  }

  static async getServerStatus(region: Regions): Promise<{ response: any }> {
    return this.handleApiCall(
      async () => {
        const status = await lolApi.StatusV4.get(region);
        return { response: status };
      },
      'Error fetching server status'
    );
  }
}

export const REGIONS = Regions;
export const REGION_GROUPS = RegionGroups;
