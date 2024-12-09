import { LolApi, Constants, Dto, RiotApi } from 'twisted';
import { prepareConfig } from './config';
import { Queues } from 'twisted/dist/constants/queues';
import { RegionGroups, Regions } from 'twisted/dist/constants/regions';
import { LeaderboardDTO } from 'twisted/dist/models-dto/challenges/leaderboard.dto';
import { ApiResponseDTO } from 'twisted/dist/models-dto/api-response/api-response';
import { Tiers } from 'twisted/dist/constants/tier';
import { Divisions } from 'twisted/dist/constants/division';
import { regionToRegionGroup } from 'twisted/dist/constants/regions';
import { Levels } from 'twisted/dist/constants/levels';
import axios from 'axios';
import { ChampionData } from '~/types/riot';

export class RitoApi {
  private rApi: RiotApi;
  private api: LolApi;
  private dto: typeof Dto;
  private locale: string;

  constructor(apiKey: string, locale: string = 'pt_BR') {
    if (!apiKey) {
      throw new Error('API key is undefined. Please check your configuration.');
    }
    this.rApi = new RiotApi(apiKey);
    this.api = new LolApi(apiKey);
    this.dto = Dto;
    this.locale = locale;
  }

  private honorImages = {
    level1: 'honor_1_unlock.png',
    level5: 'honor_5.png',
    level2: Array.from({ length: 3 }, (_, i) => `honor_2-${i + 1}.png`),
    level3: Array.from({ length: 3 }, (_, i) => `honor_3-${i + 1}.png`),
    level4: Array.from({ length: 3 }, (_, i) => `honor_4-${i + 1}.png`),
    intro: ['honor_2_intro.png', 'honor_3_intro.png', 'honor_4_intro.png'],
  };

  private rankedIcons = [
    'unranked.svg',
    'iron.svg',
    'bronze.svg',
    'silver.svg',
    'gold.svg',
    'platinum.svg',
    'emerald.svg',
    'diamond.svg',
    'master.svg',
    'grandmaster.svg',
    'challenger.svg',
  ];

  private tokenImages = [
    'iron.png',
    'bronze.png',
    'silver.png',
    'gold.png',
    'platinum.png',
    'diamond.png',
    'master.png',
    'grandmaster.png',
    'challenger.png',
  ];

  // Função para obter a versão do Data Dragon
  async getDataDragonVersion(): Promise<string[]> {
    return this.api.DataDragon.getVersions();
  }

  // Função para obter as imagens de honor
  async getHonorIcons(): Promise<string[]> {
    const baseUrl =
      'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/rewards/honor/milestone/images/';
    return [
      `${baseUrl}${this.honorImages.level1}`,
      `${baseUrl}${this.honorImages.level5}`,
      ...this.honorImages.level2.map((image) => `${baseUrl}${image}`),
      ...this.honorImages.level3.map((image) => `${baseUrl}${image}`),
      ...this.honorImages.level4.map((image) => `${baseUrl}${image}`),
      ...this.honorImages.intro.map((image) => `${baseUrl}${image}`),
    ];
  }

  // Função para obter ícones de rankeada (do Unranked até Challenger)
  async getRankedIcons(): Promise<string[]> {
    const baseUrl =
      'https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests/';
    return this.rankedIcons.map((icon) => `${baseUrl}${icon}`);
  }

  // Função para obter campeões do Data Dragon
  async getDataDragonChampions(): Promise<any> {
    try {
      // Obtemos a versão mais recente do Data Dragon
      const versions = await this.api.DataDragon.getVersions();
      const latestVersion = versions[0]; // Usamos a versão mais recente

      // Obtemos todos os campeões dessa versão
      return await this.api.DataDragon.getChampion();
    } catch (error) {
      console.error('Erro ao obter campeões do Data Dragon:', error);
      throw new Error('Failed to fetch champions');
    }
  }

  // Função para obter itens do Data Dragon com idioma dinâmico
  async getDataDragonItems(): Promise<any> {
    try {
      // Obtemos a versão mais recente do Data Dragon
      const versions = await this.api.DataDragon.getVersions();
      const latestVersion = versions[0]; // Usamos a versão mais recente

      // Construímos a URL com o idioma dinâmico
      const locale = this.getLocale();
      const url = `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/${locale}/item.json`;

      // Fazemos a requisição e retornamos os itens
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar itens do Data Dragon:', error);
      throw new Error('Failed to fetch items');
    }
  }

