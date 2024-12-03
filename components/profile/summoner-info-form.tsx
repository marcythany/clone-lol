'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ProfileFormData } from '@/types/profile'
import { UserPlus } from 'lucide-react'
import { Regions } from 'twisted/dist/constants'

interface SummonerInfoFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>
  loading: boolean
}

export function SummonerInfoForm({ onSubmit, loading }: SummonerInfoFormProps) {
  const [name, setName] = useState('')
  const [tagLine, setTagLine] = useState('')
  const t = useTranslations('Profile')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ 
      summoner_name: name, 
      tag_line: tagLine,
      region: Regions.BRAZIL // Valor padrão para o Brasil
    })
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Banner */}
      <div className="absolute inset-0 h-[300px]" />
      
      <div className="relative z-10 p-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center">
              <UserPlus className="w-12 h-12 text-[#C89B3C]" />
            </div>
            <h1 className="text-2xl font-bold text-[#F0E6D2] mb-2">{t('linkAccount')}</h1>
            <p className="text-[#A09B8C]">{t('linkAccountDescription')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#F0E6D2] mb-2">
                  {t('summonerName')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-[#463714] rounded-lg px-4 py-3 text-[#F0E6D2] placeholder-[#A09B8C] focus:outline-none focus:border-[#C89B3C] transition-colors"
                  placeholder={t('enterSummonerName')}
                />
              </div>

              <div>
                <label htmlFor="tagLine" className="block text-sm font-medium text-[#F0E6D2] mb-2">
                  {t('tagLine')}
                </label>
                <input
                  type="text"
                  id="tagLine"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  required
                  className="w-full border border-[#463714] rounded-lg px-4 py-3 text-[#F0E6D2] placeholder-[#A09B8C] focus:outline-none focus:border-[#C89B3C] transition-colors"
                  placeholder={t('enterTagLine')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#785A28] to-[#C89B3C] hover:from-[#C89B3C] hover:to-[#785A28] text-[#F0E6D2] font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('linking') : t('link')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
