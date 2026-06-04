import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Forward the pathname so server components can read it via headers()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

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
          const refreshedHeaders = new Headers(request.headers)
          refreshedHeaders.set('x-pathname', request.nextUrl.pathname)
          // request.cookies.set() updates the in-memory cookie store but does
          // NOT write back to request.headers in Next.js 16.  Explicitly rebuild
          // the Cookie header from the updated store so server components receive
          // the refreshed JWT instead of the old expired one.
          refreshedHeaders.set(
            'cookie',
            request.cookies.getAll().map(({ name, value }) => `${name}=${value}`).join('; ')
          )
          response = NextResponse.next({
            request: { headers: refreshedHeaders },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()

  return response
}