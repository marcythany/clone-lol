'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SummonerInfoForm } from '@/components/profile/summoner-info-form.client'
import { ProfileFormData } from '@/types/profile'
import axios from 'axios'

export default function LinkProfilePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true)
      console.log('[ProfileForm] Submitting:', data)

      // Call the link endpoint
      const { data: result } = await axios.post('/api/riot/link', data)

      console.log('[ProfileForm] Riot data:', result)

      if (!result.success) {
        throw new Error(result.message || 'Failed to link account')
      }

      // Redirect to profile page
      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('[ProfileForm] Error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#010A13]">
      <SummonerInfoForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
