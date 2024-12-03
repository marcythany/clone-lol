'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Profile, ProfileWithRanked } from '@/types/profile'
import { User, AuthError } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient()

export function useProfile() {
  const [profile, setProfile] = useState<ProfileWithRanked | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    let isSubscribed = true

    async function getProfile() {
      try {
        setLoading(true)
        console.log('[useProfile] Getting current user...')
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('[useProfile] Error getting user:', userError)
          // Check if it's an auth session missing error
          if (userError instanceof AuthError && userError.message.includes('Auth session missing')) {
            console.log('[useProfile] No auth session, redirecting to login...')
            setProfile(null)
            setUser(null)
            // Get the current locale from the URL
            const pathParts = window.location.pathname.split('/')
            const locale = pathParts[1] || 'en' // Default to 'en' if no locale found
            router.replace(`/${locale}/login`)
            return
          }
          throw userError
        }

        if (user) {
          setUser(user)
          console.log('[useProfile] Getting profile for user:', user.id)
          
          // Get profile with ranked info
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select(`
              *,
              ranked_info!fk_ranked_info_profile_id (
                queue_type,
                tier,
                division,
                league_points,
                wins,
                losses
              )
            `)
            .eq('id', user.id)
            .single()

          if (profileError || !profileData) {
            console.log('[useProfile] Profile not found or error, attempting to create...')
            
            // Try to create profile
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([{ id: user.id }])
              .select()
              .single()

            if (createError) {
              if (createError.code === '23505') { // Unique violation
                console.log('[useProfile] Profile exists, retrying fetch...')
                const { data: existingProfile, error: refetchError } = await supabase
                  .from('profiles')
                  .select(`
                    *,
                    ranked_info!fk_ranked_info_profile_id (
                      queue_type,
                      tier,
                      division,
                      league_points,
                      wins,
                      losses
                    )
                  `)
                  .eq('id', user.id)
                  .single()

                if (refetchError) throw refetchError
                setProfile(existingProfile)
              } else {
                throw createError
              }
            } else {
              setProfile(newProfile)
            }
          } else {
            setProfile(profileData)
          }

          // Set up realtime subscription
          console.log('[useProfile] Setting up profile subscription for user:', user.id)
          const channel = supabase
            .channel(`profile:${user.id}`)
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${user.id}`
              },
              (payload) => {
                console.log('[useProfile] Profile updated:', payload)
                setProfile(payload.new as ProfileWithRanked)
              }
            )
            .subscribe()

          return () => {
            channel.unsubscribe()
          }
        }
      } catch (error) {
        console.error('[useProfile] Caught error:', error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()

    return () => {
      isSubscribed = false
    }
  }, [user?.id])

  return { profile, loading, error }
}
