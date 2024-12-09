import { Card, CardHeader, CardTitle, CardContent } from 'components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { RiotApiService } from '~/services/RiotApiService';
import { RitoApi } from '~/lib/riot/RiotApi';
import { useEffect, useState } from 'react';
import { RiotSummonerData } from '~/types/riot';
import { Regions } from 'twisted/dist/constants/regions';

interface SummonerProfileProps {
  summonerData: RiotSummonerData;
  leagues: {
    queueType: string;
    tier: string;
    rank: string;
    leaguePoints: number;
    wins: number;
    losses: number;
  }[];
}

export const SummonerProfile = ({
  summonerData,
  leagues,
}: SummonerProfileProps) => {
  const ritoApi = new RitoApi(
    summonerData.puuid,
    process.env.NEXT_PUBLIC_RIOT_API_KEY!
  );

  const [profileIconUrl, setProfileIconUrl] = useState<string | null>(null);
  const [summonerInfo, setSummonerInfo] = useState<RiotSummonerData | null>(
    null
  );

  useEffect(() => {
    // Fetch URL do ícone de perfil
    const fetchProfileIcon = async () => {
      const url = await ritoApi.getProfileIcon(summonerData.profile_icon_id);
      setProfileIconUrl(url);
    };

    fetchProfileIcon();
  }, [summonerData.profile_icon_id]);

  useEffect(() => {
    const fetchSummonerData = async () => {
      const summonerDataFromApi = await ritoApi.getSummonerByName(
        summonerData.summonerName,
        summonerData.region as Regions
      );

      // Atualizar estado com dados formatados
      const formattedData: RiotSummonerData = {
        ...summonerData,
        id: summonerDataFromApi.id,
        puuid: summonerDataFromApi.puuid,
        summonerName: summonerDataFromApi.accountId,
        summoner_level: summonerDataFromApi.summonerLevel,
        profile_icon_id: summonerDataFromApi.profileIconId,
        // Adicione outros campos aqui conforme necessário
      };

      setSummonerInfo(formattedData); // Armazena os dados formatados no estado

      // Chame o método correto de RiotApiService
      await RiotApiService.getProfileData(summonerData.user_id);
    };

    fetchSummonerData();
  }, [summonerData]);

  if (!summonerInfo) {
    return <div>Loading...</div>; // Exibe uma mensagem de carregamento até os dados estarem disponíveis
  }

  return (
    <div>
      <Avatar>
        {profileIconUrl ? (
          <AvatarImage src={profileIconUrl} alt='Profile Avatar' />
        ) : (
          <AvatarFallback>{summonerData.summonerName}</AvatarFallback>
        )}
      </Avatar>
      <Card>
        <CardHeader>
          <CardTitle>{summonerInfo.summonerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nível: {summonerInfo.summoner_level}</p>
          <p>Região: {summonerInfo.region}</p>
          {/* Exibe informações sobre as ligas */}
          {leagues.map((league, index) => (
            <div key={index}>
              <p>{league.queueType}</p>
              <p>
                {league.tier} {league.rank}
              </p>
              <p>LP: {league.leaguePoints}</p>
              <p>
                Wins: {league.wins} Losses: {league.losses}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
