import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  try {
    const cookieStore = cookies()
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8">Perfil do Invocador</h1>
        <ProfileForm 
          userId={user.id}
          hasInitialProfile={!!profile}
          initialProfile={profile}
        />
      </div>
    )
  } catch (error) {
    console.error('[ProfilePage] Unexpected error:', error)
    redirect('/login')
  }
}
