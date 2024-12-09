import { redirect } from '@/lib/i18n'; // Importando o 'redirect' de i18n configurado com Paraglide
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();
  const { locale } = await params; // Obtemos o idioma a partir dos parâmetros

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          })),
        setAll: (cookies) => {
          cookies.map((cookie) => {
            cookieStore.set(cookie.name, cookie.value, {
              ...cookie.options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Redirecionar para a página de login com o idioma correto
    redirect('/login', { locale }); // A mudança aqui, passando o objeto separando 'href' e 'locale'
  }

  return (
    <div className='grid min-h-screen place-items-center p-4'>
      {children} {/* Exibe os filhos se o usuário estiver autenticado */}
    </div>
  );
}
