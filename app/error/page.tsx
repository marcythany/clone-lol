'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ErrorPage() {
  const t = useTranslations('Error')
  const router = useRouter()

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/background.svg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#010A13]/80 to-[#010A13]/95">
          <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight text-white">
                {t('title')}
              </h1>
              <p className="text-gray-400">
                {t('description')}
              </p>
              <div className="space-x-4">
                <Button 
                  variant="default"
                  className="bg-[#C89B3C] hover:bg-[#A17A2D] text-black"
                  onClick={() => router.back()}
                >
                  {t('goBack')}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#C89B3C] text-[#C89B3C] hover:bg-[#C89B3C] hover:text-black"
                  onClick={() => router.push('/')}
                >
                  {t('goHome')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
