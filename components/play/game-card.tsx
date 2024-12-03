'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GameType } from '@/types/game';
import { Users, GraduationCap, Gamepad2, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface GameCardProps {
  game: GameType;
}

export function GameCard({ game }: GameCardProps) {
  const t = useTranslations('Play');
  const Icon = game.icon;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'border border-[#C89B3C]/10',
        'transition-all duration-300',
        'hover:border-[#C89B3C]/30 hover:shadow-lg hover:shadow-[#C89B3C]/5',
        game.modes ? 'cursor-pointer' : ''
      )}
      onClick={() => game.modes && setIsExpanded(!isExpanded)}
    >
      <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
        <Image
          src={game.imageUrl}
          alt={game.name}
          width={400}
          height={225}
          priority={game.translationKey === 'summonersRift'}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            "opacity-40 group-hover:opacity-60",
            "blur-[1px] group-hover:blur-0",
            "transition-all duration-500"
          )}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#C89B3C]/20 backdrop-blur-sm rounded-lg">
            {Icon && <Icon className="w-6 h-6 text-[#C89B3C]" />}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {t(`gameMode.${game.translationKey}.name`)}
                </h3>
                <p className="text-sm text-gray-400">
                  {t(`gameMode.${game.translationKey}.description`)}
                </p>
              </div>
              {game.isPopular && (
                <span className="px-2 py-1 text-xs bg-[#C89B3C]/20 text-[#C89B3C] rounded-full backdrop-blur-sm">
                  {t('popular')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{game.playerCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4" />
                <span>{t(`difficulty.${game.difficulty.toLowerCase()}`)}</span>
              </div>
              {game.modes ? (
                <div className="flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4" />
                  <span>{t('modes')}</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-[#C89B3C]" />
                  </motion.div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Aqui você pode adicionar a lógica para iniciar o jogo
                  }}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#C89B3C] text-[#1E282D] rounded-lg text-sm font-medium"
                >
                  <Gamepad2 className="w-4 h-4" />
                  {t('playNow')}
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Game Modes Section */}
        {game.modes && (
          <motion.div 
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="pt-4 border-t border-[#C89B3C]/20">
              <div className="grid grid-cols-2 gap-3">
                {game.modes.map((mode) => {
                  const ModeIcon = mode.icon;
                  return (
                    <motion.button
                      key={mode.id}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg',
                        'bg-[#C89B3C]/10 hover:bg-[#C89B3C]/20',
                        'transition-colors duration-200 group',
                        'backdrop-blur-sm'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Aqui você pode adicionar a lógica para iniciar o modo específico
                      }}
                    >
                      <ModeIcon className="w-5 h-5 text-[#C89B3C]" />
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-white">
                          {t(`gameMode.${mode.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}.name`)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {t(`gameMode.${mode.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase())}.description`)}
                        </div>
                      </div>
                      <Gamepad2 className="w-4 h-4 text-[#C89B3C] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
