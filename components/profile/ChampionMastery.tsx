import { useEffect, useState } from 'react';
import { Card, CardContent } from 'components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { Badge } from 'components/ui/badge';
import { RitoApi } from '~/lib/riot/RiotApi';
import { Skeleton } from 'components/ui/skeleton';
import { Regions, regionToRegionGroup } from 'twisted/dist/constants';
import { ChampionData } from '~/types/riot';

interface ChampionMasteryProps {
  summonerId: string;
  region: Regions;
}

interface ChampionMasteryData {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championName: string;
  championImage: string;
}

export function ChampionMastery({ summonerId, region }: ChampionMasteryProps) {
  const [masteries, setMasteries] = useState<ChampionMasteryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<Regions>(region);

  const ritoApi = new RitoApi(summonerId);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionKey = event.target.value as keyof typeof Regions;
    const region = Regions[selectedRegionKey];

    if (!region) {
      console.error(`Invalid region selected: ${selectedRegionKey}`);
      return;
    }

    setSelectedRegion(region);
  };

  useEffect(() => {
    const fetchMasteries = async () => {
      try {
        setIsLoading(true);

        // Obter grupo de região utilizando função nativa

        const data = await ritoApi.getChampionMasteryByPUUID(
          summonerId,
          selectedRegion
        );

        const champions = await ritoApi.getChampionListDataDragon();

        const enrichedData = data.response?.map((mastery: any) => {
          const championId = Number(mastery.championId);
          const championData = Object.values(champions.data).find(
            (c: ChampionData) => c.key === championId.toString()
          );

          return {
            ...mastery,
            championName: championData?.name ?? 'Unknown Champion',
            championImage: championData?.image?.full
              ? `/api/champion-icon/${championData.image.full}`
              : '/api/champion-icon/0.png',
          };
        });

        setMasteries(enrichedData ?? []);
      } catch (error) {
        console.error('Error fetching champion masteries:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (summonerId && selectedRegion) {
      fetchMasteries();
    }
  }, [summonerId, selectedRegion]);

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
      {masteries.slice(0, 10).map((mastery) => (
        <Card key={mastery.championId}>
          <CardContent className='flex items-center space-x-4 p-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={mastery.championImage}
                alt={mastery.championName}
              />
              <AvatarFallback>
                {mastery.championName.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>{mastery.championName}</h3>
                <Badge
                  variant={
                    mastery.championLevel >= 6 ? 'destructive' : 'default'
                  }
                >
                  Level {mastery.championLevel}
                </Badge>
              </div>
              <p className='text-sm text-gray-500'>
                {mastery.championPoints.toLocaleString()} points
              </p>
              <p className='text-xs text-gray-400'>
                Last played:{' '}
                {new Date(mastery.lastPlayTime).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      <select value={selectedRegion} onChange={handleRegionChange}>
        {Object.keys(Regions).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
