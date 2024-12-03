import { FC } from 'react';
import { LucideIcon } from 'lucide-react';
import { GameModeOption, Difficulty } from './game-types';

export type GameMode = 'pvp' | 'pve' | 'practice';

export interface GameModeTab {
  id: GameMode;
  name: string;
  icon: FC & LucideIcon;
}

export interface GameType {
  id: string;
  translationKey: string;
  name: string;
  description: string;
  isPopular: boolean;
  icon: any;
  playerCount: string;
  difficulty: Difficulty;
  mode: GameMode;
  imageUrl: string;
  modes?: GameModeOption[];
}
