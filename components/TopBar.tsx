'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown } from 'lucide-react';
import LocaleSwitcher from './locale-switcher';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import UserDropdown from './UserDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import { useProfile } from '@/hooks/useProfile';
import { useDataDragon } from '@/hooks/useDataDragon';
import Image from 'next/image';

const tabs = [
  { key: 'overview', href: '/' },
  { key: 'patchNotes', href: '/patch-notes' },
  { key: 'esports', href: '/esports' }
];

const DEFAULT_PROFILE_ICON_ID = 1;

export function TopBar() {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { profile, loading } = useProfile();
  const { getProfileIconUrl, version } = useDataDragon();

  // Use default icon if profile_icon_id is null
  const iconId = profile?.profile_icon_id || DEFAULT_PROFILE_ICON_ID;
  const iconUrl = version ? getProfileIconUrl(iconId) : '';

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center px-8 py-4 relative z-40"
    >
      <nav className="flex gap-8">
        {tabs.map((tab) => (
          <motion.a
            key={tab.key}
            href={tab.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'text-sm font-medium transition-all duration-200',
              pathname === tab.href 
                ? 'text-[#C89B3C] relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C89B3C]' 
                : 'text-[#A1A1A1] hover:text-[#C89B3C]'
            )}
          >
            {t(tab.key)}
          </motion.a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <LocaleSwitcher />

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="text-[#A1A1A1] hover:text-[#C89B3C] transition-colors relative"
            aria-label={t('notifications')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          <NotificationsDropdown 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)} 
          />
        </div>

        <div className="relative">
          <motion.button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#C89B3C] ring-offset-2 ring-offset-[#010A13]"
            >
              {!loading && iconUrl && (
                <Image
                  src={iconUrl}
                  alt=""
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
            <span className="text-sm font-medium text-[#C89B3C] group-hover:text-[#F0B254] transition-colors">
              {loading ? '...' : profile?.summoner_name || t('summonerName')}
            </span>
            <motion.div
              animate={{ rotate: isProfileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-[#C89B3C] group-hover:text-[#F0B254]" />
            </motion.div>
          </motion.button>

          <UserDropdown 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)}
            profile={profile}
            loading={loading}
          />
        </div>
      </div>
    </motion.div>
  );
}
