import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Loader2, Unlink } from 'lucide-react'
import { motion } from 'framer-motion'

interface UnlinkButtonProps {
  onUnlink: () => Promise<void>
}

export function UnlinkButton({ onUnlink }: UnlinkButtonProps) {
  const t = useTranslations('Profile')
  const [loading, setLoading] = useState(false)

  const handleUnlink = async () => {
    setLoading(true)
    await onUnlink()
    setLoading(false)
  }

  return (
    <motion.div 
      className="glass-elevation-1 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#C89B3C] mb-2">
            {t('unlinkAccount')}
          </h2>
          <p className="text-sm text-gray-400">
            {t('unlinkDescription')}
          </p>
        </div>
        <Button
          onClick={handleUnlink}
          variant="destructive"
          disabled={loading}
          className="glass-elevation-2 hover:glass-elevation-3"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('unlinking')}
            </motion.div>
          ) : (
            <div className="flex items-center gap-2">
              <Unlink className="h-4 w-4" />
              {t('unlink')}
            </div>
          )}
        </Button>
      </div>
    </motion.div>
  )
}
