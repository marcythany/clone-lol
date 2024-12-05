'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useDataDragon } from '@/hooks/useDataDragon'

interface ChampionCardProps {
  championId: string
  championName: string
  title: string
}

export function ChampionCard({ championId, championName, title }: ChampionCardProps) {
  const { getChampionSplashUrl } = useDataDragon()
  const splashUrl = getChampionSplashUrl(championId)

  return (
    <Link
      href={`/champions/${championId}`}
      className="relative overflow-hidden rounded-lg glass-elevation-2 group"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={splashUrl}
          alt={championName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white">{championName}</h3>
        <p className="text-sm text-gray-300">{title}</p>
      </div>
    </Link>
  )
}
