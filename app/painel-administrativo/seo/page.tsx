"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Search, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Users,
  Clock,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react'

interface SEOMetrics {
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
    type: 'success' | 'warning' | 'error'
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
  }>
}

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  timeOnSite: string
  deviceStats: {
    mobile: number
    desktop: number
    tablet: number
  }
  trafficSources: Array<{
    source: string
    visitors: number
    percentage: number
  }>
}

interface SEOSettings {
  siteTitle: string
  siteDescription: string
  keywords: string
  customDomain: string
  googleAnalyticsId: string
  googleSearchConsoleId: string
  facebookPixelId: string
}

export default function SEODashboard() {
  const router = useRouter()
  const [seoData, setSeoData] = useState<SEOMetrics | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    siteTitle: "PrintsBrindes - Presentes e Artigos Personalizados",
    siteDescription: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos, lembrancinhas, guaratiba, rio de janeiro",
    customDomain: "",
    googleAnalyticsId: "",
    googleSearchConsoleId: "",
    facebookPixelId: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data.analytics)
        setSeoData(result.data.seo)
        setLastUpdate(new Date().toLocaleString('pt-BR'))
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSEOSettings = async () => {
    try {
      // Save SEO settings to database
      const response = await fetch('/api/store', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'settings',
          id: 1,
          item: {
            seo: {
              title: seoSettings.siteTitle,
              description: seoSettings.siteDescription,
              keywords: seoSettings.keywords,
              googleAnalyticsId: seoSettings.googleAnalyticsId,
              googleSearchConsoleId: seoSettings.googleSearchConsoleId,
              facebookPixelId: seoSettings.facebookPixelId,
            }
          }
        })
      })

      if (response.ok) {
        alert("✅ Configurações de SEO salvas com sucesso!")
      } else {
        throw new Error('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de SEO:', error)
      alert("❌ Erro ao salvar configurações. Tente novamente.")
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-pink-500" />
          <p className="text-gray-600">Carregando dados do SEO...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/painel-administrativo')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard SEO Avançado</h1>
                <p className="text-gray-600">Monitore e otimize a performance do seu site nos mecanismos de busca</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Última atualização: {lastUpdate}
              </div>
              <Button onClick={fetchData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="keywords">Palavras-chave</TabsTrigger>
            <TabsTrigger value="technical">Análise Técnica</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cliques Orgânicos</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seoData?.organicClicks || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressões</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seoData?.impressions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    +8% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Posição Média</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seoData?.avgPosition || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    -0.5 posições (melhoria)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{seoData?.ctr || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.3% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources and Device Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Tráfego</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyticsData?.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className="text-sm font-medium">{source.source}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{source.visitors}</span>
                        <Badge variant="secondary">{source.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dispositivos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Mobile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{analyticsData?.deviceStats.mobile || 0}</span>
                      <Badge variant="secondary">65%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Desktop</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{analyticsData?.deviceStats.desktop || 0}</span>
                      <Badge variant="secondary">25%</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tablet className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Tablet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{analyticsData?.deviceStats.tablet || 0}</span>
                      <Badge variant="secondary">10%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Site Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analyticsData?.pageViews || 0}</div>
                    <p className="text-sm text-gray-600">Visualizações</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analyticsData?.uniqueVisitors || 0}</div>
                    <p className="text-sm text-gray-600">Visitantes Únicos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{analyticsData?.bounceRate || 0}%</div>
                    <p className="text-sm text-gray-600">Taxa de Rejeição</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{analyticsData?.timeOnSite || '0m 0s'}</div>
                    <p className="text-sm text-gray-600">Tempo no Site</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keywords Tab */}
          <TabsContent value="keywords" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Palavras-chave</CardTitle>
                <p className="text-sm text-gray-600">Palavras-chave que mais trazem tráfego para seu site</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoData?.topKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{keyword.keyword}</h4>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-600">Posição: {keyword.position}</span>
                          <span className="text-sm text-gray-600">Cliques: {keyword.clicks}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={keyword.position <= 3 ? "default" : keyword.position <= 10 ? "secondary" : "outline"}
                        >
                          #{keyword.position}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise Técnica SEO</CardTitle>
                <p className="text-sm text-gray-600">Problemas técnicos que podem afetar seu ranking</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seoData?.technicalIssues.map((issue, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{issue.title}</h4>
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority === 'high' ? 'Alta' : issue.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO Score */}
            <Card>
              <CardHeader>
                <CardTitle>Score SEO Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Performance Técnica</span>
                      <span className="text-sm text-gray-600">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Otimização de Conteúdo</span>
                      <span className="text-sm text-gray-600">78/100</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Experiência do Usuário</span>
                      <span className="text-sm text-gray-600">92/100</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Score Geral</span>
                      <span className="text-sm font-bold text-green-600">85/100</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações SEO</CardTitle>
                <p className="text-sm text-gray-600">Configure as informações básicas do seu site</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="siteTitle">Título Principal do Site</Label>
                      <Input
                        id="siteTitle"
                        value={seoSettings.siteTitle}
                        onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                        placeholder="Título do seu site"
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">Descrição Meta</Label>
                      <Textarea
                        id="siteDescription"
                        value={seoSettings.siteDescription}
                        onChange={(e) => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
                        placeholder="Descrição do seu site"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="keywords">Palavras-chave Principais</Label>
                      <Textarea
                        id="keywords"
                        value={seoSettings.keywords}
                        onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                        placeholder="palavra1, palavra2, palavra3"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                      <Input
                        id="googleAnalytics"
                        value={seoSettings.googleAnalyticsId}
                        onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="searchConsole">Google Search Console</Label>
                      <Input
                        id="searchConsole"
                        value={seoSettings.googleSearchConsoleId}
                        onChange={(e) => setSeoSettings({ ...seoSettings, googleSearchConsoleId: e.target.value })}
                        placeholder="Código de verificação"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                      <Input
                        id="facebookPixel"
                        value={seoSettings.facebookPixelId}
                        onChange={(e) => setSeoSettings({ ...seoSettings, facebookPixelId: e.target.value })}
                        placeholder="123456789012345"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSEOSettings} className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SEO Tools */}
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 border rounded-lg">
                    <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-2">Relatório SEO</h3>
                    <p className="text-sm text-gray-600 mb-4">Gere um relatório completo</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Gerar Relatório
                    </Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Search className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-2">Análise de Palavras-chave</h3>
                    <p className="text-sm text-gray-600 mb-4">Descubra novas oportunidades</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Analisar
                    </Button>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Zap className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-800 mb-2">Otimização Automática</h3>
                    <p className="text-sm text-gray-600 mb-4">Aplique melhorias automaticamente</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Otimizar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}