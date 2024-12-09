'use client';

import { useEffect } from 'react';
import { useRouter } from "@/lib/i18n";
import { createBrowserClient } from '@supabase/ssr';

export default function CallbackPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Erro ao recuperar a sessão:', error.message);
        return;
      }

      if (session) {
        // Se o login for bem-sucedido, redireciona para o perfil ou página principal
        router.push('/profile');
      }
    };

    fetchSession();
  }, [router, supabase]);

  return <div>Redirecionando...</div>;
}
