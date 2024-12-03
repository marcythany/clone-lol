'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Auth');
  const supabase = createClient();

  useEffect(() => {
    async function checkHash() {
      // If we have a hash in the URL, try to extract tokens
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (!error) {
              // Successfully set the session, redirect to home
              router.push('/');
              return;
            }
          } catch (error) {
            console.error('Error setting session:', error);
          }
        }
      }
    }
    checkHash();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="text-3xl font-bold text-[#C89B3C]">
            {t('error.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {t('error.description')}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => router.push('/login')}
            className="w-full"
          >
            {t('error.tryAgain')}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/')}
            className="w-full"
          >
            {t('error.backHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
