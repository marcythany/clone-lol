import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n/config'
import type { LocaleLayoutProps } from '@/types/i18n'
import { Providers } from '@/app/providers'
import { Inter } from "next/font/google"
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const inter = Inter({ subsets: ["latin"] })

export default async function LocaleLayout({ 
  children, 
  params: { locale } 
}: LocaleLayoutProps) {
  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages({ locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages}
          timeZone="America/Sao_Paulo"
        >
          <Providers>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 relative">
                <div className="absolute inset-0">
                  <Image 
                    src="/images/background.svg"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#010A13]/80 to-[#010A13]/95">
                    <TopBar />
                    <div className="px-8 py-6">
                      {children}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
