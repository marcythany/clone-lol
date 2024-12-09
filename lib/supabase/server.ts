import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function createClient(
  request: NextRequest,
  response: NextResponse
) {
  const cookieStore = await cookies();

  // Criando o cliente com a chave de serviço no lado do servidor
  return createServerClient(
    process.env.SUPABASE_URL!, // URL do Supabase
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Chave de serviço
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            response.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}
