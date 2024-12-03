'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Verificar sessão inicial
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        setIsLoading(false);
      } catch (error) {
        console.error('[Auth] Session check error:', error);
        setError(error instanceof Error ? error : new Error('Failed to check session'));
        setIsLoading(false);
      }
    };

    checkSession();

    // Configurar listener de mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Auth] Auth state change:', event);
      
      setIsAuthenticated(!!session);
      setUser(session?.user || null);

      if (event === 'SIGNED_IN') {
        toast.success('Login realizado com sucesso!');
        router.refresh();
      }
      if (event === 'SIGNED_OUT') {
        toast.success('Logout realizado com sucesso!');
        router.refresh();
      }
      if (event === 'USER_UPDATED') {
        setUser(session?.user || null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      router.push('/');
    } catch (error) {
      console.error('[Auth] Sign out error:', error);
      toast.error('Erro ao fazer logout');
      setError(error instanceof Error ? error : new Error('Failed to sign out'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isAuthenticated,
    user,
    error,
    signOut,
  };
}
