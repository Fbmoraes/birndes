// Debug endpoint to check data persistence
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/database'

export async function GET() {
  try {
    const data = await Database.read()
    
    return NextResponse.json({
      success: true,
      debug: {
        productsCount: data.products?.length || 0,
        catalogItemsCount: data.catalogItems?.length || 0,
        hasSettings: !!data.settings,
        kvAvailable: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      data: {
        products: data.products?.map(p => ({ id: p.id, name: p.name, category: p.category })) || [],
        catalogItems: data.catalogItems?.map(c => ({ id: c.id, title: c.title })) || [],
        settings: data.settings ? { 
          whatsappNumber: data.settings.whatsappNumber,
          email: data.settings.email 
        } : null,
      }
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        kvAvailable: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (body.action === 'reset') {
      await Database.reset()
      return NextResponse.json({ success: true, message: 'Database reset to defaults' })
    }
    
    if (body.action === 'clearCache') {
      Database.clearCache()
      return NextResponse.json({ success: true, message: 'Cache cleared' })
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Debug POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}