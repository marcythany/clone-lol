'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { Bell, ChevronDown, LogOut, Settings, User2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRiotAssets } from '@/hooks/use-riot-assets'
import Image from 'next/image'
import { Profile } from '@/types/profile'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user: User | null
  onSignOut: () => void
}

export function Header({ user, onSignOut }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()
  const { getProfileIconUrl } = useRiotAssets()
  const t = useTranslations('Header')

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) return
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setProfile(data)
      }
    }

    fetchProfile()
  }, [user?.id, supabase])

  const profileIconUrl = profile?.profile_icon_id ? getProfileIconUrl(profile.profile_icon_id) : null

  const navigationItems = [
    { name: t('overview'), href: '/' },
    { name: t('champions'), href: '/champions' },
    { name: t('matches'), href: '/matches' },
  ]

  return (
    <header className={cn(
      "fixed top-0 right-0 left-0 z-50 h-16",
      "glass-elevation-1",
      "border-b border-[#C89B3C]/10",
      "transition-all duration-200"
    )}>
      <div className="container h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Clone Legends"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-lg font-bold bg-gradient-to-r from-[#C89B3C] to-[#785A28] bg-clip-text text-transparent">
            Clone Legends
          </span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[#A1A1A1] hover:text-[#C89B3C] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="glass-elevation-2 w-8 h-8 rounded-full flex items-center justify-center interactive-hover">
              <Bell className="w-4 h-4 text-[#C89B3C]" />
            </div>
            <div className="glass-elevation-2 w-8 h-8 rounded-full flex items-center justify-center interactive-hover">
              <Settings className="w-4 h-4 text-[#C89B3C]" />
            </div>
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 text-gray-300 hover:text-white"
              >
                {profileIconUrl ? (
                  <div className="relative w-8 h-8">
                    <Image
                      src={profileIconUrl}
                      alt="Profile"
                      fill
                      sizes="32px"
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <User2 className="w-8 h-8" />
                )}
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-elevation-3 rounded-lg border border-[#C89B3C]/10">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-white interactive-hover"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white interactive-hover flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