  // Função para obter runas do Data Dragon com idioma dinâmico
  async getDataDragonRunes(): Promise<any> {
    try {
      return await this.api.DataDragon.getRunesReforged(); // Método Twisted para obter runas
    } catch (error) {
      console.error('Erro ao obter runas do Data Dragon:', error);
      throw new Error('Failed to fetch runes');
    }
  }

  // Função para obter o idioma atual
  private getLocale(): string {
    // Garantir que a localidade seja correta
    const validLocales = ['pt_BR', 'en_US'];
    if (!validLocales.includes(this.locale)) {
      throw new Error(
        `Invalid locale: ${this.locale}. Valid locales are: pt_BR, en_US.`
      );
    }
    return this.locale;
  }

  // Função para validar a resposta da API
  private validateApiResponse<T>(
    response: T | null | undefined,
    expectedType: string
  ): T {
    if (!response) {
      throw new Error(
        `API response is null or undefined. Expected: ${expectedType}`
      );
    }
    if (typeof response !== 'object') {
      throw new Error(
        `Invalid API response type. Expected an object, but received: ${typeof response}`
      );
    }
    return response;
  }

  // Função para buscar dados do Challenger League por fila
  async getChallengerLeaguesByQueue(queue: Queues, region: Regions) {
    const response = await this.api.League.getChallengerLeaguesByQueue(
      queue,
      region
    );
    return this.validateApiResponse(response, 'Challenger League data');
  }

