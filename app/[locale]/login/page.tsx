import { AuthForm } from '@/components/auth/auth-form'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import type { PageProps } from '@/types/i18n'
import Image from 'next/image'

export default async function LoginPage({ params, searchParams }: PageProps) {
  setRequestLocale(params.locale)
  const t = await getTranslations('Auth')

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0">
        <Image
          src="/images/background.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010A13]/80 to-[#010A13]/95">
          <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <div className="relative h-16 mb-4">
                  <Image
                    src="/images/lol_logo.svg"
                    alt="League of Legends"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-8 mb-8">
                  <Image
                    src="/images/lol_name.svg"
                    alt="League of Legends"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {t('title')}
                </h1>
                <p className="mt-2 text-sm text-gray-400">
                  {t('description')}
                </p>
              </div>
              <AuthForm mode={'login'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
