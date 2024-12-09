// services/RiotApiService.ts
import { createClient } from '~/lib/supabase/client';
import { RitoApi } from '~/lib/riot/RiotApi';
import { RiotSummonerData } from '~/types/riot';

const apiKey = process.env.NEXT_PUBLIC_RIOT_API_KEY;
if (!apiKey) {
  throw new Error(
    'RIOT_API_KEY is not defined. Check your environment variables.'
  );
}

const ritoApi = new RitoApi(apiKey);

export const RiotApiService = {
  async getProfileData(userId: string): Promise<RiotSummonerData | null> {
    const { data: riot_profiles } = await createClient()
      .from('riot_profiles')
      .select(
        'puuid, summoner_name, tag_line, region, profile_icon_id, summoner_level, id, leagues, equipped_title, mastery_score, created_at, updated_at, equipped_tokens, available_tokens, equipped_trophies, available_trophies'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (!riot_profiles) return null;

    return {
      summoner: riot_profiles.summoner_name,
      summonerName: riot_profiles.summoner_name,
      tagLine: riot_profiles.tag_line,
      id: riot_profiles.id,
      puuid: riot_profiles.puuid,
      summoner_level: riot_profiles.summoner_level,
      profile_icon_id: riot_profiles.profile_icon_id,
      region: riot_profiles.region,
      user_id: userId,
      equipped_title: riot_profiles.equipped_title ?? 0,
      mastery_score: riot_profiles.mastery_score ?? 0,
      created_at: riot_profiles.created_at ?? '',
      updated_at: riot_profiles.updated_at ?? '',
      equipped_tokens: riot_profiles.equipped_tokens ?? [],
      available_tokens: riot_profiles.available_tokens ?? [],
      equipped_trophies: riot_profiles.equipped_trophies ?? [],
      available_trophies: riot_profiles.available_trophies ?? [],
      leagues: riot_profiles.leagues ?? [],
    };
  },

  async linkAccount() {
    const {
      data: { user },
    } = await createClient().auth.getUser();
    if (!user) throw new Error('User not authenticated.');

    // Obtém informações do invocador, maestria e rank
    const summonerInfo = await ritoApi.getSummonerInfo(
      user.user_metadata.summonerName, // Nome do invocador
      user.user_metadata.tagLine // Tagline
    );

    // Obtém informações de maestria para todos os campeões do jogador
    const mastery = await ritoApi.getMasteryData(
      summonerInfo.puuid, // PUUID do jogador
      summonerInfo.region // Região do jogador
    );

    // Obtém informações de rank
    const rankedInfo = await ritoApi.getRankedData(
      summonerInfo.puuid,
      summonerInfo.region
    );

    // Calcula a pontuação total de maestria
    const masteryScore = mastery.reduce(
      (total, champ) => total + champ.championPoints, // Soma os pontos de maestria
      0
    );

    const updatedProfile: RiotSummonerData = {
      summoner: summonerInfo.summonerName,
      summonerName: summonerInfo.summonerName,
      tagLine: '',
      id: summonerInfo.id,
      puuid: summonerInfo.puuid,
      summoner_level: summonerInfo.summonerLevel,
      profile_icon_id: summonerInfo.profileIconId,
      region: summonerInfo.region,
      user_id: user.id,
      equipped_title: 0,
      mastery_score: masteryScore,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      equipped_tokens: [],
      available_tokens: [],
      equipped_trophies: [],
      available_trophies: [],
      leagues: rankedInfo.map((league) => ({
        queueType: league.queueType,
        tier: league.tier,
        rank: league.rank,
        leaguePoints: league.leaguePoints,
        wins: league.wins,
        losses: league.losses,
      })),
    };

    await createClient()
      .from('riot_profiles')
      .upsert(updatedProfile, { onConflict: 'id' });
  },
};
