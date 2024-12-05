import { Regions, RegionGroups } from 'twisted/dist/constants';

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface ChampionInfo {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
    sprite: string;
    group: string;
  };
}

export interface RankedInfo {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface ChallengesInfo {
  categoryPoints: {
    [key: string]: {
      level: string;
      current: number;
      max: number;
      percentile: number;
    };
  };
  preferences: {
    title?: string;
    challengeIds: number[];
  };
  totalPoints: {
    level: string;
    current: number;
    max: number;
    percentile: number;
  };
}

export interface MatchInfo {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: Array<{
      assists: number;
      baronKills: number;
      bountyLevel: number;
      champExperience: number;
      champLevel: number;
      championId: number;
      championName: string;
      deaths: number;
      kills: number;
      participantId: number;
      puuid: string;
      summonerName: string;
      teamId: number;
      win: boolean;
    }>;
    platformId: string;
    queueId: number;
    teams: Array<{
      bans: Array<{
        championId: number;
        pickTurn: number;
      }>;
      objectives: {
        baron: { first: boolean; kills: number };
        champion: { first: boolean; kills: number };
        dragon: { first: boolean; kills: number };
        inhibitor: { first: boolean; kills: number };
        riftHerald: { first: boolean; kills: number };
        tower: { first: boolean; kills: number };
      };
      teamId: number;
      win: boolean;
    }>;
  };
}

export interface MatchTimelineInfo {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    frameInterval: number;
    frames: Array<{
      events: Array<{
        timestamp: number;
        type: string;
        participantId?: number;
        levelUpType?: string;
        skillSlot?: number;
        itemId?: number;
        position?: { x: number; y: number };
      }>;
      participantFrames: {
        [key: string]: {
          championStats: {
            abilityHaste: number;
            abilityPower: number;
            armor: number;
            armorPen: number;
            attackDamage: number;
            attackSpeed: number;
            bonusArmorPen: number;
            bonusMagicPen: number;
            ccReduction: number;
            cooldownReduction: number;
            health: number;
            healthMax: number;
            healthRegen: number;
            lifesteal: number;
            magicPen: number;
            magicResist: number;
            movementSpeed: number;
            omnivamp: number;
            physicalVamp: number;
            power: number;
            powerMax: number;
            powerRegen: number;
            spellVamp: number;
          };
          currentGold: number;
          damageStats: {
            magicDamageDone: number;
            magicDamageDoneToChampions: number;
            magicDamageTaken: number;
            physicalDamageDone: number;
            physicalDamageDoneToChampions: number;
            physicalDamageTaken: number;
            totalDamageDone: number;
            totalDamageDoneToChampions: number;
            totalDamageTaken: number;
            trueDamageDone: number;
            trueDamageDoneToChampions: number;
            trueDamageTaken: number;
          };
          goldPerSecond: number;
          jungleMinionsKilled: number;
          level: number;
          minionsKilled: number;
          participantId: number;
          position: { x: number; y: number };
          timeEnemySpentControlled: number;
          totalGold: number;
          xp: number;
        };
      };
      timestamp: number;
    }>;
    gameId: number;
    participants: Array<{
      participantId: number;
      puuid: string;
    }>;
  };
}
