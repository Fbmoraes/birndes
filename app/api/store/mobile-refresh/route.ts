// Special endpoint for mobile devices to force cache refresh
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('Mobile refresh endpoint called')
    
    // Clear server cache to force fresh data
    Database.clearCache()
    
    // Read fresh data
    const data = await Database.read()
    
    // Add version timestamp
    const dataWithVersion = {
      ...data,
      version: Date.now(),
      lastUpdated: new Date().toISOString(),
      mobileRefresh: true
    }
    
    console.log('Mobile refresh - Data fetched:', {
      productsCount: data.products?.length || 0,
      catalogItemsCount: data.catalogItems?.length || 0,
      version: dataWithVersion.version
    })
    
    // Aggressive mobile-specific headers
    const response = NextResponse.json(dataWithVersion)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    response.headers.set('ETag', `"mobile-${dataWithVersion.version}"`)
    response.headers.set('Vary', 'Accept-Encoding, User-Agent')
    
    // Mobile-specific headers
    response.headers.set('X-Accel-Expires', '0')
    response.headers.set('X-Cache-Control', 'no-cache')
    response.headers.set('X-Mobile-Refresh', '1')
    response.headers.set('X-Force-Reload', '1')
    
    // Service Worker headers
    response.headers.set('X-SW-Cache', 'no-cache')
    response.headers.set('Clear-Site-Data', '"cache"')
    
    return response
  } catch (error) {
    console.error('Mobile refresh endpoint error:', error)
    return NextResponse.json({ 
      error: 'Failed to refresh mobile data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}