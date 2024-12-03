'use client';

import { GameType } from '@/types/game';
import { GameCard } from './game-card';

interface GameListProps {
  games: GameType[];
}

export function GameList({ games }: GameListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {games.map((game) => (
        <GameCard key={`${game.mode}-${game.name}`} game={game} />
      ))}
    </div>
  );
}
