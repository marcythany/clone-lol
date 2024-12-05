'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useTranslations } from 'next-intl'
import { useProfile } from '@/hooks/useProfile'
import { ProfileDisplay } from '@/components/profile/profile-display'
import { SummonerInfoForm } from '@/components/profile/summoner-info-form.client'
import { UnlinkButton } from '@/components/profile/unlink-button.client'
import { ProfileFormData, ProfileFormProps } from '@/types/profile'
import axios from 'axios'

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
      const { data: riotData } = await axios.get(`/api/riot/account/${formData.summoner_name}/${formData.tag_line}`)

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
      const { data: syncData } = await axios.post('/api/riot/sync', {
        userId,
        puuid: riotData.data.puuid,
        region: formData.region,
      })

      console.log('[ProfileForm] Sync completed:', syncData)

      if (!syncData.summoner) {
        throw new Error(t('errors.syncFailed'))
      }

      router.refresh()
    } catch (error: any) {
      console.error('[ProfileForm] Error:', error)
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || t('errors.unknown'))
      }
      throw error instanceof Error 
        ? error 
        : new Error(t('errors.unknown'))
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
          mastery_score: null,
          challenges: null,
          summoner_level: null,
          profile_icon_id: null,
        })
        .eq('id', userId)

      if (error) {
        console.error('[ProfileForm] Error:', error)
        throw new Error(t('errors.databaseError'))
      }

      router.refresh()
    } catch (error: any) {
      console.error('[ProfileForm] Error:', error)
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || t('errors.unknown'))
      }
      throw error instanceof Error 
        ? error 
        : new Error(t('errors.unknown'))
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
