import { defineRouting } from 'next-intl/routing'

// Definir locales como constantes
const LOCALES = ['en', 'pt-BR'] as const
export type Locale = (typeof LOCALES)[number]
export const locales = LOCALES

export const defaultLocale: Locale = 'pt-BR'

export const localeNames: Record<Locale, string> = {
  'en': 'English',
  'pt-BR': 'Português'
}

export const localeFlags: Record<Locale, string> = {
  'en': '🇺🇸',
  'pt-BR': '🇧🇷'
}

// Configuração de roteamento
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale,
  localePrefix: 'always'
})

// Páginas que não precisam de autenticação
export const publicPages = [
  '/login',
  '/register',
  '/forgot-password'
] as const

// Rotas que devem ignorar o middleware de locale
export const localeIgnorePaths = [
  '/api',
  '/_next',
  '/favicon.ico'
] as const
