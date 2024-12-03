'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Store, User, Settings, Trophy, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const navItems = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/store', icon: Store, label: t('store') },
    { href: '/profile', icon: User, label: t('profile') },
    { href: '/collection', icon: Trophy, label: t('collection') },
  ];

  return (
    <motion.aside 
      initial={{ x: -64 }}
      animate={{ x: 0 }}
      className="w-16 bg-[#010A13] border-r border-[#1E282D] flex flex-col items-center py-4 z-50"
    >

      {/* Logo */}
      <motion.div 
        className="mb-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <img src="/images/lol_logo.svg" alt={t('logoAlt')} className="w-14 h-14" />
      </motion.div>

            {/* Play Button */}
            <Link href="/play" className="mb-auto">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 bg-gradient-to-b from-[#C89B3C] to-[#785A28] rounded-xl flex items-center justify-center shadow-lg hover:shadow-[#C89B3C]/20 transition-shadow group"
        >
          <Play className="w-6 h-6 text-[#1E282D] group-hover:text-black transition-colors" fill="currentColor" />
        </motion.div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.href} className="group relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-lg',
                    'transition-all duration-200',
                    isActive
                      ? 'text-[#C89B3C] bg-[#1E282D]'
                      : 'text-[#A1A1A1] hover:text-[#C89B3C] hover:bg-[#1E282D]'
                  )}
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              </motion.div>

              {/* Tooltip */}
              <div
                className={cn(
                  'absolute left-full top-1/2 -translate-y-1/2 ml-2',
                  'opacity-0 pointer-events-none',
                  'group-hover:opacity-100 transition-all duration-200'
                )}
              >
                <div className="bg-[#1E282D] px-2 py-1 rounded text-xs whitespace-nowrap">
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1E282D] rotate-45" />
                  <span className="relative text-[#C89B3C]">{item.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </motion.aside>
  );
}
