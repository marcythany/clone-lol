import createMiddleware from 'next-intl/middleware'
import { type NextRequest } from 'next/server'
import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'

const handleI18nRouting = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  // Primeiro lida com o roteamento i18n
  const response = handleI18nRouting(request)

  // Depois atualiza a sessão do Supabase
  return await updateSession(request, response)
}

export const config = {
  matcher: [
    // Rotas i18n
    '/', '/(pt-BR|en)/:path*',
    // Protege todas as rotas exceto assets e callbacks
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'
  ]
}