  // Fetch Grandmaster League data by queue
  async getGrandMasterLeagueByQueue(queue: Queues, region: Regions) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.League.getGrandMasterLeagueByQueue(
      queue,
      validRegion
    );
    return this.validateApiResponse(response, 'Grandmaster League data');
  }

  // Fetch Master League data by queue
  async getMasterLeagueByQueue(queue: Queues, region: Regions) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.League.getMasterLeagueByQueue(
      queue,
      validRegion
    );
    return this.validateApiResponse(response, 'Master League data');
  }

  // Fetch player challenges by PUUID
  async getPlayerChallenges(puuid: string, region: Regions) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.Challenges.PlayerChallenges(
      puuid,
      validRegion
    );
    return this.validateApiResponse(response, 'Player challenges data');
  }

  // Função para buscar informações de títulos e imagens de tokens
  async getTitlesAndTokenImages(
    puuid: string,
    region: Regions
  ): Promise<string[]> {
    const challenges = await this.getPlayerChallenges(puuid, region);
    const tokenImages: string[] = [];

    // Dados de tokens (isso pode ser carregado diretamente ou de um arquivo similar ao challenges.json)
    const tokenData = await this.getTokenData(); // Função para buscar os dados dos tokens

    // Verificando os títulos e extraindo o ícone do token associado
    Object.values(challenges).forEach((title: any) => {
      const tokenId = title.itemId; // Obtendo o itemId do título

      // Verificar se o tokenId existe no tokenData
      const token = tokenData.find((item: any) => item.id === tokenId); // Aqui estamos procurando o token no arquivo

      if (token) {
        // Montando a URL da imagem com o tokenId dinâmico
        const tokenImageUrl = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/challenges/config/${tokenId}/tokens/${token.imageName}`;
        tokenImages.push(tokenImageUrl);
      }
    });

    return tokenImages;
  }

  // Função para buscar os dados dos tokens
  private async getTokenData() {
    const tokenUrl =
      this.getLocale() === 'pt_BR'
        ? `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/pt_br/v1/challenges.json`
        : 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/challenges.json';
    const response = await axios.get(tokenUrl);
    return response.data; // Retorna os dados do token
  }

  // Função para Icone de pefil de invocador
  async getProfileIcon(profileIconId: number) {
    return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${profileIconId}.png`;
  }

  // Fetch leaderboard for a specific challenge
  async getLeaderboards(
    challengeId: string | number,
    level: Levels | string,
    region: Regions
  ): Promise<LeaderboardDTO.Leaderboard[]> {
    const numericChallengeId =
      typeof challengeId === 'string' ? Number(challengeId) : challengeId;

    if (isNaN(numericChallengeId)) {
      throw new Error(
        `Invalid challengeId: ${challengeId}. It must be a valid number.`
      );
    }

    const validLevel = Object.values(Levels).includes(level as Levels)
      ? (level as Levels)
      : undefined;

    if (!validLevel) {
      throw new Error(
        `Invalid level: ${level}. It must be one of the valid Levels: ${Object.values(Levels).join(', ')}`
      );
    }

    try {
      const { response }: ApiResponseDTO<LeaderboardDTO.Leaderboard[]> =
        await this.api.Challenges.Leaderboards(
          numericChallengeId,
          validLevel,
          region
        );

      // Validar a resposta
      return this.validateApiResponse(response, 'Leaderboard data');
    } catch (error) {
      console.error(
        `Failed to fetch leaderboards for challengeId ${numericChallengeId}:`,
        error
      );
      throw new Error('Failed to fetch leaderboards');
    }
  }

  // Fetch champion mastery by PUUID
  async getChampionMasteryByPUUID(puuid: string, region: Regions) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.Champion.masteryByPUUID(puuid, validRegion);
    return this.validateApiResponse(response, 'Champion mastery data');
  }

  // Fetch champion mastery by PUUID and champion ID
  async getChampionMasteryByPUUIDChampion(
    puuid: string,
    championId: number,
    region: Regions
  ) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.Champion.masteryByPUUIDChampion(
      puuid,
      championId,
      validRegion
    );
    return this.validateApiResponse(response, 'Champion mastery by ID data');
  }

  // Fetch current champion rotation
  async getChampionRotation(region: Regions) {
    const validRegion = this.validateRegion(region);
    const response = await this.api.Champion.rotation(validRegion);
    return this.validateApiResponse(response, 'Champion rotation data');
  }

  // Função para buscar informações do summoner por nome
  async getSummonerByName(summonerName: string, region: Regions) {
    const { summonerName: validatedSummonerName, region: validatedRegion } =
      prepareConfig(summonerName, '', region);

    // Verificando se validatedRegion é válido
    if (!(validatedRegion in Regions)) {
      throw new Error(`Invalid region: ${validatedRegion}`);
    }

    const regionEnum = validatedRegion as Regions;

    try {
      const { response } = await this.api.Summoner.getByAccountID(
        validatedSummonerName,
        regionEnum
      );
      return this.validateApiResponse(response, 'Summoner data');
    } catch (error) {
      console.error('Erro ao buscar Summoner por nome:', error);
      throw new Error('Failed to fetch Summoner by name.');
    }
  }

  // Fetch summoner by Riot ID
  async getSummonerByRiotId(
    summonerName: string,
    tagLine: string,
    region: Regions
  ) {
    const {
      summonerName: validatedSummonerName,
      tagLine: validatedTagLine,
      region: validatedRegion,
    } = prepareConfig(summonerName, tagLine, region);
  }

  // Método para validar a região
  validateRegion(region: string): Regions {
    // Obtém todas as regiões válidas do enum Regions
    const validRegions = Object.values(Regions);

    // Verifica se a região fornecida é válida
    if (validRegions.includes(region as Regions)) {
      return region as Regions; // Retorna a região validada
    }

    // Lança um erro caso a região não seja válida
    throw new Error(`Região inválida: ${region}`);
  }

  // Método para buscar informações de invocador pelo Riot ID
  async fetchSummonerByRiotId(
    validatedSummonerName: string,
    region: string
  ): Promise<any> {
    // Valida a região antes de usá-la
    const regionEnum = this.validateRegion(region);

    try {
      // Chama a API para obter informações do invocador
      const { response } = await this.api.Summoner.getByAccountID(
        validatedSummonerName,
        regionEnum
      );

      // Valida a resposta da API e retorna os dados do invocador
      return this.validateApiResponse(response, 'Summoner data');
    } catch (error) {
      console.error('Erro ao buscar Summoner por Riot ID:', error);
      throw new Error('Failed to fetch Summoner by Riot ID.');
    }
  }

  // Obtém informações do invocador pelo nome
  async getSummonerInfo(summonerName: string, tagLine: string) {
    const validRegion = this.validateRegion(tagLine); // Valida a região com o tagLine
    try {
      // Supondo que você tenha um método para obter as informações do invocador
      const { response } = await this.api.Summoner.getByAccountID(
        summonerName,
        validRegion
      );

      // Retorna os dados do invocador após a chamada à API
      return {
        summonerName,
        tagLine,
        id: response.id, // ID do invocador
        puuid: response.puuid, // PUUID do invocador
        summonerLevel: response.summonerLevel, // Nível do invocador
        profileIconId: response.profileIconId, // Ícone do perfil
        region: validRegion, // Região validada
      };
    } catch (error) {
      console.error('Erro ao obter informações do invocador:', error);
      throw new Error('Failed to fetch summoner information.');
    }
  }

  // Função para obter dados de partidas do summoner
  async getMatchHistory(
    puuid: string,
    region: RegionGroups,
    options?: { count: number }
  ): Promise<string[]> {
    const { response } = await this.api.MatchV5.list(puuid, region, options);
    return this.validateApiResponse(response, 'Match history data');
  }

  // Função para obter detalhes de uma partida
  async getMatchDetails(matchId: string, region: RegionGroups): Promise<any> {
    const { response } = await this.api.MatchV5.get(matchId, region);
    return this.validateApiResponse(response, 'Match details data');
  }

  // Função para obter informações ranqueadas do summoner por nome
  async getRankedInfo(summonerName: string, region: Regions) {
    const { summonerName: validatedSummonerName, region: validatedRegion } =
      prepareConfig(summonerName, '', region);

    if (!(validatedRegion in Regions)) {
      throw new Error(`Invalid region: ${validatedRegion}`);
    }

    const regionEnum = validatedRegion as Regions;

    try {
      const summoner = await this.getSummonerByName(
        validatedSummonerName,
        regionEnum
      );
      const { response: rankedInfo } = await this.api.League.bySummoner(
        summoner.id,
        regionEnum
      );

      const rankedDetails = rankedInfo.map((info) => {
        const tier = Tiers[info.tier as keyof typeof Tiers];
        const division = Divisions[info.rank as keyof typeof Divisions];
        return { tier, division, leaguePoints: info.leaguePoints };
      });

      return rankedDetails;
    } catch (error) {
      console.error('Erro ao buscar ranked info:', error);
      throw new Error('Failed to fetch ranked info.');
    }
  }

  async getChampionListDataDragon(): Promise<{
    data: Record<string, ChampionData>;
  }> {
    const version = (await this.getDataDragonVersion())[0]; // Obtém a versão mais recente
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${this.getLocale()}/champion.json`;

    try {
      const response = await axios.get(url);
      return this.validateApiResponse(response.data, 'Champion list data');
    } catch (error) {
      console.error(
        'Erro ao buscar a lista de campeões do Data Dragon:',
        error
      );
      throw new Error('Failed to fetch champion list');
    }
  }

  // Método para obter todas as regiões disponíveis no enum Regions
  async getRegioes(): Promise<Regions[]> {
    return Object.values(Regions); // Retorna um array com todas as regiões definidas no enum
  }

  fetchSummonerData = async (summonerName: string, region: string) => {
    const validRegion = this.validateRegion(region);
    const summonerResponse = await this.api.Summoner.getByAccountID(
      summonerName,
      validRegion
    );
    const summonerInfo = this.validateApiResponse(
      summonerResponse.response,
      'Summoner data'
    );

    // Fetch tag line using Account-V1 API
    const regionGroup = regionToRegionGroup(validRegion);
    const accountResponse = await this.rApi.Account.getByPUUID(
      summonerInfo.puuid,
      regionGroup
    );

    const mastery = await this.getChampionMasteryByPUUID(
      summonerInfo.puuid,
      validRegion
    );

    return {
      summoner: {
        ...summonerInfo,
        tag_line: accountResponse.response.tagLine,
      },
      mastery,
    };
  };

  // Função para buscar a lista de campeões e obter o ID de um campeão específico
  async getChampionIdByName(championName: string): Promise<number | null> {
    const championList = await this.getChampionListDataDragon();
    const championData = Object.values(championList.data).find(
      (champion) => champion.name.toLowerCase() === championName.toLowerCase()
    );
    return championData ? Number(championData.key) : null;
  }

  // Obtém informações de maestria de um jogador para um campeão específico usando o PUUID e ChampionId
  async getMasteryData(puuid: string, region: Regions) {
    const validRegion = this.validateRegion(region);
    try {
      // Usar o método correto para obter dados de todos os campeões
      const { response: masteryData } = await this.api.Champion.masteryByPUUID(
        puuid,
        validRegion
      );
      return masteryData; // Retorna array de ChampionMasteryDTO
    } catch (error) {
      console.error('Erro ao obter informações de maestria:', error);
      throw new Error('Failed to fetch mastery data.');
    }
  }

  // Obtém dados ranqueados do invocador usando o ID do invocador
  async getRankedData(summonerId: string, region: Regions) {
    try {
      const { response: rankedData } = await this.api.League.bySummoner(
        summonerId,
        region
      );
      return rankedData;
    } catch (error) {
      console.error('Erro ao obter informações ranqueadas:', error);
      throw new Error('Failed to fetch ranked data.');
    }
  }
}
