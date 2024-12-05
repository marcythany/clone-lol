import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Region } from 'shieldbow'
import { ProfileFormData } from '@/types'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

interface SummonerInfoFormProps {
  onSubmit: (data: ProfileFormData) => Promise<void>
  loading?: boolean
}

const initialFormState: ProfileFormData = {
  summoner_name: '',
  tag_line: '',
  region: 'br' as Region,
  userId: ''
}

const REGIONS: { value: Region; label: string }[] = [
  { value: 'br', label: 'Brazil' },
  { value: 'eune', label: 'Europe Nordic & East' },
  { value: 'euw', label: 'Europe West' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'Korea' },
  { value: 'lan', label: 'Latin America North' },
  { value: 'las', label: 'Latin America South' },
  { value: 'na', label: 'North America' },
  { value: 'oce', label: 'Oceania' },
  { value: 'tr', label: 'Turkey' },
  { value: 'ru', label: 'Russia' },
];

export function SummonerInfoForm({ onSubmit, loading = false }: SummonerInfoFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialFormState)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations('Profile')
  const router = useRouter()
  const { user } = useAuth()

  const handleChange = (field: keyof ProfileFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  const handleRegionChange = (value: Region) => {
    setFormData(prev => ({
      ...prev,
      region: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !formData.summoner_name || !formData.tag_line || !formData.region) {
      toast.error(t('form.error.missingFields'))
      return
    }

    setIsLoading(true)
    try {
      await onSubmit({
        ...formData,
        userId: user.id
      })
      toast.success(t('form.success'))
      router.refresh()
    } catch (error) {
      console.error('[SummonerInfoForm] Error:', error)
      toast.error(t('form.error.generic'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="summoner_name">{t('form.summonerName')}</Label>
            <Input
              id="summoner_name"
              placeholder={t('form.summonerNamePlaceholder')}
              value={formData.summoner_name}
              onChange={handleChange('summoner_name')}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag_line">{t('form.tagLine')}</Label>
            <Input
              id="tag_line"
              placeholder={t('form.tagLinePlaceholder')}
              value={formData.tag_line}
              onChange={handleChange('tag_line')}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">{t('form.region')}</Label>
          <Select
            value={formData.region}
            onValueChange={handleRegionChange}
            disabled={isLoading}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder={t('form.regionPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map(region => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('form.linking')}
          </>
        ) : (
          t('form.link')
        )}
      </Button>
    </motion.form>
  )
}
