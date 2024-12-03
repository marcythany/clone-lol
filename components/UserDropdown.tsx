'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Profile } from '@/types/user';
import { useDataDragon } from '@/hooks/useDataDragon';
import Image from 'next/image';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  loading: boolean;
}

const DEFAULT_PROFILE_ICON_ID = 1;

export default function UserDropdown({ isOpen, onClose, profile, loading }: UserDropdownProps) {
  const t = useTranslations('Navigation');
  const { getProfileIconUrl, version } = useDataDragon();

  // Use default icon if profile_icon_id is null
  const iconId = profile?.profile_icon_id || DEFAULT_PROFILE_ICON_ID;
  const iconUrl = version ? getProfileIconUrl(iconId) : '';

  const menuItems = [
    { key: 'account', icon: User, href: '/account' },
    { key: 'security', icon: Shield, href: '/security' },
    { key: 'settings', icon: Settings, href: '/settings' },
    { key: 'signOut', icon: LogOut, href: '/logout' },
  ];

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
            <div className="bg-[#1E282D] rounded-lg shadow-lg ring-1 ring-[#C89B3C]/10 overflow-hidden">
              <div className="p-4 border-b border-[#C89B3C]/10">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#C89B3C] ring-offset-2 ring-offset-[#1E282D]">
                    {!loading && iconUrl && (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#C89B3C]">
                      {loading ? '...' : profile?.summoner_name || t('summonerName')}
                    </h3>
                    {profile && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[#A1A1A1]">
                          #{profile.tag_line}
                        </span>
                        <span className="text-xs text-[#A1A1A1] opacity-50">•</span>
                        <span className="text-xs text-[#A1A1A1]">
                          {t('onlineStatus')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="block"
                      onClick={onClose}
                    >
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 px-3 py-2 text-[#A1A1A1] hover:text-[#C89B3C] hover:bg-[#010A13]/30 rounded-md transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{t(item.key)}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              <div className="p-2 bg-[#010A13]/20 mt-1">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs text-[#A1A1A1]">
                    {t('version')} 2024.1.0
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-[#C89B3C] hover:text-[#F0B254] transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    {t('checkUpdates')}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
