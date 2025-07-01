import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pagePath = searchParams.get('path')
    
    if (!pagePath) {
      return NextResponse.json(
        { success: false, error: 'Page path is required' },
        { status: 400 }
      )
    }

    const seoData = await DatabaseService.getSEOData(pagePath)
    return NextResponse.json({ success: true, data: seoData })
  } catch (error) {
    console.error('Error fetching SEO data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch SEO data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.page_path) {
      return NextResponse.json(
        { success: false, error: 'Page path is required' },
        { status: 400 }
      )
    }

    const success = await DatabaseService.upsertSEOData(body)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to save SEO data' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving SEO data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save SEO data' },
      { status: 500 }
    )
  }
}