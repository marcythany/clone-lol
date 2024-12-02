'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setUserId(session?.user.id || null);
      setIsLoading(false);

      if (event === 'SIGNED_IN') {
        toast.success('Login realizado com sucesso!');
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        toast.success('Logout realizado com sucesso!');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  return {
    isLoading,
    isAuthenticated,
    userId,
    signOut,
  };
}
