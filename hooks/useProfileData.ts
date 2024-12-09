import { useState, useEffect } from 'react';
import { createClient } from '~/lib/supabase/client';
import { RiotApiService } from '~/services/RiotApiService';
import { RiotSummonerData } from '~/types/riot';
import { User } from '@supabase/supabase-js'; // Importando o tipo User

export function useProfileData() {
  const [profileData, setProfileData] = useState<RiotSummonerData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [fetchProfileError, setFetchProfileError] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoadingProfile(true);

        // Verifica se o usuário está autenticado e se existe
        const userResponse = await createClient().auth.getUser();
        const user = userResponse?.data as unknown as User;

        if (!user || !user.id) {
          throw new Error('User not authenticated or missing ID.');
        }

        // Agora `user.id` pode ser usado com segurança
        const profile = await RiotApiService.getProfileData(user.id);

        setProfileData(profile);
      } catch (error) {
        // Verifica se o erro é uma instância de Error
        if (error instanceof Error) {
          setFetchProfileError(error.message || 'Error fetching profile data.');
        } else {
          setFetchProfileError('An unknown error occurred.');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  return { profileData, isLoadingProfile, fetchProfileError };
}
