'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface UnlinkButtonProps {
  onUnlink: () => Promise<void>
}

export function UnlinkButton({ onUnlink }: UnlinkButtonProps) {
  const [isUnlinking, setIsUnlinking] = useState(false)
  const t = useTranslations('Profile')

  const handleUnlink = async () => {
    setIsUnlinking(true)
    try {
      await onUnlink()
    } finally {
      setIsUnlinking(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="w-full bg-[#ED4245] hover:bg-[#ED4245]/90 text-white"
          disabled={isUnlinking}
        >
          {t('unlink')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#2B2D31] border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {t('unlinkConfirm')}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {t('unlinkDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnlink}
            disabled={isUnlinking}
            className="bg-[#ED4245] hover:bg-[#ED4245]/90 text-white"
          >
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
