'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GameMode, GameModeTab } from '@/types/game';
import { Users, Bot, Swords, GraduationCap } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface GameModeTabsProps {
  selectedMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function GameModeTabs({ selectedMode, onModeChange }: GameModeTabsProps) {
  const t = useTranslations('Play');

  const gameModes: GameModeTab[] = [
    { id: 'pvp', name: t('tabs.pvp'), icon: Swords },
    { id: 'pve', name: t('tabs.pve'), icon: Bot },
    { id: 'practice', name: t('tabs.practice'), icon: GraduationCap },
  ];

  return (
    <nav className="flex justify-center">
      {gameModes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selectedMode === mode.id;
        
        return (
          <motion.button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              'relative flex items-center gap-2 px-8 py-3',
              'text-sm font-medium transition-colors duration-200',
              isSelected 
                ? 'text-[#C89B3C]' 
                : 'text-[#A1A1A1] hover:text-white'
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{mode.name}</span>
            {isSelected && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C89B3C]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}
