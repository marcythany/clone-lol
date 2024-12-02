'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/riot'
import { MatchV5DTOs } from 'twisted/dist/models-dto'
import { RegionGroups } from 'twisted/dist/constants'
import { useDataDragon } from '@/hooks/useDataDragon'
import Image from 'next/image'

interface MatchHistoryProps {
  puuid: string
  region: RegionGroups
}

export function MatchHistory({ puuid, region }: MatchHistoryProps) {
  const { getChampionIconUrl } = useDataDragon()
  const [matches, setMatches] = useState<MatchV5DTOs.MatchDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      if (!puuid) return

      try {
        setLoading(true)
        setError(null)

        // Busca os IDs das últimas 10 partidas
        const matchIdsResponse = await api.MatchV5.list(puuid, region, {
          count: 10,
        })

        // Busca os detalhes de cada partida
        const matchPromises = matchIdsResponse.response.map((matchId) =>
          api.MatchV5.get(matchId, region)
        )

        const matchResponses = await Promise.all(matchPromises)
        const matchDetails = matchResponses.map((match) => match.response)
        setMatches(matchDetails)
      } catch (err) {
        console.error('Erro ao buscar partidas:', err)
        setError('Não foi possível carregar o histórico de partidas')
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [puuid, region])

  if (loading) {
    return <div className="text-center py-4">Carregando histórico...</div>
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>
  }

  if (!matches.length) {
    return <div className="text-center py-4">Nenhuma partida encontrada</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Histórico de Partidas</h2>
      {matches.map((match) => {
        const participant = match.info.participants.find((p) => p.puuid === puuid)
        if (!participant) return null

        return (
          <div
            key={match.metadata.matchId}
            className={`p-4 rounded-lg border ${
              participant.win ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded overflow-hidden">
                  <Image
                    src={getChampionIconUrl(participant.championName)}
                    alt={participant.championName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{participant.championName}</p>
                  <p className="text-sm">
                    {participant.kills}/{participant.deaths}/{participant.assists} KDA
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={participant.win ? 'text-blue-600' : 'text-red-600'}>
                  {participant.win ? 'Vitória' : 'Derrota'}
                </p>
                <p className="text-sm">
                  {Math.floor(match.info.gameDuration / 60)}:{String(match.info.gameDuration % 60).padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(match.info.gameCreation).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
