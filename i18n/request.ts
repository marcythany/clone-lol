import { headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './config';
import type { Locale } from './config';

export function getLocale(): Locale {
  const headersList = headers();
  const locale = headersList.get('x-next-locale') || defaultLocale;
  return locale as Locale;
}

export async function getMessages(locale: Locale = defaultLocale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale if requested locale fails to load
    if (locale !== defaultLocale) {
      return getMessages(defaultLocale);
    }
    throw error;
  }
}

export default async function getI18nConfig({ locale }: { locale: Locale }) {
  const messages = await getMessages(locale);
  
  return {
    messages,
    timeZone: 'America/Sao_Paulo',
    now: new Date(),
  };
}