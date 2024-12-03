'use client'

import { ProfileWithRanked } from "@/types/profile"
import Image from "next/image"
import { useDataDragon } from "@/hooks/useDataDragon"
import { useTranslations } from 'next-intl'
import { Trophy, Star, Medal } from 'lucide-react'

interface ProfileDisplayProps {
  profile: ProfileWithRanked
}

const DEFAULT_PROFILE_ICON_ID = 1

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const { getProfileIconUrl, version } = useDataDragon()
  const t = useTranslations('Profile')

  if (!profile) return null

  const iconId = profile.profile_icon_id || DEFAULT_PROFILE_ICON_ID
  const iconUrl = version ? getProfileIconUrl(iconId) : ''

  if (!version || !iconUrl) {
    return (
      <div className=" p-8 rounded-lg animate-pulse">
        <div className="flex items-start gap-8">
          <div className="relative w-32 h-32  rounded-full" />
          <div className="space-y-4 flex-1">
            <div className="h-8 w-64 rounded" />
            <div className="h-6 w-48 rounded" />
          </div>
        </div>
      </div>
    )
  }

  const displayName = profile.summoner_name || 'Unknown'
  const displayTag = profile.tag_line || '0000'
  const displayLevel = profile.summoner_level || 0

  return (
    <div className="relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0  h-[300px]" />
      
      <div className="relative z-10 p-8">
        {/* Profile Header */}
        <div className="flex items-start gap-8">
          {/* Profile Icon with Level */}
          <div className="relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#C89B3C] shadow-lg">
              <Image
                src={iconUrl}
                alt={`${displayName}'s profile icon`}
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1E282D] px-3 py-1 rounded-full border-2 border-[#C89B3C]">
              <span className="text-[#C89B3C] font-bold">{displayLevel}</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-[#F0E6D2] flex items-center gap-2">
                {displayName}
                <span className="text-lg text-[#C89B3C]">#{displayTag}</span>
              </h1>
              <p className="text-[#A09B8C] mt-1">Swarm Conqueror</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-[#1E282D]/80 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-[#C89B3C] mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Honor</span>
                </div>
                <p className="text-2xl font-bold text-[#F0E6D2]">Level 4</p>
              </div>
              <div className="bg-[#1E282D]/80 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-[#C89B3C] mb-2">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Mastery Score</span>
                </div>
                <p className="text-2xl font-bold text-[#F0E6D2]">287</p>
              </div>
              <div className="bg-[#1E282D]/80 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-[#C89B3C] mb-2">
                  <Medal className="w-5 h-5" />
                  <span className="font-semibold">{t('ranked')}</span>
                </div>
                <p className="text-2xl font-bold text-[#F0E6D2]">
                  {profile.ranked_solo 
                    ? `${profile.ranked_solo.tier} ${profile.ranked_solo.rank}`
                    : t('unranked')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
