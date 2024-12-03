import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './utils/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // Skip middleware for static files
  if (request.nextUrl.pathname.startsWith('/images/')) {
    return;
  }

  // Handle i18n routing first
  const response = handleI18nRouting(request);
  
  // Then handle auth session
  return await updateSession(request, response);
}

export const config = {
  // Match all request paths except for:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - images (public assets)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)']
};