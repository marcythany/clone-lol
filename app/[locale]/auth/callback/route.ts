import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const locale = requestUrl.pathname.split('/')[1] // Get locale from URL path
  const cookieStore = cookies()

  // Criar cliente Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return cookieStore.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll: (cookies) => {
          cookies.map(cookie => {
            cookieStore.set(cookie.name, cookie.value, {
              ...cookie.options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          })
        },
      },
    }
  )

  try {
    // Verificar código de autorização
    const code = requestUrl.searchParams.get('code')
    
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error

      // Redirecionar para home com locale correto
      return NextResponse.redirect(new URL(`/${locale}`, requestUrl.origin))
    }

    // Se não houver código, verificar tokens no hash
    const hashParams = new URLSearchParams(requestUrl.hash?.replace('#', '') || '')
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (!error) {
        // Redirecionar para home com locale correto
        return NextResponse.redirect(new URL(`/${locale}`, requestUrl.origin))
      }
    }

    // Se chegou aqui, algo deu errado
    console.error('Auth callback error: No valid tokens or code found')
    return NextResponse.redirect(new URL(`/${locale}/auth/error`, requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL(`/${locale}/auth/error`, requestUrl.origin))
  }
}
