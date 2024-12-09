import { Tabs, TabsContent, TabsList, TabsTrigger } from 'components/ui/tabs';
import { ChampionMastery } from 'components/profile/ChampionMastery';
import { MatchHistory } from 'components/profile/MatchHistory';
import { Regions } from 'twisted/dist/constants/regions';

interface ProfileTabsProps {
  puuid: string;
  region: Regions;
}

export const ProfileTabs = ({ puuid, region }: ProfileTabsProps) => (
  <Tabs defaultValue='champions'>
    <TabsList>
      <TabsTrigger value='champions'>Champion Mastery</TabsTrigger>
      <TabsTrigger value='match-history'>Match History</TabsTrigger>
    </TabsList>
    <TabsContent value='champions'>
      <ChampionMastery summonerId={puuid} region={region} />
    </TabsContent>
    <TabsContent value='match-history'>
      <MatchHistory puuid={puuid} region={region} />
    </TabsContent>
  </Tabs>
);
