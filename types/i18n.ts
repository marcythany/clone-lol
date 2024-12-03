import { ReactNode } from 'react'
import { Locale } from '@/i18n/config'

export interface ProvidersProps {
  children: ReactNode
  locale?: Locale
  messages?: Record<string, any>
  timeZone?: string
  now?: Date
}

export interface PageProps {
  params: {
    locale: Locale
  }
  searchParams?: {
    redirect?: string
    [key: string]: string | undefined
  }
}

export interface LocaleLayoutProps {
  children: ReactNode
  params: {
    locale: Locale
  }
}

export type { Locale }
