'use client'

import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { locales } from '@/i18n/routing'
import type { Locale } from '@/i18n/routing'

// Reordered to show Portuguese first
const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português',
  'en': 'English'
}

// Reordered array of locales
const orderedLocales: Locale[] = ['pt-BR', 'en']

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function onLocaleChange(nextLocale: Locale) {
    startTransition(() => {
      const currentPath = pathname.replace(`/${locale}`, '')
      router.replace(`/${nextLocale}${currentPath}`)
    })
  }

  return (
    <nav className="flex justify-center">
      {orderedLocales.map((cur) => {
        const isSelected = locale === cur
        
        return (
          <motion.button
            key={cur}
            onClick={() => onLocaleChange(cur)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2',
              'text-sm font-medium transition-colors duration-200',
              isSelected 
                ? 'text-[#C89B3C]' 
                : 'text-[#A1A1A1] hover:text-white',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
            disabled={isPending}
          >
            <span>{localeNames[cur as Locale]}</span>
            {isSelected && (
              <motion.div
                layoutId="activeLocale"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C89B3C]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
