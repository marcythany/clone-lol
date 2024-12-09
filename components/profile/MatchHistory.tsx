import { useEffect, useState } from 'react';
import { Card, CardContent } from 'components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { RitoApi } from '~/lib/riot/RiotApi';
import { Skeleton } from 'components/ui/skeleton';
import { Regions, regionToRegionGroup } from 'twisted/dist/constants';

interface MatchHistoryProps {
  puuid: string;
  region: Regions;
}

interface MatchData {
  gameId: string;
  champion: {
    name: string;
    image: string;
  };
  gameMode: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  creepScore: number;
  gameLength: number;
  gameEndTimestamp: number;
}

interface ChampionData {
  key: string;
  name: string;
  image: { full: string };
}

function isChampionData(value: unknown): value is ChampionData {
  return (value as ChampionData).key !== undefined;
}

export function MatchHistory({ puuid, region }: MatchHistoryProps) {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const ritoApi = new RitoApi(puuid, region);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        // Get match IDs
        const matchIds = await ritoApi.getMatchHistory(puuid, regionToRegionGroup(region), {
          count: 0,
        });

        // Get champion data for images
        const champions = await ritoApi.getDataDragonChampions();

        // Fetch details for each match
        const matchDetails = await Promise.all(
          matchIds.slice(0, 10).map(async (matchId: string) => {
            const match = await ritoApi.getMatchDetails(matchId, regionToRegionGroup(region));
            const participant = match.info.participants.find(
              (p: any) => p.puuid === puuid
            );

            if (participant) {
              const championData = Object.values(champions.data).find(
                (c: unknown): c is ChampionData => isChampionData(c) && c.key === participant.championId.toString()
              );

              if (championData) {
                // Get the latest version from Data Dragon
                const versions = await ritoApi.getDataDragonVersion();
                const latestVersion = versions[0];

                const matchData: MatchData = {
                  gameId: match.metadata.matchId,
                  champion: {
                    name: championData.name || 'Unknown Champion',
                    image: `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/champion/${championData.image.full}`,
                  },
                  gameMode: match.info.gameMode,
                  win: participant.win,
                  kills: participant.kills,
                  deaths: participant.deaths,
                  assists: participant.assists,
                  creepScore:
                    participant.totalMinionsKilled +
                    participant.neutralMinionsKilled,
                  gameLength: match.info.gameDuration,
                  gameEndTimestamp: match.info.gameEndTimestamp,
                };

                return matchData;
              } else {
                console.log('Champion data not found for match:', matchId);
                return null;
              }
            } else {
              console.log('Participant not found for match:', matchId);
              return null;
            }
          })
        );

        const filteredMatches = matchDetails.filter(
          (match): match is MatchData => match !== null
        );
        setMatches(filteredMatches);
      } catch (error) {
        console.error('Error fetching match history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (puuid && region) {
      fetchMatches();
    }
  }, [puuid, region]);

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className='h-24 w-full' />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {matches.map((match) => (
        <Card
          key={match.gameId}
          className={
            match.win
              ? 'border-l-4 border-l-green-500'
              : 'border-l-4 border-l-red-500'
          }
        >
          <CardContent className='flex items-center space-x-4 p-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={match.champion.image}
                alt={match.champion.name}
              />
              <AvatarFallback>
                {match.champion.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>{match.champion.name}</h3>
                <Badge variant={match.win ? 'default' : 'destructive'}>
                  {match.win ? 'Victory' : 'Defeat'}
                </Badge>
              </div>
              <div className='flex items-center space-x-4 text-sm'>
                <p>
                  <span className='font-semibold'>{match.kills}</span>/
                  <span className='text-red-500'>{match.deaths}</span>/
                  <span className='text-blue-500'>{match.assists}</span>
                </p>
                <p>{match.creepScore} CS</p>
                <p>
                  {Math.floor(match.gameLength / 60)}:
                  {(match.gameLength % 60).toString().padStart(2, '0')}
                </p>
              </div>
              <p className='text-xs text-gray-400'>
                {new Date(match.gameEndTimestamp).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
