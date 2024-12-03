import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'pt-BR'] as const
export type Locale = typeof locales[number]

export const defaultLocale = 'pt-BR'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)

// Função auxiliar para obter o nome de exibição do locale
export function getLocaleDisplayName(locale: Locale) {
  switch (locale) {
    case 'en':
      return 'English'
    case 'pt-BR':
      return 'Português'
    default:
      return locale
  }
}