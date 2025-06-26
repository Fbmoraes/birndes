// Database abstraction layer
// This can be easily replaced with a real database later

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

// Global variable to store data in memory (for serverless functions)
let globalData: DatabaseData | null = null

export class Database {
  static async read(): Promise<DatabaseData> {
    // If data is already loaded in memory, return it
    if (globalData) {
      return globalData
    }

    // Try to load from environment variable (for persistence across deployments)
    try {
      const envData = process.env.SITE_DATA
      if (envData) {
        globalData = JSON.parse(envData)
        return globalData
      }
    } catch (error) {
      console.warn('Failed to parse environment data, using defaults')
    }

    // Use default data
    globalData = { ...defaultData }
    return globalData
  }

  static async write(data: DatabaseData): Promise<void> {
    // Update global data
    globalData = { ...data }
    
    // In a real implementation, you would save to a database here
    // For now, we just keep it in memory during the serverless function execution
    console.log('Data updated in memory')
  }

  static async reset(): Promise<void> {
    globalData = { ...defaultData }
  }
}