// API route for products CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { Database } from '@/lib/database'

// Check authentication
function checkAuth(request: NextRequest) {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth-token')
  return !!authToken?.value && authToken.value.startsWith('auth_')
}

// GET - Fetch all data
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/store - Fetching data')
    const data = await Database.read()
    
    // Add version timestamp and operation info
    const dataWithVersion = {
      ...data,
      version: Date.now(),
      lastUpdated: new Date().toISOString(),
      operation: 'read',
      serverTime: Date.now()
    }
    
    console.log('GET /api/store - Data fetched successfully:', {
      productsCount: data.products?.length || 0,
      catalogItemsCount: data.catalogItems?.length || 0,
      version: dataWithVersion.version
    })
    
    // Add aggressive headers to prevent caching on mobile devices
    const response = NextResponse.json(dataWithVersion)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    response.headers.set('ETag', `"${dataWithVersion.version}"`)
    response.headers.set('Vary', 'Accept-Encoding, User-Agent')
    
    // Mobile-specific headers
    response.headers.set('X-Accel-Expires', '0')
    response.headers.set('X-Cache-Control', 'no-cache')
    
    return response
  } catch (error) {
    console.error('GET /api/store - Failed to fetch data:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/store - Starting request')
    
    // Check authentication for write operations
    if (!checkAuth(request)) {
      console.log('POST /api/store - Authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('POST /api/store - Authentication successful')

    const bodyText = await request.text()
    
    // Check payload size (limit to 1MB to avoid 413 errors)
    if (bodyText.length > 1024 * 1024) {
      console.error('POST /api/store - Payload too large:', bodyText.length, 'bytes')
      return NextResponse.json({ 
        error: 'Payload too large. Please reduce image sizes.',
        size: bodyText.length,
        limit: 1024 * 1024
      }, { status: 413 })
    }
    
    const body = JSON.parse(bodyText)
    console.log('POST /api/store - Request body:', { 
      type: body.type, 
      itemName: body.item?.name,
      payloadSize: bodyText.length 
    })
    
    const { type, item } = body // type: 'products' | 'catalogItems' | 'settings'
    
    if (!type || !item) {
      console.error('POST /api/store - Missing type or item in request body')
      return NextResponse.json({ error: 'Missing type or item in request body' }, { status: 400 })
    }

    console.log('POST /api/store - Reading database')
    const data = await Database.read()
    console.log('POST /api/store - Database read successful, current products:', data.products?.length || 0)
    
    if (type === 'products') {
      if (!item.name || !item.description || !item.price || !item.category) {
        console.error('POST /api/store - Missing required product fields')
        return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 })
      }

      const newProduct = {
        ...item,
        id: Date.now(),
        slug: item.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
          .trim() || `produto-${Date.now()}`,
      }
      
      console.log('POST /api/store - Adding new product:', { id: newProduct.id, name: newProduct.name, slug: newProduct.slug })
      data.products.push(newProduct)
      
    } else if (type === 'catalogItems') {
      const newItem = {
        ...item,
        id: Date.now(),
      }
      console.log('POST /api/store - Adding new catalog item:', { id: newItem.id, title: newItem.title })
      data.catalogItems.push(newItem)
    } else {
      console.error('POST /api/store - Invalid type:', type)
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    console.log('POST /api/store - Writing to database')
    await Database.write(data)
    console.log('POST /api/store - Database write successful, total products:', data.products?.length || 0)
    
    // Add version info to response
    const responseData = {
      success: true,
      data: {
        ...data,
        version: Date.now(),
        lastUpdated: new Date().toISOString(),
        operation: type === 'products' ? 'product_added' : 'catalog_added'
      }
    }
    
    // Add headers to prevent caching
    const response = NextResponse.json(responseData)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('POST /api/store - Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create item'
    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}

// PUT - Update existing item
export async function PUT(request: NextRequest) {
  try {
    // Check authentication for write operations
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, item } = body
    
    const data = await Database.read()
    
    if (type === 'products') {
      const index = data.products.findIndex((p: any) => p.id === id)
      if (index !== -1) {
        data.products[index] = { ...data.products[index], ...item }
      }
    } else if (type === 'catalogItems') {
      const index = data.catalogItems.findIndex((c: any) => c.id === id)
      if (index !== -1) {
        data.catalogItems[index] = { ...data.catalogItems[index], ...item }
      }
    } else if (type === 'settings') {
      data.settings = { ...data.settings, ...item }
    }
    
    await Database.write(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to update item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE - Remove item
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication for write operations
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id } = body
    
    const data = await Database.read()
    
    if (type === 'products') {
      data.products = data.products.filter((p: any) => p.id !== id)
    } else if (type === 'catalogItems') {
      data.catalogItems = data.catalogItems.filter((c: any) => c.id !== id)
    }
    
    await Database.write(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to delete item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

