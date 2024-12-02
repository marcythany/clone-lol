'use client'

import { Profile } from "@/types/user"
import Image from "next/image"
import { useDataDragon } from "@/hooks/useDataDragon"

interface ProfileDisplayProps {
  profile: Profile
}

export function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const { getProfileIconUrl } = useDataDragon()

  if (!profile) return null

  return (
    <div className="flex items-center gap-3 p-3 bg-[#1E2124] rounded-lg">
      {profile.profile_icon_id && (
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src={getProfileIconUrl(profile.profile_icon_id)}
            alt="Profile Icon"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      )}
      <div className="flex flex-col">
        <h2 className="text-base font-medium text-white">
          {profile.summoner_name} #{profile.tag_line}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>{profile.region}</span>
          <span>•</span>
          <span>Level {profile.summoner_level}</span>
        </div>
      </div>
    </div>
  )
}
