import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicPages = ['/', '/login', '/register']

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  // Check if it's a public page
  const isPublicPage = publicPages.some(page => 
    request.nextUrl.pathname.endsWith(page)
  )

  // Get session
  const { data: { session } } = await supabase.auth.getSession()

  // Handle authentication
  if (!session && !isPublicPage) {
    // Get the current locale from the URL
    const pathParts = request.nextUrl.pathname.split('/')
    const locale = pathParts[1] || 'en' // Default to 'en' if no locale found
    
    // Redirect to login page with the current locale
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}/login`
    return NextResponse.redirect(redirectUrl)
  }

  if (session && (request.nextUrl.pathname.endsWith('/login') || request.nextUrl.pathname.endsWith('/register'))) {
    // Get the current locale
    const pathParts = request.nextUrl.pathname.split('/')
    const locale = pathParts[1] || 'en'
    
    // Redirect to home page with the current locale
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = `/${locale}`
    return NextResponse.redirect(redirectUrl)
  }

  return response
}