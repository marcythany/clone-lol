'use client';

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'i18n/routing';
import { useTransition } from 'react';
import { motion } from 'framer-motion';
import { cn } from 'lib/utils';

type Locale = 'pt-BR' | 'en';

const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português',
  en: 'English',
};

const orderedLocales: Locale[] = ['pt-BR', 'en'];

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onLocaleChange(nextLocale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <nav className='flex justify-center'>
      {orderedLocales.map((cur) => {
        const isSelected = locale === cur;

        return (
          <motion.div key={cur}>
            <motion.div>
              <button
                onClick={() => onLocaleChange(cur)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2',
                  'text-sm font-medium transition-colors duration-200',
                  isSelected
                    ? 'text-[#C89B3C]'
                    : 'text-[#A1A1A1] hover:text-white',
                  isPending && 'cursor-not-allowed opacity-50'
                )}
                disabled={isPending}
              >
                <span>{localeNames[cur]}</span>
                {isSelected && (
                  <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#C89B3C]'>
                    <motion.div
                      layoutId='activeLocale'
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </button>
            </motion.div>
          </motion.div>
        );
      })}
    </nav>
  );
}
