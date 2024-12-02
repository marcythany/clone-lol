'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { user: initialUser } } = await supabase.auth.getUser()
        setUser(initialUser)
        
        // Set up auth listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('[MainLayout] Auth state change:', event)
            setUser(session?.user ?? null)
            
            if (event === 'SIGNED_OUT') {
              router.push('/login')
            }
          }
        )

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('[MainLayout] Auth error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase, router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('[MainLayout] Sign out error:', error)
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Sidebar />
      <Header user={user} onSignOut={handleSignOut} />
      <main className="pl-20 pt-16">
        {children}
      </main>
    </div>
  )
}
