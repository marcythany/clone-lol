'use client'

import { useEffect, useState } from 'react'
import { riotClient } from '@/lib/services/riot'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Match } from 'shieldbow'
import { useRiotAssets } from '@/hooks/use-riot-assets'

interface MatchHistoryProps {
  puuid: string
}

interface MatchHistoryState {
  matches: Match[]
  loading: boolean
  error: string | null
}

export default function MatchHistory({ puuid }: MatchHistoryProps) {
  const [state, setState] = useState<MatchHistoryState>({
    matches: [],
    loading: true,
    error: null,
  })
  const { getChampionIconUrl, getItemIconUrl, getSummonerSpellIconUrl } = useRiotAssets()
  const t = useTranslations('MatchHistory')

  useEffect(() => {
    async function fetchMatches() {
      try {
        const ritoClient = riotClient
        
        // Busca os IDs das últimas partidas
        const matchIds = await ritoClient.matches.listByPuuid(puuid, {
          count: 10,
          queue: 420 // Ranked Solo/Duo
        })

        // Busca os detalhes de cada partida
        const matchPromises = matchIds.map((matchId: string) =>
          ritoClient.matches.fetch(matchId)
        )

        const matchDetails = await Promise.all(matchPromises)
        setState({ matches: matchDetails, loading: false, error: null })
      } catch (error) {
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Failed to fetch matches' 
        }))
      }
    }

    fetchMatches()
  }, [puuid])

  if (state.loading) {
    return <div className="p-4 text-center">{t('loading')}</div>
  }

  if (state.error) {
    return (
      <div className="p-4 text-center text-red-500">
        {t('error')}: {state.error}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {state.matches.map(match => {
        const participant = match.participants.find(p => p.summoner.puuid === puuid)
        if (!participant) return null

        const gameDate = new Date(match.info.gameCreation)
        const gameDuration = Math.floor(match.info.gameDuration / 60)
        const kda = `${participant.kills}/${participant.deaths}/${participant.assists}`
        const kdaRatio = ((participant.kills + participant.assists) / Math.max(1, participant.deaths)).toFixed(2)
        
        return (
          <div 
            key={match.info.gameId}
            className={cn(
              "glass-elevation-2 p-4 rounded-lg",
              "border border-[#C89B3C]/10",
              "flex items-center gap-4",
              participant.win ? "bg-emerald-900/10" : "bg-red-900/10"
            )}
          >
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={getChampionIconUrl(participant.champion.id)}
                  alt={participant.champion.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 text-center">
                <span className="text-sm font-medium text-[#C89B3C]">
                  {participant.win ? t('victory') : t('defeat')}
                </span>
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {participant.champion.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {gameDate.toLocaleDateString()} • {gameDuration}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-white">{kda}</p>
                  <p className="text-sm text-gray-400">{kdaRatio} KDA</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {/* Items */}
                <div className="flex gap-1">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const item = participant.items.at(i)
                    if (!item) return (
                      <div 
                        key={i}
                        className="w-8 h-8 rounded bg-black/20"
                      />
                    )
                    
                    return (
                      <div 
                        key={i}
                        className="relative w-8 h-8 rounded overflow-hidden"
                      >
                        <Image
                          src={getItemIconUrl(item.id)}
                          alt={item.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    )
                  })}
                </div>

                {/* Summoner Spells */}
                <div className="flex gap-1">
                  {['D', 'F'].map(key => {
                    const spell = participant.summonerSpells.get(key)
                    if (!spell) return null
                    
                    return (
                      <div 
                        key={key}
                        className="relative w-8 h-8 rounded overflow-hidden"
                      >
                        <Image
                          src={getSummonerSpellIconUrl(spell.id)}
                          alt={spell.name}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
