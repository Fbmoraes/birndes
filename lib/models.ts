import { ObjectId } from 'mongodb'

// Product interface
export interface Product {
  _id?: ObjectId
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  mainImage: string
  showOnHome: boolean
  slug: string
  personalization?: string
  productionTime?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Catalog Item interface
export interface CatalogItem {
  _id?: ObjectId
  id: number
  title: string
  description: string
  backgroundColor: string
  textColor: string
  buttonColor: string
  productIds: number[]
  slug: string
  image: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Settings interface
export interface Settings {
  _id?: ObjectId
  whatsappNumber: string
  email: string
  socialMedia: {
    facebook: string
    instagram: string
    whatsapp: string
  }
  seo: {
    title: string
    description: string
    keywords: string
    googleAnalyticsId?: string
    googleSearchConsoleId?: string
    facebookPixelId?: string
  }
  updatedAt: Date
}

// Analytics interface
export interface Analytics {
  _id?: ObjectId
  date: Date
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    views: number
  }>
  topProducts: Array<{
    productId: number
    views: number
  }>
  deviceStats: {
    desktop: number
    mobile: number
    tablet: number
  }
  trafficSources: {
    organic: number
    direct: number
    social: number
    referral: number
  }
}

// SEO Data interface
export interface SEOData {
  _id?: ObjectId
  date: Date
  organicClicks: number
  impressions: number
  averagePosition: number
  clickThroughRate: number
  topKeywords: Array<{
    keyword: string
    clicks: number
    impressions: number
    position: number
  }>
  topPages: Array<{
    page: string
    clicks: number
    impressions: number
  }>
}

// Default data for initialization
export const defaultProducts: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>[] = [
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
]

export const defaultCatalogItems: Omit<CatalogItem, '_id' | 'createdAt' | 'updatedAt'>[] = [
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
]

export const defaultSettings: Omit<Settings, '_id' | 'updatedAt'> = {
  whatsappNumber: "(21) 99930-0409",
  email: "contato@printsbrindes.com",
  socialMedia: {
    facebook: "https://facebook.com/printsbrindes",
    instagram: "https://instagram.com/printsbrindes",
    whatsapp: "https://wa.me/5521999300409",
  },
  seo: {
    title: "PrintsBrindes - Presentes e Artigos Personalizados",
    description: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
  },
}