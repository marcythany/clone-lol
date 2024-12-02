import { LolApi, RiotApi } from 'twisted';
import { RegionGroups } from 'twisted/dist/constants';

// Verificação de variáveis de ambiente
if (!process.env.NEXT_PUBLIC_RIOT_API_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_RIOT_API_KEY');
}

// Configuração das APIs
const config = {
  key: process.env.NEXT_PUBLIC_RIOT_API_KEY,
  debug: {
    logTime: process.env.NODE_ENV === 'development',
    logUrls: process.env.NODE_ENV === 'development',
    logRatelimit: process.env.NODE_ENV === 'development'
  },
  rateLimitRetry: true,
  rateLimitRetryAttempts: 1,
  concurrency: 5,
  cache: {
    cacheType: 'local',
    ttls: {
      byMethod: {
        ACCOUNT_V1: { // Account endpoints
          GET_BY_RIOT_ID: 3600, // 1 hora
          GET_BY_PUUID: 3600, // 1 hora
        },
        SUMMONER_V4: { // Summoner endpoints
          GET_BY_PUUID: 3600, // 1 hora
        },
        MATCH_V5: { // Match endpoints
          GET_MATCH_BY_ID: 86400, // 24 horas
          GET_MATCH_LIST: 300, // 5 minutos
        }
      },
    },
  },
};

// Instâncias das APIs
export const api = new LolApi(config);
export const ritoApi = new RiotApi(config);

// Constantes
export const DEFAULT_REGION = RegionGroups.AMERICAS;
export const DEFAULT_LOCALE = 'BR1';
export const RIOT_REDIRECT_URI = process.env.NEXT_PUBLIC_RIOT_REDIRECT_URI;
export const RIOT_CLIENT_SECRET = process.env.NEXT_PUBLIC_RIOT_CLIENT_SECRET;
