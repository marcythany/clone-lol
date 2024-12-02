'use client'

import { Button } from "@/components/ui/button"
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

interface UnlinkButtonProps {
  onUnlink: () => Promise<void>
  isLoading: boolean
}

export function UnlinkButton({ onUnlink, isLoading }: UnlinkButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="destructive" 
          disabled={isLoading}
          className="w-full bg-[#ED4245] hover:bg-[#ED4245]/90 text-white rounded-md py-2.5"
        >
          {isLoading ? "Unlinking..." : "Unlink Riot Account"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1E2124] border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action will unlink your League of Legends account from your profile.
            You can always link it again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-0">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onUnlink}
            disabled={isLoading}
            className="bg-[#ED4245] hover:bg-[#ED4245]/90 text-white"
          >
            {isLoading ? "Unlinking..." : "Unlink Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
