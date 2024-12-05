import { type LeagueEntry, type Match, type Participant } from 'shieldbow';
import { type RankedInfo } from '@/types/riot';

export function formatRankedInfo(entry: LeagueEntry): RankedInfo {
  const wins = entry.wins;
  const losses = entry.losses;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return {
    tier: entry.tier,
    rank: entry.division,
    leaguePoints: entry.lp,
    wins,
    losses,
    winRate,
  };
}

export function getParticipantFromMatch(match: Match, summonerId: string): Participant | undefined {
  // Procura o participante em ambos os times (blue e red)
  const allParticipants = [
    ...Array.from(match.teams.get('blue')?.participants.values() ?? []),
    ...Array.from(match.teams.get('red')?.participants.values() ?? [])
  ];
  
  return allParticipants.find(p => p.summoner.id === summonerId);
}

export function calculateKDA(kills: number, deaths: number, assists: number): string {
  if (deaths === 0) return 'Perfect';
  return ((kills + assists) / deaths).toFixed(2);
}

export const QUEUE_TYPES = {
  400: 'Normal Draft',
  420: 'Ranked Solo/Duo',
  430: 'Normal Blind',
  440: 'Ranked Flex',
  450: 'ARAM',
  700: 'Clash',
  830: 'Co-op vs AI (Intro)',
  840: 'Co-op vs AI (Beginner)',
  850: 'Co-op vs AI (Intermediate)',
  900: 'ARURF',
  1400: 'Ultimate Spellbook',
} as const;
