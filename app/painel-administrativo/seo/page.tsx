"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Target,
  ExternalLink,
  Copy,
  Download,
  RefreshCw,
  Settings,
  ArrowLeft,
  ShoppingCart,
  MessageCircle,
  Smartphone,
  Star,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

async function fetchSEOSettings() {
  const res = await fetch("/api/settings")
  if (!res.ok) throw new Error("Erro ao buscar configurações")
  return res.json()
}

async function saveSEOSettings(settings: any) {
  const res = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  })
  if (!res.ok) throw new Error("Erro ao salvar configurações")
  return res.json()
}

export default function SEODashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(true) // mock

  // Mock de dados de analytics e SEO
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [seoData, setSeoData] = useState<any>(null)

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: "",
    siteDescription: "",
    keywords: "",
    googleAnalyticsId: "",
    googleSearchConsoleId: "",
    facebookPixelId: "",
    customDomain: "",
  })
  const [loadingSettings, setLoadingSettings] = useState(true)

  // Mock para simular atualização de dados
  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setAnalyticsData({ uniqueVisitors: 1000 })
      setSeoData({
        whatsappSales: {
          totalOrders: 25,
          totalRevenue: 3500,
          avgResponseTime: "2m 10s",
          avgOrderValue: 140,
        },
        localSEO: {
          googleMyBusinessViews: 1200,
          reviews: { averageRating: 4.8, total: 57 },
          localRankings: [
            { keyword: "caneca personalizada", position: 2 },
            { keyword: "brindes rio de janeiro", position: 5 },
          ],
        },
        mobilePerformance: {
          mobileTrafficPercentage: 78,
          pageLoadTime: 2.1,
        },
        technicalIssues: [
          { type: "success", priority: "low", title: "Meta description presente", description: "Sua página inicial possui meta description." },
          { type: "warning", priority: "medium", title: "Título duplicado", description: "Algumas páginas possuem títulos duplicados." },
          { type: "error", priority: "high", title: "Robots.txt ausente", description: "O arquivo robots.txt não foi encontrado." },
        ],
      })
      setLastUpdate(new Date().toLocaleString('pt-BR'))
      setIsLoading(false)
    }, 800)
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  useEffect(() => {
    fetchSEOSettings()
      .then(data => setSeoSettings(data))
      .finally(() => setLoadingSettings(false))
  }, [])

  const handleSaveSEOSettings = async () => {
    try {
      await saveSEOSettings(seoSettings)
      alert("✅ Configurações de SEO salvas com sucesso!")
    } catch {
      alert("❌ Erro ao salvar configurações.")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("📋 Copiado para a área de transferência!")
  }

  const generateSitemap = async () => {
    alert("✅ Sitemap regenerado (mock)!")
  }

  const handleRefreshData = () => {
    fetchAnalyticsData()
  }

  const handleConnectTools = () => {
    alert("🔗 IDs salvos localmente! (Mock, sem persistência real)")
  }

  if (!isAuthenticated) {
    return <div>Carregando...</div>
  }

  if (isLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados de analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="PrintsBrindes Logo" width={120} height={40} />
          </div>
          <div className="flex items-center space-x-4">
            <a href="/painel-administrativo" className="text-pink-500 hover:text-pink-600">
              <ArrowLeft className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* SEO Dashboard Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard SEO & Analytics</h1>
              <p className="text-gray-600">Monitore vendas, tráfego e performance do seu site em tempo real</p>
              {lastUpdate && (
                <p className="text-sm text-gray-500 mt-1">
                  Última atualização: {lastUpdate}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleRefreshData} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar Dados
              </Button>
              <Button onClick={generateSitemap} className="bg-pink-500 hover:bg-pink-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="local">SEO Local</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              <TabsTrigger value="seo">SEO & Palavras-chave</TabsTrigger>
              <TabsTrigger value="mobile">Performance Mobile</TabsTrigger>
              <TabsTrigger value="issues">Problemas Técnicos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Vendas WhatsApp</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {seoData?.whatsappSales.totalOrders || 0}
                          </p>
                          <p className="text-green-600 text-sm">
                            R$ {seoData?.whatsappSales.totalRevenue.toLocaleString('pt-BR') || 0}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <Globe className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Visualizações Google Meu Negócio</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {seoData?.localSEO.googleMyBusinessViews.toLocaleString() || 0}
                          </p>
                          <p className="text-green-600 text-sm">+15% vs mês anterior</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Avaliações</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {seoData?.localSEO.reviews.averageRating || 0}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {seoData?.localSEO.reviews.total || 0} avaliações
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Tráfego Mobile</p>
                          <p className="text-2xl font-bold text-gray-800">
                            {seoData?.mobilePerformance.mobileTrafficPercentage || 0}%
                          </p>
                          <p className="text-green-600 text-sm">
                            {seoData?.mobilePerformance.pageLoadTime}s carregamento
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>Performance WhatsApp</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tempo Médio Resposta</span>
                          <span className="font-bold text-gray-800">
                            {seoData?.whatsappSales.avgResponseTime || '0m 0s'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Valor Médio Pedido</span>
                          <span className="font-bold text-gray-800">
                            R$ {seoData?.whatsappSales.avgOrderValue.toLocaleString('pt-BR') || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Taxa de Conversão</span>
                          <span className="font-bold text-gray-800">
                            {((seoData?.whatsappSales.totalOrders || 0) / (analyticsData?.uniqueVisitors || 1) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Globe className="w-5 h-5" />
                        <span>SEO Local</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {seoData?.localSEO.localRankings.map((ranking: any, index: number) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600">{ranking.keyword}</span>
                            <Badge variant={ranking.position <= 3 ? "default" : "secondary"}>
                              {ranking.position}º posição
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Local SEO Tab */}
            <TabsContent value="local">
              <div className="space-y-6">
                {/* Local SEO Content */}
              </div>
            </TabsContent>

            {/* WhatsApp Tab */}
            <TabsContent value="whatsapp">
              <div className="space-y-6">
                {/* WhatsApp Performance Content */}
              </div>
            </TabsContent>

            {/* SEO Tab */}
            <TabsContent value="seo">
              <div className="space-y-6">
                {/* SEO Content */}
              </div>
            </TabsContent>

            {/* Mobile Tab */}
            <TabsContent value="mobile">
              <div className="space-y-6">
                {/* Mobile Performance Content */}
              </div>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Problemas de SEO Detectados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {seoData?.technicalIssues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                          <div className="mt-1">
                            {issue.type === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                            {issue.type === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                            {issue.type === "error" && <XCircle className="w-5 h-5 text-red-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-gray-800">{issue.title}</h3>
                              <Badge
                                variant={
                                  issue.priority === "high"
                                    ? "destructive"
                                    : issue.priority === "medium"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {issue.priority === "high" ? "Alta" : issue.priority === "medium" ? "Média" : "Baixa"}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm">{issue.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações Básicas de SEO</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="siteTitle">Título do Site</Label>
                        <Input
                          id="siteTitle"
                          value={seoSettings.siteTitle}
                          onChange={(e) => setSeoSettings({ ...seoSettings, siteTitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="siteDescription">Descrição do Site</Label>
                        <Textarea
                          id="siteDescription"
                          value={seoSettings.siteDescription}
                          onChange={(e) => setSeoSettings({ ...seoSettings, siteDescription: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                        <Textarea
                          id="keywords"
                          value={seoSettings.keywords}
                          onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="customDomain">Domínio Personalizado</Label>
                        <Input
                          id="customDomain"
                          value={seoSettings.customDomain}
                          onChange={(e) => setSeoSettings({ ...seoSettings, customDomain: e.target.value })}
                          placeholder="seudominio.com.br"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Integrações de Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Ferramentas SEO</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="font-medium text-gray-800 mb-2">Sitemap.xml</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard("https://printsbrindes.com.br/sitemap.xml")}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar URL
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href="https://printsbrindes.com.br/sitemap.xml" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visualizar
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <h3 className="font-medium text-gray-800 mb-2">Robots.txt</h3>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard("https://printsbrindes.com.br/robots.txt")}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar URL
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <a href="https://printsbrindes.com.br/robots.txt" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visualizar
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg text-center">
                        <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                        <h3 className="font-medium text-gray-800 mb-2">Relatório SEO</h3>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" onClick={() => alert("Download do PDF (mock)")}>
                            <Download className="w-4 h-4 mr-1" />
                            Baixar PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => alert("Compartilhar relatório (mock)")}>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Compartilhar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSEOSettings} className="bg-pink-500 hover:bg-pink-600 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button onClick={handleConnectTools} className="bg-pink-500 hover:bg-pink-600 text-white w-full mt-4">
            Conectar Ferramentas
          </Button>
        </div>
      </section>
    </div>
  )
}
