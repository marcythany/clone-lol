'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { RankedInfo } from '@/types/riot'
import { Trophy } from 'lucide-react'
import { useRiotAssets } from '@/hooks/use-riot-assets'
import { useMemo } from 'react'

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const locale = useLocale()
  const { getChallengeIconUrl, getChampionIconUrl, getProfileIconUrl } = useRiotAssets()
  const t = useTranslations('Profile')

  // Get localized title from raw title ID
  const localizedTitle = useMemo(() => {
    const rawTitle = profile.challenges?.preferences?.title
    if (!rawTitle) return ''
    return t(`challenges.${rawTitle}`, { fallback: rawTitle })
  }, [profile.challenges?.preferences?.title, t])

  // Helper functions
  const getChallengeName = (challengeId: string): { name: string, description: string } => {
    if (!challengeId) {
      console.warn('[getChallengeName] Invalid input:', { challengeId });
      return { 
        name: 'Unknown Challenge',
        description: ''
      };
    }

    return {
      name: t(`challenges.${challengeId}.name`, { fallback: challengeId }),
      description: t(`challenges.${challengeId}.description`, { fallback: '' })
    };
  }

  const getChampionName = (championId: number): string => {
    if (!championId) {
      console.warn('[getChampionName] Invalid input:', { championId });
      return 'Unknown Champion';
    }

    return t(`champions.${championId}`, { fallback: `Champion ${championId}` });
  }

  const iconId = profile.profile_icon_id || DEFAULT_PROFILE_ICON_ID
  const iconUrl = getProfileIconUrl(iconId)
  const masteryScore = profile.mastery_score?.total.score || 0
  const level = profile.summoner_level || 0

  // Get ranked info
  const soloQueue = profile.ranked_info?.find((queue: RankedInfo) => queue.queue_type === 'RANKED_SOLO_5x5')
  const rankInfo = getRankInfo(
    soloQueue?.tier || 'UNRANKED',
    soloQueue?.division || '',
    soloQueue?.league_points || 0
  )

  // Get honor info
  const honorInfo = getHonorInfo(
    parseInt(profile.honor_level) || 2,
    parseInt(profile.honor_checkpoint) || 0,
    profile.honor_locked || false
  )

  // Get challenge preferences
  const challengePrefs = profile.challenges?.preferences || {}
  const trophyBorder = challengePrefs.crestBorder || 'default'
  const bannerAccent = challengePrefs.bannerAccent || 'default'

  // Get top challenges
  const topChallenges = profile.challenges?.challenges
    ?.slice(0, MAX_DISPLAYED_CHALLENGES)
    .map(challenge => {
      // Log the raw challenge for debugging
      console.log('[ProfileDisplay] Processing challenge:', challenge);

      // Ensure we have all required fields
      if (!challenge || typeof challenge.challengeId === 'undefined') {
        console.warn('[ProfileDisplay] Invalid challenge:', challenge);
        return null;
      }

      // Convert challengeId to number and ensure it's properly formatted
      const challengeId = Number(challenge.challengeId);
      const level = (challenge.level || 'NONE').toUpperCase()
      
      // Get challenge info
      const challengeInfo = getChallengeName(challengeId.toString())
      
      // Log the processed challenge
      console.log('[ProfileDisplay] Processed challenge:', {
        id: challengeId,
        level,
        name: challengeInfo.name,
        icon: getChallengeIconUrl(challengeId.toString(), level)
      })

      return {
        ...challenge,
        challengeId: Number(challenge.challengeId), // Convert challengeId to number
        level,
        name: challengeInfo.name,
        description: challengeInfo.description,
        icon: getChallengeIconUrl(challengeId.toString(), level)
      };
    })
    .filter((c): c is ChallengeWithIcon => c !== null) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto p-4"
    >
      <div className="flex items-start gap-8">
        {/* Left side - Profile Info */}
        <div className="flex flex-col items-center gap-4">
          {/* Profile Icon with decorative border */}
          <div className="relative">
            <div className="absolute inset-0 w-[140px] h-[140px] bg-gradient-to-b from-[#785A28] to-[#463714] rounded-full -z-10 transform scale-[1.15]" />
            <div className="absolute inset-0 w-[140px] h-[140px] bg-[#1E2328] rounded-full -z-[5] transform scale-[1.1]" />
            <Image
              src={iconUrl}
              alt="Profile Icon"
              width={140}
              height={140}
              className="rounded-full border-4 border-[#785A28]"
              priority
            />
            {/* Level Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#1E2328] text-[#C89B3C] px-2 py-0.5 rounded-full text-sm font-bold border border-[#C89B3C] z-10">
              {level}
            </div>
            {/* Honor Badge */}
            <div className="absolute -top-2 right-0 bg-[#1E2328] text-[#C89B3C] p-2 rounded-full border-2 border-[#785A28] z-10 flex items-center justify-center">
              <div className="relative group">
                <Image
                  src={honorInfo.emblemUrl}
                  alt={honorInfo.displayText}
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-8 h-8 flex items-center justify-center text-xs font-bold">H${honorInfo.level}</div>`;
                    }
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-[#1E2328] text-[#C89B3C] px-2 py-1 rounded text-xs whitespace-nowrap border border-[#785A28]">
                    {honorInfo.displayText}
                  </div>
                </div>
              </div>
            </div>
            {/* Rank Badge */}
            <div className="absolute -bottom-2 right-0 bg-[#1E2328] text-[#C89B3C] p-2 rounded-full border-2 border-[#785A28] z-10 flex items-center justify-center">
              <div className="relative group">
                <Image
                  src={rankInfo.emblemUrl}
                  alt={rankInfo.displayText}
                  width={32}
                  height={32}
                  className="object-contain"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-8 h-8 flex items-center justify-center text-xs font-bold">${rankInfo.tier.charAt(0)}</div>`;
                    }
                  }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-[#1E2328] text-[#C89B3C] px-2 py-1 rounded text-xs whitespace-nowrap border border-[#785A28]">
                    {rankInfo.displayText}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Tokens */}
          {topChallenges && topChallenges.length > 0 && (
            <div className="flex gap-2 mt-6">
              {topChallenges.filter((token): token is ChallengeWithIcon => token !== null).map((token) => {
                const tokenId = (token.id ?? token.challengeId)?.toString()
                if (!tokenId) return null
                
                const challengeInfo = getChallengeName(tokenId)
                return (
                  <div 
                    key={tokenId}
                    className="relative group"
                    title={`${challengeInfo.name}\n${challengeInfo.description}`}
                  >
                    {token.icon && (
                      <Image
                        src={token.icon}
                        alt={challengeInfo.name}
                        width={32}
                        height={32}
                        className="rounded"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';
                          const parent = img.parentElement;
                          if (parent) {
                            const fallbackIcon = document.createElement('div');
                            fallbackIcon.innerHTML = `<svg class="text-${token.level.toLowerCase()}" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
                            parent.appendChild(fallbackIcon);
                          }
                        }}
                      />
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-[#1E2328] text-[#C89B3C] px-1.5 rounded-full text-xs border border-[#785A28]">
                      {token.value.toLocaleString()}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right side - Profile Info and Champions */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#C89B3C]">
              {profile.summoner_name}
              <span className="text-gray-400 ml-2">#{profile.tag_line}</span>
            </h2>
            <p className="text-gray-400">{localizedTitle}</p>
          </div>

          <div className="flex justify-between items-start">
            {/* Champion Masteries */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="text-[#C89B3C]" />
                <span className="text-[#C89B3C]">
                  {t('masteryScore')}: {masteryScore.toLocaleString()}
                </span>
              </div>
              {profile.mastery_score?.champions && (
                <div className="flex gap-2">
                  {(profile.mastery_score.champions as ChampionMastery[])
                    .sort((a, b) => b.championPoints - a.championPoints)
                    .slice(0, 3)
                    .map((champion) => (
                      <div 
                        key={champion.championId}
                        className="relative"
                      >
                        <div className="w-16 h-16 relative">
                          <Image
                            src={getChampionIconUrl(champion.championId)}
                            alt={getChampionName(champion.championId)}
                            width={64}
                            height={64}
                            className="rounded glass-elevation-2"
                            priority
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.backgroundColor = '#1E2328';
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 bg-[#C89B3C] text-black font-bold px-1.5 rounded-full text-xs">
                            {champion.championLevel}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Stats Display */}
          <div className="flex flex-col items-center gap-2 text-sm">
            {/* Solo/Duo Rank */}
            <div className="text-center">
              <div className="text-[#A1A1A1]">SOLO/DUO</div>
              <div className="text-[#F0E6D2]">{rankInfo.displayText}</div>
            </div>

            {/* Honor Level */}
            <div className="text-center">
              <div className="text-[#A1A1A1]">HONOR</div>
              <div className="text-[#F0E6D2]">{honorInfo.displayText}</div>
            </div>

            {/* Mastery Score */}
            <div className="text-center">
              <div className="text-[#A1A1A1]">MASTERY SCORE</div>
              <div className="text-[#F0E6D2]">{masteryScore.toLocaleString()}</div>
            </div>

            {/* Trophy Border */}
            <div className="text-center">
              <div className="text-[#A1A1A1]">TROPHY</div>
              <div className="text-[#F0E6D2]">{trophyBorder}</div>
            </div>

            {/* Banner Accent */}
            <div className="text-center">
              <div className="text-[#A1A1A1]">BANNER</div>
              <div className="text-[#F0E6D2]">{bannerAccent}</div>
            </div>
          </div>

          
          </div>
          
        </div>
      </div>
    </motion.div>
  )
}
