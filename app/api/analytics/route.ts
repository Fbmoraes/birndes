import { NextRequest, NextResponse } from 'next/server'

// Interface para dados de analytics
interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  conversionRate: number
  avgOrderValue: number
  totalOrders: number
  totalRevenue: number
  topProducts: Array<{
    name: string
    orders: number
    revenue: number
  }>
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  timeOnSite: string
  bounceRate: number
}

// Simulação de dados reais baseados no comportamento do site
function generateRealisticAnalytics(): AnalyticsData {
  const now = new Date()
  const currentHour = now.getHours()
  const dayOfWeek = now.getDay()
  
  // Ajustar dados baseado no horário e dia da semana
  let baseMultiplier = 1
  
  // Horários de pico (10h-12h e 14h-18h)
  if ((currentHour >= 10 && currentHour <= 12) || (currentHour >= 14 && currentHour <= 18)) {
    baseMultiplier = 1.5
  }
  
  // Fins de semana têm mais tráfego
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    baseMultiplier *= 1.3
  }
  
  // Dados base realistas para um site de brindes
  const basePageViews = Math.floor((800 + Math.random() * 400) * baseMultiplier)
  const baseUniqueVisitors = Math.floor(basePageViews * (0.6 + Math.random() * 0.2))
  
  return {
    pageViews: basePageViews,
    uniqueVisitors: baseUniqueVisitors,
    conversionRate: Number((2.5 + Math.random() * 2).toFixed(1)),
    avgOrderValue: Number((45 + Math.random() * 30).toFixed(2)),
    totalOrders: Math.floor(baseUniqueVisitors * 0.025),
    totalRevenue: Number((baseUniqueVisitors * 0.025 * (45 + Math.random() * 30)).toFixed(2)),
    topProducts: [
      { name: "Canecas Personalizadas", orders: Math.floor(15 + Math.random() * 10), revenue: Number((450 + Math.random() * 200).toFixed(2)) },
      { name: "Cadernos de Colorir", orders: Math.floor(12 + Math.random() * 8), revenue: Number((360 + Math.random() * 150).toFixed(2)) },
      { name: "Relógios Personalizados", orders: Math.floor(8 + Math.random() * 6), revenue: Number((320 + Math.random() * 180).toFixed(2)) },
      { name: "Bolos Decorados", orders: Math.floor(6 + Math.random() * 4), revenue: Number((280 + Math.random() * 120).toFixed(2)) },
      { name: "Lembrancinhas de Festa", orders: Math.floor(10 + Math.random() * 7), revenue: Number((200 + Math.random() * 100).toFixed(2)) }
    ],
    trafficSources: [
      { source: "Busca Orgânica", visitors: Math.floor(baseUniqueVisitors * 0.45), percentage: 45 },
      { source: "Redes Sociais", visitors: Math.floor(baseUniqueVisitors * 0.25), percentage: 25 },
      { source: "Direto", visitors: Math.floor(baseUniqueVisitors * 0.15), percentage: 15 },
      { source: "WhatsApp", visitors: Math.floor(baseUniqueVisitors * 0.10), percentage: 10 },
      { source: "Outros", visitors: Math.floor(baseUniqueVisitors * 0.05), percentage: 5 }
    ],
    deviceStats: {
      mobile: Math.floor(baseUniqueVisitors * 0.65),
      desktop: Math.floor(baseUniqueVisitors * 0.25),
      tablet: Math.floor(baseUniqueVisitors * 0.10)
    },
    timeOnSite: `${Math.floor(2 + Math.random() * 2)}m ${Math.floor(10 + Math.random() * 50)}s`,
    bounceRate: Number((35 + Math.random() * 15).toFixed(1))
  }
}

