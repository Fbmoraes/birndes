// API route for authentication
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple authentication - in production, use proper JWT and password hashing
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'printsbrindes2024'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password, action } = body

    if (action === 'login') {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Generate a more secure token
        const token = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Set authentication cookie
        const response = NextResponse.json({ success: true, authenticated: true })
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        })
        return response
      } else {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
      }
    } else if (action === 'logout') {
      const response = NextResponse.json({ success: true, authenticated: false })
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
      })
      return response
    } else if (action === 'check') {
      const cookieStore = cookies()
      const authToken = cookieStore.get('auth-token')
      const isAuthenticated = !!authToken?.value && authToken.value.startsWith('auth_')
      return NextResponse.json({ 
        success: true, 
        authenticated: isAuthenticated
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

