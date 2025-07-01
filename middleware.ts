import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/painel-administrativo')) {
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/area-administrativa', request.url))
    }
  }

  // Add cache control headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/painel-administrativo/:path*', '/api/:path*']
}