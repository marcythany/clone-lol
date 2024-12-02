'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import { ChevronDown, LogOut, User2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useDataDragon } from '@/hooks/useDataDragon'
import Image from 'next/image'
import { Profile } from '@/types/user'

const navigationItems = [
  { name: 'Overview', href: '/' },
  { name: 'Champions', href: '/champions' },
  { name: 'Matches', href: '/matches' },
]

interface HeaderProps {
  user: User | null
  onSignOut: () => void
}

export function Header({ user, onSignOut }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()
  const { getProfileIconUrl } = useDataDragon()

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
  }, [user?.id])

  const profileIconUrl = profile?.profile_icon_id ? getProfileIconUrl(profile.profile_icon_id) : null

  return (
    <header className="fixed top-0 left-20 right-0 h-16 bg-slate-900/95 flex items-center justify-between px-6 z-50">
      {/* Navigation */}
      <nav className="flex items-center space-x-6">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 relative rounded-full overflow-hidden bg-slate-800">
                {profileIconUrl ? (
                  <Image
                    src={profileIconUrl}
                    alt="Profile Icon"
                    fill
                    sizes="(max-width: 32px) 100vw"
                    className="object-cover"
                  />
                ) : user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="w-full h-full p-1" />
                )}
              </div>
              <span>{profile?.summoner_name || user.user_metadata?.name || 'User'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg py-1">
                <Link
                  href="/profile"
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <User2 className="w-4 h-4 mr-2" />
                  Account Details
                </Link>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    onSignOut()
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
