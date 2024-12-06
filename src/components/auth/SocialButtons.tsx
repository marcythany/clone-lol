"use client"

import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { SiGithub, SiGmail } from "@icons-pack/react-simple-icons"
import { useRouter } from 'next/navigation'

export function SocialButtons() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Erro ao fazer login com GitHub:', error.message)
    }
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Erro ao fazer login com Google:', error.message)
    }
  }

  return (
    <div className="grid gap-2">
      <Button variant="outline" onClick={handleGoogleLogin}>
        <SiGmail className="mr-2 h-4 w-4" />
        Continuar com Google
      </Button>
      <Button variant="outline" onClick={handleGithubLogin}>
        <SiGithub className="mr-2 h-4 w-4" />
        Continuar com GitHub
      </Button>
    </div>
  )
}
