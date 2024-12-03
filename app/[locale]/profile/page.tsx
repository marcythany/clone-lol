import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createClient } from '@/utils/supabase/server'
import { ProfileForm } from './profile-form'
import { redirect } from '@/i18n/routing'
import type { Locale } from '@/types/i18n';
import type { User } from '@supabase/supabase-js'

export default async function ProfilePage({ params: { locale } }: { params: { locale: Locale } }) {
  // Set the locale for the request
  setRequestLocale(locale)

  try {
    const supabase = await createClient()
    const t = await getTranslations('Profile')

    console.log('[ProfilePage] Getting user...')
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    // Early return if no user or error
    if (userError) {
      console.error('[ProfilePage] User error:', userError)
      redirect('/login')
    }

    if (!user) {
      console.log('[ProfilePage] No user found')
      redirect('/login')
    }

    // Type assertion after validation
    const authenticatedUser = user as User
    console.log('[ProfilePage] User authenticated:', authenticatedUser.id)

    console.log('[ProfilePage] Fetching profile...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authenticatedUser.id)
      .single()

    if (profileError) {
      console.error('[ProfilePage] Profile error:', profileError)
    }

    console.log('[ProfilePage] Profile data:', profile)

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">{t('title')}</h1>
        <div className="max-w-2xl mx-auto">
          <ProfileForm 
            userId={authenticatedUser.id} 
            hasInitialProfile={!!profile} 
            initialProfile={profile} 
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('[ProfilePage] Error creating Supabase client:', error)
  }
}
