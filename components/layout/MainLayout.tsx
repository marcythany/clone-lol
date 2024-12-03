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
          }
        )

        setIsLoading(false)

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('[MainLayout] Error initializing auth:', error)
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (isLoading) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-[#1E2124]">
      <Sidebar />
      <Header 
        user={user} 
        onSignOut={handleSignOut}
      />
      <main className="pl-20 pt-16">
        {children}
      </main>
    </div>
  )
}
