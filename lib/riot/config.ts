import { env } from 'process';
import { LolApi } from 'twisted';

const apiKey = env.NEXT_PUBLIC_RIOT_API_KEY;

export const apiConfig = new LolApi({
  rateLimitRetry: true,
  rateLimitRetryAttempts: 1,
  concurrency: undefined,
  key: apiKey, // A chave da API é fornecida diretamente do ambiente
  debug: {
    logTime: true,
    logUrls: true,
    logRatelimits: true,
  },
});

// Função para validar e estruturar as informações do usuário
export const prepareConfig = (
  summonerName: string,
  tagLine: string,
  region: string
) => {
  if (!summonerName || !tagLine || !region) {
    throw new Error(
      'Por favor, forneça todos os parâmetros: summonerName, tagLine e region.'
    );
  }

  return {
    summonerName: summonerName.trim(),
    tagLine: tagLine.trim(),
    region: region.toUpperCase(),
  };
};
