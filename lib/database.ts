// Database abstraction layer with multiple persistence strategies
interface DatabaseData {
  products: any[]
  catalogItems: any[]
  settings: any
}

// Default data
const defaultData: DatabaseData = {
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

const KV_KEY = 'printsbrindes_data'

// Global cache for serverless functions
let globalCache: DatabaseData | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 30 * 1000 // 30 seconds - reduced for better sync

// Check if we're in production with KV available
const isKVAvailable = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
}

// Lazy import KV to avoid errors in development
const getKV = async () => {
  if (isKVAvailable()) {
    try {
      const { kv } = await import('@vercel/kv')
      return kv
    } catch (error) {
      console.warn('Failed to import @vercel/kv:', error)
      return null
    }
  }
  return null
}

export class Database {
  static async read(): Promise<DatabaseData> {
    // Check cache first
    const now = Date.now()
    if (globalCache && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Data loaded from cache')
      return globalCache
    }

    try {
      // Try to read from Vercel KV
      const kv = await getKV()
      if (kv) {
        const data = await kv.get<DatabaseData>(KV_KEY)
        if (data && data.products && data.catalogItems && data.settings) {
          console.log('Data loaded from Vercel KV')
          globalCache = data
          cacheTimestamp = now
          return data
        } else {
          console.log('No valid data in KV, initializing with defaults')
          // Initialize KV with default data
          await kv.set(KV_KEY, defaultData)
          globalCache = { ...defaultData }
          cacheTimestamp = now
          return globalCache
        }
      }
    } catch (error) {
      console.warn('Failed to read from KV:', error)
    }

    // Fallback to default data
    console.log('Using default data (KV not available)')
    globalCache = { ...defaultData }
    cacheTimestamp = now
    return globalCache
  }

  static async write(data: DatabaseData): Promise<void> {
    // Validate data structure
    if (!data || !data.products || !data.catalogItems || !data.settings) {
      throw new Error('Invalid data structure')
    }

    try {
      // Save to Vercel KV
      const kv = await getKV()
      if (kv) {
        await kv.set(KV_KEY, data)
        console.log('Data saved to Vercel KV')
        
        // Update cache
        globalCache = { ...data }
        cacheTimestamp = Date.now()
        return
      }
    } catch (error) {
      console.error('Failed to write to KV:', error)
      throw error
    }

    // Update cache even if KV fails
    globalCache = { ...data }
    cacheTimestamp = Date.now()
    console.log('Data updated in cache (KV not available)')
  }

  static async reset(): Promise<void> {
    try {
      const kv = await getKV()
      if (kv) {
        await kv.set(KV_KEY, defaultData)
        console.log('Data reset in Vercel KV')
      }
    } catch (error) {
      console.error('Failed to reset KV data:', error)
    }

    // Reset cache
    globalCache = { ...defaultData }
    cacheTimestamp = Date.now()
    console.log('Data reset in cache')
  }

  static clearCache(): void {
    globalCache = null
    cacheTimestamp = 0
    console.log('Cache cleared')
  }
}