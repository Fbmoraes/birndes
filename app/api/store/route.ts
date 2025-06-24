// API route for products CRUD operations
import { NextRequest, NextResponse } from 'next/server'

// This will be replaced with actual database operations
// For now, using a simple in-memory store that persists to a JSON file

const fs = require('fs').promises
const path = require('path')

const DATA_FILE = path.join(process.cwd(), 'data', 'store.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read data from file
async function readData() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    // Return default data if file doesn't exist
    return {
      products: [
        {
          id: 1,
          name: "Relógio",
          description: "Relógios personalizados para festas e lembrancinhas, com tema, nome e idade à sua escolha!",
          price: 9.9,
          category: "relógios",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "relogio-personalizado",
          personalization: "Nome, idade e tema personalizados",
          productionTime: "3-5 dias úteis",
        },
        {
          id: 2,
          name: "Caderno",
          description: "Caderno de colorir personalizado para festas, lembrancinhas e diversão criativa!",
          price: 7.9,
          category: "cadernos",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "caderno-colorir",
          personalization: "Nome e tema personalizados",
          productionTime: "2-4 dias úteis",
        },
        {
          id: 3,
          name: "Bolos Personalizados",
          description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa.",
          price: 25.0,
          category: "bolos",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "bolos-personalizados",
          personalization: "Tema, cores e decoração personalizados",
          productionTime: "5-7 dias úteis",
        },
      ],
      catalogItems: [
        {
          id: 1,
          title: "Relógios Personalizados",
          description: "Relógios digitais personalizados com nome, letra ou frase especial. Perfeitos para lembrancinhas de festas, presentes criativos...",
          backgroundColor: "bg-pink-200",
          textColor: "text-pink-700",
          buttonColor: "border-pink-500 text-pink-500 hover:bg-pink-50",
          productIds: [1],
          slug: "relogios",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 2,
          title: "Bolos Personalizados",
          description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa. Um toque doce e único!",
          backgroundColor: "bg-yellow-200",
          textColor: "text-yellow-700",
          buttonColor: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
          productIds: [3],
          slug: "bolos",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 3,
          title: "Cadernos de Colorir Personalizados",
          description: "Cadernos de colorir personalizados com nome e tema à sua escolha. Ideais para festas, lembrancinhas e para estimular a...",
          backgroundColor: "bg-purple-200",
          textColor: "text-purple-700",
          buttonColor: "border-purple-500 text-purple-500 hover:bg-purple-50",
          productIds: [2],
          slug: "cadernos",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],
      settings: {
        whatsappNumber: "(21) 99930-0409",
        email: "contato@printsbrindes.com",
        socialMedia: {
          facebook: "https://facebook.com/printsbrindes",
          instagram: "https://instagram.com/printsbrindes",
          whatsapp: "https://wa.me/5521999300409",
        },
      },
    }
  }
}

// Write data to file
async function writeData(data: any) {
  await ensureDataDir()
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET - Fetch all data
export async function GET() {
  try {
    const data = await readData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, item } = body // type: 'products' | 'catalogItems' | 'settings'
    
    const data = await readData()
    
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
    
    await writeData(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

// PUT - Update existing item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, item } = body
    
    const data = await readData()
    
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
    
    await writeData(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE - Remove item
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id } = body
    
    const data = await readData()
    
    if (type === 'products') {
      data.products = data.products.filter((p: any) => p.id !== id)
    } else if (type === 'catalogItems') {
      data.catalogItems = data.catalogItems.filter((c: any) => c.id !== id)
    }
    
    await writeData(data)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}

