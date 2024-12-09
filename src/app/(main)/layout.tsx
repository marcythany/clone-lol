import { redirect } from 'i18n/routing';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();
  const { locale } = await params;

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
    redirect({
      href: '/login',
      locale,
    });
  }

  return <div className='min-h-screen'>{children}</div>;
}
