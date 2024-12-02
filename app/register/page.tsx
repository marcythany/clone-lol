import { AuthForm } from '@/components/auth/auth-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const supabase = createClient()
  const { data: { session } } = await (await supabase).auth.getSession()

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthForm mode="register" />
    </div>
  )
}
