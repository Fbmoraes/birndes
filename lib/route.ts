import { NextRequest, NextResponse } from "next/server"

let products: any[] = []
let catalogItems: any[] = []
let settings = {
  whatsappNumber: "(21) 99930-0409",
  email: "contato@printsbrindes.com",
  socialMedia: {
    facebook: "https://facebook.com/printsbrindes",
    instagram: "https://instagram.com/printsbrindes",
    whatsapp: "https://wa.me/5521999300409",
  },
}
let isAuthenticated = false

export async function GET() {
  return NextResponse.json({ products, catalogItems, settings })
}

export async function POST(req: NextRequest) {
  const { type, item } = await req.json()
  if (type === "products") {
    const id = Date.now()
    products.push({ ...item, id })
    return NextResponse.json({ data: { products } })
  }
  if (type === "catalogItems") {
    const id = Date.now()
    catalogItems.push({ ...item, id })
    return NextResponse.json({ data: { catalogItems } })
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 })
}

export async function PUT(req: NextRequest) {
  const { type, id, item } = await req.json()
  if (type === "products") {
    products = products.map((p) => (p.id === id ? { ...p, ...item } : p))
    return NextResponse.json({ data: { products } })
  }
  if (type === "catalogItems") {
    catalogItems = catalogItems.map((c) => (c.id === id ? { ...c, ...item } : c))
    return NextResponse.json({ data: { catalogItems } })
  }
  if (type === "settings") {
    settings = { ...settings, ...item }
    return NextResponse.json({ data: { settings } })
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 })
}

export async function DELETE(req: NextRequest) {
  const { type, id } = await req.json()
  if (type === "products") {
    products = products.filter((p) => p.id !== id)
    return NextResponse.json({ data: { products } })
  }
  if (type === "catalogItems") {
    catalogItems = catalogItems.filter((c) => c.id !== id)
    return NextResponse.json({ data: { catalogItems } })
  }
  return NextResponse.json({ error: "Invalid type" }, { status: 400 })
}

export async function AUTH(req: NextRequest) {
  const { action, username, password } = await req.json()

  if (action === "login") {
    // Troque por sua lógica real de autenticação
    if (username === "admin" && password === "admin") {
      isAuthenticated = true
      return NextResponse.json({ success: true, authenticated: true })
    }
    return NextResponse.json({ success: false, authenticated: false })
  }

  if (action === "logout") {
    isAuthenticated = false
    return NextResponse.json({ success: true, authenticated: false })
  }

  if (action === "check") {
    return NextResponse.json({ authenticated: isAuthenticated })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}