'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile, ProfileFormData, ProfileFormProps } from '@/types/user'
import { RegionGroups } from 'twisted/dist/constants'
import { SummonerInfoForm } from '@/components/profile/summoner-info-form'
import { ProfileDisplay } from '@/components/profile/profile-display'
import { UnlinkButton } from '@/components/profile/unlink-button'

export function ProfileForm({ userId, hasInitialProfile, initialProfile }: ProfileFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData: ProfileFormData) => {
    setLoading(true)

    try {
      const riotResponse = await fetch(`/api/riot/account/${formData.summonerName}/${formData.tagLine}`)
      const riotData = await riotResponse.json()

      if (!riotData.success) {
        throw new Error(riotData.message || 'Error fetching summoner data')
      }

      const summonerResponse = await fetch(`/api/riot/summoner/${riotData.puuid}?region=${RegionGroups.AMERICAS}`)
      const summonerData = await summonerResponse.json()

      if (!summonerData.success) {
        throw new Error(summonerData.message || 'Error fetching summoner details')
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          summoner_name: formData.summonerName,
          tag_line: formData.tagLine,
          puuid: riotData.puuid,
          region: RegionGroups.AMERICAS,
          profile_icon_id: summonerData.profileIconId,
          summoner_level: summonerData.summonerLevel,
          updated_at: new Date().toISOString(),
        })

      if (upsertError) throw upsertError

      router.refresh()
    } catch (error) {
      console.error('[Profile] Failed to update profile:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const handleUnlink = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('[Profile] Failed to unlink account:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  if (!userId) {
    return <div>Error: User ID not found</div>
  }

  const getInitialFormValues = (profile: Profile | null | undefined): ProfileFormData | undefined => {
    if (!profile) return undefined
    return {
      summonerName: profile.summoner_name || '',
      tagLine: profile.tag_line || '',
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="w-full max-w-md flex flex-col gap-3">
        {initialProfile && (
          <>
            <ProfileDisplay profile={initialProfile} />
            <UnlinkButton onUnlink={handleUnlink} isLoading={loading} />
          </>
        )}
        {!initialProfile && (
          <SummonerInfoForm
            initialValues={getInitialFormValues(initialProfile)}
            onSubmit={handleSubmit}
            isLoading={loading}
          />
        )}
      </div>
    </div>
  )
}
