import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[Middleware] Session error:', error)
      return response
    }

    const publicRoutes = ['/login', '/register', '/auth/callback']
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

    if (!session && !isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (session && isPublicRoute && request.nextUrl.pathname !== '/auth/callback') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  } catch (error) {
    console.error('[Middleware] Error in updateSession:', error)
    return response
  }
}