// Dados de SEO mais realistas
function generateSEOMetrics() {
  return {
    organicClicks: Math.floor(180 + Math.random() * 120),
    impressions: Math.floor(4500 + Math.random() * 2000),
    avgPosition: Number((8.5 + Math.random() * 6).toFixed(1)),
    ctr: Number((3.2 + Math.random() * 2.5).toFixed(1)),
    indexedPages: Math.floor(45 + Math.random() * 15),
    topKeywords: [
      { keyword: "presentes personalizados guaratiba", position: Math.floor(3 + Math.random() * 5), clicks: Math.floor(25 + Math.random() * 15) },
      { keyword: "brindes festa rio de janeiro", position: Math.floor(5 + Math.random() * 8), clicks: Math.floor(18 + Math.random() * 12) },
      { keyword: "canecas personalizadas rj", position: Math.floor(4 + Math.random() * 6), clicks: Math.floor(22 + Math.random() * 10) },
      { keyword: "lembrancinhas personalizadas", position: Math.floor(6 + Math.random() * 10), clicks: Math.floor(15 + Math.random() * 8) },
      { keyword: "bolos decorados guaratiba", position: Math.floor(2 + Math.random() * 4), clicks: Math.floor(30 + Math.random() * 20) }
    ],
    technicalIssues: [
      { type: "success", title: "Velocidade de Carregamento", description: "Site carrega em menos de 3 segundos", priority: "low" },
      { type: "success", title: "Mobile-Friendly", description: "Site otimizado para dispositivos móveis", priority: "low" },
      { type: "warning", title: "Meta Descriptions", description: "3 páginas sem meta description", priority: "medium" },
      { type: "error", title: "Imagens sem Alt Text", description: "12 imagens precisam de texto alternativo", priority: "high" }
    ],
    localSEO: {
      googleMyBusinessViews: Math.floor(1200 + Math.random() * 800),
      localRankings: [
        { keyword: "presentes personalizados guaratiba", position: Math.floor(1 + Math.random() * 3) },
        { keyword: "brindes guaratiba", position: Math.floor(2 + Math.random() * 4) },
        { keyword: "canecas personalizadas rj", position: Math.floor(1 + Math.random() * 5) }
      ],
      reviews: {
        total: 45,
        averageRating: 4.6,
        recentReviews: [
          { user: "Maria", rating: 5, comment: "Excelente atendimento e qualidade!" },
          { user: "João", rating: 4, comment: "Entrega rápida e produtos ótimos." }
        ]
      }
    },
    socialMedia: {
      facebookLikes: Math.floor(500 + Math.random() * 300),
      instagramFollowers: Math.floor(1200 + Math.random() * 800),
      twitterMentions: Math.floor(50 + Math.random() * 30)
    },
    whatsappSales: {
      totalOrders: Math.floor(20 + Math.random() * 15),
      totalRevenue: Number((1000 + Math.random() * 500).toFixed(2)),
      avgOrderValue: Number((50 + Math.random() * 20).toFixed(2)),
      avgResponseTime: `${Math.floor(1 + Math.random() * 3)}m ${Math.floor(Math.random() * 60)}s`
    },
    mobilePerformance: {
      pageLoadTime: Number((1.5 + Math.random() * 1.5).toFixed(2)),
      mobileBounceRate: Number((30 + Math.random() * 10).toFixed(1)),
      mobileTrafficPercentage: Math.floor(60 + Math.random() * 20)
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    
    const analyticsData = generateRealisticAnalytics()
    const seoData = generateSEOMetrics()
    
    if (type === 'analytics') {
      return NextResponse.json({
        success: true,
        data: analyticsData,
        timestamp: new Date().toISOString()
      })
    }
    
    if (type === 'seo') {
      return NextResponse.json({
        success: true,
        data: seoData,
        timestamp: new Date().toISOString()
      })
    }
    
    // Retornar todos os dados
    return NextResponse.json({
      success: true,
      data: {
        analytics: analyticsData,
        seo: seoData
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dados de analytics' },
      { status: 500 }
    )
  }
}

// Endpoint para registrar pedidos do WhatsApp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, orderData } = body
    
    if (action === 'track_whatsapp_order') {
      // Aqui você salvaria os dados do pedido em um banco de dados
      // Por enquanto, vamos apenas simular o salvamento
      console.log('WhatsApp order tracked:', orderData)
      
      return NextResponse.json({
        success: true,
        message: 'Pedido registrado com sucesso',
        orderId: `WA-${Date.now()}`
      })
    }
    
    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Analytics POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}