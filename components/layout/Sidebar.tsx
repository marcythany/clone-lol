'use client'

import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Home, User, ShoppingBag, Trophy, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigationItems = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Profile', icon: User, href: '/profile' },
  { name: 'Store', icon: ShoppingBag, href: '/store' },
  { name: 'Esports', icon: Trophy, href: '/esports' },
  { name: 'Settings', icon: Settings, href: '/settings' },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-slate-900/95 flex flex-col items-center py-4 space-y-8">
      {/* Logo */}
      <div className="w-16 h-16 relative cursor-pointer" onClick={() => router.push('/')}>
        <Image
          src="/images/League of Legends.svg"
          alt="League of Legends"
          fill
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-lg transition-all',
                'hover:bg-slate-700/50',
                isActive && 'bg-slate-700'
              )}
            >
              <Icon className={cn(
                'w-6 h-6',
                isActive ? 'text-yellow-500' : 'text-slate-400'
              )} />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
