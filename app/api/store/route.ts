// API route for products CRUD operations with MongoDB persistence
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { DatabaseService } from '@/lib/database-service'
import { testConnection } from '@/lib/mongodb'

// Check authentication
function checkAuth(request: NextRequest) {
  const cookieStore = cookies()
  const authToken = cookieStore.get('auth-token')
  return !!authToken?.value && authToken.value.startsWith('auth_')
}

// GET - Fetch all data
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/store - Fetching data from MongoDB')
    
    // Test connection and initialize if needed
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error('Database connection failed')
    }

    // Initialize database with default data if empty
    try {
      await DatabaseService.initializeDatabase()
    } catch (initError) {
      console.warn('Database initialization warning:', initError)
    }

    const data = await DatabaseService.getAllData()
    
    console.log('GET /api/store - Data fetched successfully:', {
      productsCount: data.products?.length || 0,
      catalogItemsCount: data.catalogItems?.length || 0,
      version: data.version
    })
    
    // Add aggressive headers to prevent caching on mobile devices
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    response.headers.set('Last-Modified', new Date().toUTCString())
    response.headers.set('ETag', `"${data.version}"`)
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
      itemName: body.item?.name || body.item?.title,
      payloadSize: bodyText.length 
    })
    
    const { type, item } = body // type: 'products' | 'catalogItems' | 'settings'
    
    if (!type || !item) {
      console.error('POST /api/store - Missing type or item in request body')
      return NextResponse.json({ error: 'Missing type or item in request body' }, { status: 400 })
    }

    let result
    
    if (type === 'products') {
      if (!item.name || !item.description || !item.price || !item.category) {
        console.error('POST /api/store - Missing required product fields')
        return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 })
      }

      // Generate slug
      const slug = item.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "")
        .trim() || `produto-${Date.now()}`

      const productData = {
        ...item,
        slug,
        isActive: true,
      }
      
      console.log('POST /api/store - Creating new product:', { name: productData.name, slug: productData.slug })
      result = await DatabaseService.createProduct(productData)
      
    } else if (type === 'catalogItems') {
      if (!item.title || !item.description) {
        console.error('POST /api/store - Missing required catalog item fields')
        return NextResponse.json({ error: 'Missing required catalog item fields' }, { status: 400 })
      }

      const catalogItemData = {
        ...item,
        isActive: true,
      }
      
      console.log('POST /api/store - Creating new catalog item:', { title: catalogItemData.title })
      result = await DatabaseService.createCatalogItem(catalogItemData)
    } else {
      console.error('POST /api/store - Invalid type:', type)
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    
    console.log('POST /api/store - Item created successfully:', result.id)
    
    // Get updated data
    const data = await DatabaseService.getAllData()
    
    // Add version info to response
    const responseData = {
      success: true,
      data: {
        ...data,
        operation: type === 'products' ? 'product_added' : 'catalog_added'
      },
      created: result
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
    
    if (!type || !id || !item) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let success = false
    
    if (type === 'products') {
      success = await DatabaseService.updateProduct(id, item)
    } else if (type === 'catalogItems') {
      success = await DatabaseService.updateCatalogItem(id, item)
    } else if (type === 'settings') {
      success = await DatabaseService.updateSettings(item)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update item' }, { status: 404 })
    }

    const data = await DatabaseService.getAllData()
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
    
    if (!type || !id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let success = false
    
    if (type === 'products') {
      success = await DatabaseService.deleteProduct(id)
    } else if (type === 'catalogItems') {
      success = await DatabaseService.deleteCatalogItem(id)
    }
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 404 })
    }

    const data = await DatabaseService.getAllData()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to delete item:', error)
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

