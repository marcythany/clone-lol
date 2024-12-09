import {RitoApi} from "~/lib/riot/RiotApi"
import { saveRiotSummonerData } from '~/services/RiotApiService';
import { Regions } from 'twisted/dist/constants/regions';
import { ApiResponseDTO, ChampionMasteryDTO } from '~/types/twistedTypes';

export async function handleSummonerData(
  summonerName: string,
  region: Regions, // Usando o tipo Regions
  userId: string
) {
  const apiKey = process.env.RIOT_API_KEY; // Armazenando a chave da API
  if (!apiKey) {
    throw new Error('RIOT_API_KEY is not defined'); // Lançando um erro se a chave não estiver definida
  }
  const ritoApi = new RitoApi(apiKey); // Usando a chave da API garantida como string

  try {
    // Obtendo os dados do invocador
    const summonerData = await ritoApi.getSummonerByName(summonerName, region);

    // Obtendo a maestria de campeões do invocador usando PUUID
    const championMasteriesResponse: ApiResponseDTO<ChampionMasteryDTO[]> =
      await ritoApi.getChampionMasteryByPUUID(
        summonerData.puuid, // Utilizando o PUUID
        region
      );

    // Acessando o array de maestrias de campeões
    const championMasteries = championMasteriesResponse.response;

    // Calculando o total de pontos de maestria (somando os pontos de todos os campeões)
    const masteryScore = championMasteries.reduce(
      (total: number, mastery: ChampionMasteryDTO) =>
        total + mastery.championPoints, // Tipando 'total' e 'mastery'
      0
    );

    // Certifique-se de que as propriedades estão corretas e de acordo com o tipo da API
    const riotData = {
      summoner_name: summonerData.id, // Usando o nome do invocador
      tag_line: summonerData.summonerLevel.toString(), // Convertendo número para string
      region: region, // Passando a região diretamente
      profile_icon_id: summonerData.profileIconId, // Perfil do ícone
      summoner_level: summonerData.summonerLevel, // Nível do invocador
      mastery_score: masteryScore, // Usando o total de pontos de maestria
    };

    // Salve os dados no Supabase
    const result = await saveRiotSummonerData(riotData, userId);

    return result;
  } catch (error) {
    console.error('Erro ao salvar os dados do invocador no Supabase:', error);
    throw new Error('Failed to handle summoner data');
  }
}
