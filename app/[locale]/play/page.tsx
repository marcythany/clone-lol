'use client';

import { useState } from 'react';
import { GameMode } from '@/types/game';
import { GameModeTabs, GameList } from '@/components/play';
import { gameTypes } from '@/types/game-types';

export default function PlayPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>('pvp');
  const filteredGames = gameTypes.filter(game => game.mode === selectedMode);

  return (
    <div className="min-h-screen text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <GameModeTabs 
          selectedMode={selectedMode} 
          onModeChange={setSelectedMode} 
        />
        <GameList games={filteredGames} />
      </div>
    </div>
  );
}
