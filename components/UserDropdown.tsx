'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Profile } from '@/types/profile';
import { useRiotAssets } from '@/hooks/use-riot-assets';
import Image from 'next/image';

interface UserDropdownProps {
  profile: Profile | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ profile, loading, isOpen, onClose }: UserDropdownProps) {
  const { getProfileIconUrl } = useRiotAssets();
  const t = useTranslations('UserDropdown');
  
  // Use default icon if profile_icon_id is null
  const iconId = profile?.profile_icon_id || 1;
  const iconUrl = getProfileIconUrl(iconId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 origin-top-right z-50"
          >
            <div className="glass-elevation-3 rounded-lg border border-[#C89B3C]/10 overflow-hidden">
              <div className="p-4 border-b border-[#C89B3C]/10">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#C89B3C] ring-offset-2 ring-offset-[#010A13]">
                    {!loading && iconUrl && (
                      <Image
                        src={iconUrl}
                        alt={t('profileIcon')}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#C89B3C] truncate">
                      {loading ? '...' : profile?.summoner_name || t('summonerName')}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {profile?.email || t('email')}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg interactive-hover"
                  onClick={onClose}
                >
                  <User className="w-4 h-4" />
                  <span>{t('profile')}</span>
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    // Add logout logic here
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white rounded-lg interactive-hover"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
