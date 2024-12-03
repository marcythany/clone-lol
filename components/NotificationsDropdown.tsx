'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Trophy, Info, Settings } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock notifications data - in a real app, this would come from an API
const mockNotifications = [
  {
    id: 1,
    type: 'gift',
    title: 'Free Champion Rotation',
    message: 'New free champion rotation is now available!',
    time: '2h ago',
    read: false,
    icon: Gift,
  },
  {
    id: 2,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You reached Summoner Level 10!',
    time: '1d ago',
    read: false,
    icon: Trophy,
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'Client update available. Please restart to apply changes.',
    time: '3d ago',
    read: true,
    icon: Info,
  },
];

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const t = useTranslations('Notifications');
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

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
            className="absolute right-0 mt-2 w-96 origin-top-right z-50"
          >
            <div className={cn(
              "rounded-lg shadow-xl overflow-hidden",
              "bg-[#010A13]/80 backdrop-blur-md",
              "border border-[#C89B3C]/20",
              "ring-1 ring-white/5"
            )}>
              {/* Header */}
              <div className="p-4 border-b border-[#C89B3C]/10 flex justify-between items-center bg-[#010A13]/40">
                <h3 className="text-[#F0B254] font-medium">
                  {t('title')}
                </h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markAllAsRead()}
                    className="text-xs text-[#A1A1A1] hover:text-[#F0B254] transition-colors"
                  >
                    {t('markAllRead')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="text-[#A1A1A1] hover:text-[#F0B254] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#785A28] scrollbar-track-[#1E282D]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#A1A1A1]">
                    <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('noNotifications')}</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#C89B3C]/10">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn(
                            "p-4 flex gap-3 transition-all duration-200 relative",
                            !notification.read ? 'bg-[#C89B3C]/5' : 'hover:bg-[#C89B3C]/5'
                          )}
                        >
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                            !notification.read 
                              ? "bg-gradient-to-b from-[#C89B3C] to-[#785A28] text-[#1E282D]" 
                              : "bg-[#1E282D] text-[#A1A1A1]"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className={cn(
                              "text-sm font-medium mb-1",
                              !notification.read ? 'text-[#F0B254]' : 'text-[#C89B3C]'
                            )}>
                              {notification.title}
                            </h4>
                            <p className="text-xs text-[#A1A1A1] mb-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-[#A1A1A1]/60">
                              {notification.time}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteNotification(notification.id)}
                            className="absolute top-4 right-4 text-[#A1A1A1]/60 hover:text-[#F0B254] transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-[#010A13]/40 text-center border-t border-[#C89B3C]/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm text-[#C89B3C] hover:text-[#F0B254] transition-colors"
                >
                  {t('viewAll')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
