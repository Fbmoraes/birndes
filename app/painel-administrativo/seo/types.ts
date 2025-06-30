export interface SEOSettings {
  siteTitle: string
  siteDescription: string
  keywords: string
  googleAnalyticsId: string
  googleSearchConsoleId: string
  facebookPixelId: string
  customDomain: string
}

export interface PageData {
  page: string
  views: number
  bounce: string
  time: string
  status: 'good' | 'warning' | 'error'
}

export type BadgeVariant = 'default' | 'secondary' | 'destructive'

export interface AnalyticsData {
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

export interface SEOData {
  organicClicks: number
  impressions: number
  avgPosition: number
  ctr: number
  indexedPages: number
  topKeywords: Array<{
    keyword: string
    position: number
    clicks: number
  }>
  technicalIssues: Array<{
    type: 'error' | 'warning' | 'success'
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  localSEO: {
    googleMyBusinessViews: number
    localRankings: Array<{
      keyword: string
      position: number
    }>
    reviews: {
      total: number
      averageRating: number
      recentReviews: Array<{
        user: string
        rating: number
        comment: string
      }>
    }
  }
  socialMedia: {
    facebookLikes: number
    instagramFollowers: number
    twitterMentions: number
  }
  whatsappSales: {
    totalOrders: number
    totalRevenue: number
    avgOrderValue: number
    avgResponseTime: string
  }
  mobilePerformance: {
    pageLoadTime: number
    mobileBounceRate: number
    mobileTrafficPercentage: number
  }
}
