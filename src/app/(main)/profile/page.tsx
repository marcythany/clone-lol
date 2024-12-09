'use client';

import { useTranslations } from 'next-intl';
import { ToastProvider, Toast } from '@radix-ui/react-toast';
import { Skeleton } from 'components/ui/skeleton';
import { SummonerProfile } from '~/components/profile/SummonerProfile';
import { ProfileTabs } from '~/components/profile/ProfileTabs';
import { LinkButton } from '~/components/profile/LinkButton';
import { useProfileData } from '~/hooks/useProfileData';
import { useLinkAccount } from '~/hooks/useLinkAccount';
import { Regions } from '~/types/riot';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { profileData, isLoadingProfile, fetchProfileError } = useProfileData();
  const {
    isLinked,
    isLoadingLink,
    linkAccount,
    toastMessage,
    setToastMessage,
    open,
    setOpen,
  } = useLinkAccount();

  return (
    <div className='profile-page'>
      <ToastProvider>
        <Toast open={open} onOpenChange={setOpen}>
          {toastMessage}
        </Toast>

        {isLoadingProfile ? (
          <Skeleton className='h-96 w-full' />
        ) : fetchProfileError ? (
          <div className='error-message'>{t('Error loading profile.')}</div>
        ) : (
          profileData && (
            <div className='profile-info'>
              <SummonerProfile
                summonerData={profileData.summoner}
                leagues={profileData.leagues}
              />
              <ProfileTabs
                puuid={profileData.puuid}
                region={profileData.region as Regions}
              />
            </div>
          )
        )}

        <LinkButton
          onClick={linkAccount}
          isLinked={isLinked}
          isLoading={isLoadingLink}
        />
      </ToastProvider>
    </div>
  );
}
