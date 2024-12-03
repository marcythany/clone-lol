'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import { RegionGroups } from 'twisted/dist/constants'
import { useProfile } from '@/hooks/useProfile'
import { ProfileDisplay } from '@/components/profile/profile-display'
import { SummonerInfoForm } from '@/components/profile/summoner-info-form'
import { UnlinkButton } from '@/components/profile/unlink-button'
import { ProfileFormData, ProfileFormProps } from '@/types/profile'

export function ProfileForm({ userId }: ProfileFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const [formLoading, setFormLoading] = useState(false)
  const t = useTranslations('Profile')
  const { profile, loading: profileLoading } = useProfile()

  const handleSubmit = async (formData: ProfileFormData) => {
    setFormLoading(true)

    try {
      if (!formData.summoner_name || !formData.tag_line) {
        throw new Error(t('errors.missingFields'))
      }

      console.log('[ProfileForm] Submitting:', formData)

      // Get Riot account data
      const riotResponse = await fetch(`/api/riot/account/${formData.summoner_name}/${formData.tag_line}`)
      const riotData = await riotResponse.json()

      if (!riotData.success) {
        throw new Error(riotData.message || t('errors.fetchingSummoner'))
      }

      console.log('[ProfileForm] Riot data:', riotData)

      // Update profile with Riot data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          puuid: riotData.data.puuid,
          summoner_name: riotData.data.gameName,
          tag_line: riotData.data.tagLine,
          region: formData.region,
        })
        .eq('id', userId)
        .select()
        .single()

      if (profileError) {
        throw profileError
      }

      // Sync profile data with Riot API
      const syncResponse = await fetch('/api/riot/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          puuid: riotData.data.puuid,
          region: formData.region,
        }),
      })

      const syncData = await syncResponse.json()
      if (!syncData.success) {
        throw new Error(syncData.message || 'Failed to sync profile data')
      }

      console.log('[ProfileForm] Sync completed:', syncData)

      router.refresh()
    } catch (error: any) {
      console.error('[ProfileForm] Error:', error)
      // TODO: Add toast notification for error
      throw error
    } finally {
      setFormLoading(false)
    }
  }

  const handleUnlink = async () => {
    setFormLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          puuid: null,
          summoner_name: null,
          tag_line: null,
          region: null,
        })
        .eq('id', userId)

      if (error) {
        throw error
      }

      router.refresh()
    } catch (error) {
      console.error('[ProfileForm] Error:', error)
      // Handle error (show toast, etc.)
    } finally {
      setFormLoading(false)
    }
  }

  if (profileLoading) {
    return <div>{t('loading')}</div>
  }

  return profile?.puuid ? (
    <div className="space-y-6">
      <ProfileDisplay profile={profile} />
      <UnlinkButton onUnlink={handleUnlink}  />
    </div>
  ) : (
    <SummonerInfoForm onSubmit={handleSubmit} loading={formLoading} />
  )
}
