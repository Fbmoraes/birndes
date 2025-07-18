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
 
 / /   S a l e s   i n t e r f a c e 
 e x p o r t   i n t e r f a c e   S a l e   { 
     _ i d ? :   O b j e c t I d 
     i d :   n u m b e r 
     p r o d u c t I d :   n u m b e r 
     p r o d u c t N a m e :   s t r i n g 
     q u a n t i t y :   n u m b e r 
     u n i t P r i c e :   n u m b e r 
     t o t a l P r i c e :   n u m b e r 
     c u s t o m e r N a m e ? :   s t r i n g 
     c u s t o m e r P h o n e ? :   s t r i n g 
     c u s t o m e r E m a i l ? :   s t r i n g 
     s t a t u s :   " p e n d i n g "   |   " c o n f i r m e d "   |   " c o m p l e t e d "   |   " c a n c e l l e d " 
     p a y m e n t M e t h o d ? :   s t r i n g 
     n o t e s ? :   s t r i n g 
     c r e a t e d A t :   D a t e 
     u p d a t e d A t :   D a t e 
 } 
 
 / /   S a l e s   S u m m a r y   i n t e r f a c e 
 e x p o r t   i n t e r f a c e   S a l e s S u m m a r y   { 
     t o t a l S a l e s :   n u m b e r 
     t o t a l R e v e n u e :   n u m b e r 
     t o t a l O r d e r s :   n u m b e r 
     a v e r a g e O r d e r V a l u e :   n u m b e r 
     t o p P r o d u c t s :   A r r a y < { 
         p r o d u c t I d :   n u m b e r 
         p r o d u c t N a m e :   s t r i n g 
         t o t a l S o l d :   n u m b e r 
         r e v e n u e :   n u m b e r 
     } > 
     r e c e n t S a l e s :   S a l e [ ] 
 } 
 
 / /   M o c k   s a l e s   d a t a   f o r   d e m o n s t r a t i o n 
 e x p o r t   c o n s t   m o c k S a l e s :   S a l e [ ]   =   [ 
     { 
         i d :   1 , 
         p r o d u c t I d :   1 , 
         p r o d u c t N a m e :   " R e l � g i o   P e r s o n a l i z a d o " , 
         q u a n t i t y :   2 , 
         u n i t P r i c e :   9 . 9 , 
         t o t a l P r i c e :   1 9 . 8 , 
         c u s t o m e r N a m e :   " M a r i a   S i l v a " , 
         c u s t o m e r P h o n e :   " ( 2 1 )   9 9 9 9 9 - 1 2 3 4 " , 
         s t a t u s :   " c o m p l e t e d " , 
         p a y m e n t M e t h o d :   " P I X " , 
         c r e a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 5 " ) , 
         u p d a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 5 " ) , 
     } , 
     { 
         i d :   2 , 
         p r o d u c t I d :   3 , 
         p r o d u c t N a m e :   " B o l o   P e r s o n a l i z a d o " , 
         q u a n t i t y :   1 , 
         u n i t P r i c e :   2 5 . 0 , 
         t o t a l P r i c e :   2 5 . 0 , 
         c u s t o m e r N a m e :   " J o � o   S a n t o s " , 
         c u s t o m e r P h o n e :   " ( 2 1 )   9 9 9 9 9 - 5 6 7 8 " , 
         s t a t u s :   " c o m p l e t e d " , 
         p a y m e n t M e t h o d :   " C a r t � o " , 
         c r e a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 6 " ) , 
         u p d a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 6 " ) , 
     } , 
     { 
         i d :   3 , 
         p r o d u c t I d :   2 , 
         p r o d u c t N a m e :   " C a d e r n o   d e   C o l o r i r " , 
         q u a n t i t y :   5 , 
         u n i t P r i c e :   7 . 9 , 
         t o t a l P r i c e :   3 9 . 5 , 
         c u s t o m e r N a m e :   " A n a   C o s t a " , 
         c u s t o m e r P h o n e :   " ( 2 1 )   9 9 9 9 9 - 9 0 1 2 " , 
         s t a t u s :   " c o m p l e t e d " , 
         p a y m e n t M e t h o d :   " P I X " , 
         c r e a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 7 " ) , 
         u p d a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 7 " ) , 
     } , 
     { 
         i d :   4 , 
         p r o d u c t I d :   1 , 
         p r o d u c t N a m e :   " R e l � g i o   P e r s o n a l i z a d o " , 
         q u a n t i t y :   3 , 
         u n i t P r i c e :   9 . 9 , 
         t o t a l P r i c e :   2 9 . 7 , 
         c u s t o m e r N a m e :   " P e d r o   L i m a " , 
         c u s t o m e r P h o n e :   " ( 2 1 )   9 9 9 9 9 - 3 4 5 6 " , 
         s t a t u s :   " p e n d i n g " , 
         p a y m e n t M e t h o d :   " P I X " , 
         c r e a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 8 " ) , 
         u p d a t e d A t :   n e w   D a t e ( " 2 0 2 4 - 0 1 - 1 8 " ) , 
     } , 
 ]  
 