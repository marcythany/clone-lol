import { lolApi, riotService } from '@/lib/riot/api';
import { Constants } from 'twisted';
type Regions = typeof Constants.Regions[keyof typeof Constants.Regions];

export class RiotApiService {
  async buscarPerfilCompleto(riotId: string, region: Regions = Constants.Regions.BRAZIL) {
    try {
      const [gameName, tagLine] = riotId.split('#');
      const regionGroup = Constants.regionToRegionGroup(region);
      
      // Busca conta usando o serviço existente
      const account = await riotService.getAccountByRiotId(gameName, tagLine);
      
      // Busca dados do invocador
      const summoner = await riotService.getSummonerByPUUID(
        account.puuid, 
        region
      );
      
      // Busca histórico de partidas
      const matchIds = await riotService.getMatchHistory(
        account.puuid,
        region,
        { count: 20 }
      );

      // Busca detalhes das últimas 5 partidas
      const matchDetails = await Promise.all(
        matchIds.slice(0, 5).map(matchId => 
          riotService.getMatchDetails(matchId, region)
        )
      );

      // Busca maestria de campeões
      const { response: championMastery } = await lolApi.Champion.masteryByPUUID(
        account.puuid,
        region
      );

      // Busca jogo ativo (se estiver em partida)
      const { response: activeGame } = await lolApi.SpectatorV5.activeGame(
        account.puuid,
        region
      );

      return {
        account,
        summoner,
        region,
        matchHistory: {
          ids: matchIds,
          details: matchDetails
        },
        championMastery,
        activeGame
      };
    } catch (error) {
      console.error('Erro ao buscar perfil completo:', error);
      throw error;
    }
  }

  async buscarStatusServidor(region: Regions = Constants.Regions.BRAZIL) {
    try {
      const { response: status } = await lolApi.StatusV4.get(region);
      return status;
    } catch (error) {
      console.error('Erro ao buscar status do servidor:', error);
      throw error;
    }
  }

  // Método auxiliar para listar todas as regiões disponíveis
  getRegioes() {
    return Object.entries(Constants.Regions).map(([key, value]) => ({
      id: value,
      nome: key
    }));
  }
}

export const riotApiService = new RiotApiService();
