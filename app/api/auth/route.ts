import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, username, password } = body

    if (action === 'login') {
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const cookieStore = cookies()
        const token = `auth_${Date.now()}_${Math.random().toString(36).substring(7)}`
        
        cookieStore.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return NextResponse.json({ success: true, message: 'Login successful' })
      } else {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        )
      }
    }

    if (action === 'logout') {
      const cookieStore = cookies()
      cookieStore.delete('auth-token')
      return NextResponse.json({ success: true, message: 'Logout successful' })
    }

    if (action === 'check') {
      const cookieStore = cookies()
      const authToken = cookieStore.get('auth-token')
      const isAuthenticated = !!authToken?.value && authToken.value.startsWith('auth_')
      
      return NextResponse.json({ 
        success: true, 
        authenticated: isAuthenticated 
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}