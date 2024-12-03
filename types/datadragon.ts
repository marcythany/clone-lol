export const GAME_MODES = {
  'summoners-rift': 'map11',
  'aram': 'map12',
  'tft': 'map22',
} as const

export const MAP_IDS = {
  summonersRift: "11",
  howlingAbyss: "12",
  twistedTreeline: "10",
  crystalScar: "8",
} as const;

export const LOCAL_MAP_IMAGES = {
  'summoners-rift': '/images/maps/gamemode-summoners-rift.jpg',
  'aram': '/images/maps/gamemode-aram.jpg',
  'tft': '/images/maps/gamemode-tft.png',
} as const;

export interface DataDragonVersion {
  version: string
}

export interface Champion {
  id: string
  key: string
  name: string
  title: string
  image: {
    full: string
  }
}

export interface ProfileIcon {
  id: number
  image: {
    full: string
  }
}

export interface SummonerSpell {
  id: string
  name: string
  description: string
  tooltip: string
}

export type GameMode = 'pvp' | 'pve' | 'practice';

export type GameType = {
  id: keyof typeof LOCAL_MAP_IMAGES;
  name: string;
  description: string;
  isPopular: boolean;
  icon: any;
  playerCount: string;
  difficulty: "Iniciante" | "Intermediário";
  mode: GameMode;
};

export type GameModeId = keyof typeof GAME_MODES
export type MapId = keyof typeof MAP_IDS
export type UIElementType = 'champion' | 'items' | 'minion' | 'score' | 'spells'
