import { middleware as i18nMiddleware } from '@/lib/i18n';
import { type NextRequest } from 'next/server';
import { updateSession } from '~/lib/supabase/middleware';

// Middleware para o roteamento de idiomas do Paraglide
export async function middleware(request: NextRequest) {
  // Lida com o roteamento de idiomas usando o middleware do Paraglide
  const response = await i18nMiddleware(request);

  // Atualiza a sessão do usuário no Supabase
  return await updateSession(request, response); // Retorna a resposta com a sessão atualizada
}

export const config = {
  matcher: ['/', '/(pt-BR|en)/:path*'], // Definindo as rotas que vão passar pelo middleware
};
