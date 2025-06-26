import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/painel-administrativo')) {
    const authToken = request.cookies.get('auth-token')
    
    if (!authToken) {
      return NextResponse.redirect(new URL('/area-administrativa', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/painel-administrativo/:path*']
}