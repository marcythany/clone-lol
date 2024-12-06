import { LolApi, RiotApi, Constants } from 'twisted';

// Instância da API do LoL
export const  lolApi = new LolApi({
  key: process.env.RIOT_API_KEY || '',
  debug: {
    logTime: process.env.NODE_ENV === 'development',
    logUrls: process.env.NODE_ENV === 'development',
    logRatelimits: process.env.NODE_ENV === 'development'
  },
  rateLimitRetry: true,
  rateLimitRetryAttempts: 3
});

// Instância da API da Riot (para Account-V1)
export const  riotApi = new RiotApi({
  key: process.env.RIOT_API_KEY,
});

export const riotService = {
  async getAccountByRiotId(gameName: string, tagLine: string) {
    try {
      const { response: account } = await riotApi.Account.getByRiotId(
        gameName,
        tagLine,
        Constants.RegionGroups.AMERICAS
      );
      return account;
    } catch (error) {
      console.error('Erro ao buscar conta:', error);
      throw error;
    }
  },

  async getSummonerByPUUID(puuid: string, region = Constants.Regions.BRAZIL) {
    try {
      const { response: summoner } = await lolApi.Summoner.getByPUUID(puuid, region);
      return summoner;
    } catch (error) {
      console.error('Erro ao buscar invocador:', error);
      throw error;
    }
  },

  async getMatchHistory(puuid: string, region = Constants.Regions.BRAZIL, options = { count: 20 }) {
    try {
      const regionGroup = Constants.regionToRegionGroup(region);
      
      const { response } = await lolApi.MatchV5.list(
        puuid,
        regionGroup,
        options
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  },

  async getMatchDetails(matchId: string, region = Constants.Regions.BRAZIL) {
    try {
      const regionGroup = Constants.regionToRegionGroup(region);
      
      const { response } = await lolApi.MatchV5.get(
        matchId,
        regionGroup
      );
      return response;
    } catch (error) {
      console.error('Erro ao buscar detalhes da partida:', error);
      throw error;
    }
  }
}; 