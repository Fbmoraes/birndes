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
export async function GET() {
  try {
    const data = await Database.read()
    
    // Add headers to prevent caching
    const response = NextResponse.json(data)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    // Check authentication for write operations
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, item } = body // type: 'products' | 'catalogItems' | 'settings'
    
    const data = await Database.read()
    
    if (type === 'products') {
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
      data.products.push(newProduct)
    } else if (type === 'catalogItems') {
      const newItem = {
        ...item,
        id: Date.now(),
      }
      data.catalogItems.push(newItem)
    }
    
    await Database.write(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to create item:', error)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
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

