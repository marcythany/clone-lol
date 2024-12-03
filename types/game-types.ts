import { Users, Bot, Swords, GraduationCap, Shield, Zap, Target, Trophy, Users2, Cpu } from 'lucide-react';
import { GameType } from './game';

export type GameMode = 'quickplay' | 'draft' | 'rankedSolo' | 'rankedFlex';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GameModeOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: Difficulty;
}

export const gameTypes: GameType[] = [
  {
    id: 'summonersRift',
    translationKey: 'summonersRift',
    name: "Summoner's Rift",
    description: "5v5 - Classic MOBA Experience",
    isPopular: true,
    icon: Users,
    playerCount: "5v5",
    difficulty: "intermediate",
    mode: 'pvp',
    imageUrl: '/images/maps/gamemode-summoners-rift.jpg',
    modes: [
      {
        id: 'quickplay',
        name: "QUICKPLAY",
        description: "Practice and casual play",
        icon: Zap,
        difficulty: "beginner"
      },
      {
        id: 'draft',
        name: "DRAFT PICK",
        description: "Strategic picks and bans",
        icon: Target,
        difficulty: "intermediate"
      },
      {
        id: 'rankedSolo',
        name: "RANKED SOLO/DUO",
        description: "Competitive ladder",
        icon: Trophy,
        difficulty: "advanced"
      },
      {
        id: 'rankedFlex',
        name: "RANKED FLEX",
        description: "Team-based ranked (no 4-player parties)",
        icon: Users2,
        difficulty: "advanced"
      }
    ]
  },
  {
    id: 'coopVsAi',
    translationKey: 'coopVsAi',
    name: "Co-op vs. AI",
    description: "5v5 - Team up against bots",
    isPopular: true,
    icon: Bot,
    playerCount: "5v5",
    difficulty: "beginner",
    mode: 'pve',
    imageUrl: '/images/maps/gamemode-summoners-rift.jpg',
    modes: [
      {
        id: 'intro',
        name: "INTRO",
        description: "Perfect for first-time players",
        icon: Cpu,
        difficulty: "beginner"
      },
      {
        id: 'beginner',
        name: "BEGINNER",
        description: "For players learning the basics",
        icon: Bot,
        difficulty: "beginner"
      },
      {
        id: 'intermediate',
        name: "INTERMEDIATE",
        description: "For players with MOBA experience",
        icon: Bot,
        difficulty: "intermediate"
      }
    ]
  },
  {
    id: 'aram',
    translationKey: 'aram',
    name: "ARAM",
    description: "5v5 - All Random All Mid",
    isPopular: true,
    icon: Swords,
    playerCount: "5v5",
    difficulty: "beginner",
    mode: 'pvp',
    imageUrl: '/images/maps/gamemode-aram.jpg'
  },
  {
    id: 'tft',
    translationKey: 'tft',
    name: "Teamfight Tactics",
    description: "8 jogadores - Auto Battler",
    isPopular: true,
    icon: Shield,
    playerCount: "8",
    difficulty: "intermediate",
    mode: 'pvp',
    imageUrl: '/images/maps/gamemode-tft.png'
  },
  {
    id: 'practiceTool',
    translationKey: 'practiceTool',
    name: "Practice Tool",
    description: "1 jogador - Modo Treino",
    isPopular: false,
    icon: GraduationCap,
    playerCount: "1",
    difficulty: "beginner",
    mode: 'practice',
    imageUrl: '/images/maps/gamemode-summoners-rift.jpg'
  }
];
