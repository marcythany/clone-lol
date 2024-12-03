import { createClient } from '@/utils/supabase/server'
import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import HomeContent from './components/HomeContent'
import type { PageProps } from '@/types/i18n'

export default async function HomePage({ params }: PageProps) {
  setRequestLocale(params.locale)
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${params.locale}/login`)
  }

  return <HomeContent user={user} />
}
