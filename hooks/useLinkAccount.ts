import { useState } from 'react';
import { RiotApiService } from '~/services/RiotApiService';

export function useLinkAccount() {
  const [isLinked, setIsLinked] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [open, setOpen] = useState(false);

  const linkAccount = async () => {
    try {
      setIsLoadingLink(true);
      await RiotApiService.linkAccount();
      setIsLinked(true);
      setToastMessage('Profile linked successfully.');
    } catch (error) {
      setToastMessage('Error linking profile.');
      console.error(error);
    } finally {
      setIsLoadingLink(false);
      setOpen(true);
    }
  };

  return {
    isLinked,
    isLoadingLink,
    linkAccount,
    toastMessage,
    setToastMessage,
    open,
    setOpen,
  };
}
