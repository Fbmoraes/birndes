"use client"

import React, { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  Globe,
  Eye,
  Users,
  MousePointer,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Copy,
  Download,
  RefreshCw,
  Settings,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"

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
}

interface SEOData {
  organicClicks: number
  impressions: number
  ctr: number
  indexedPages: number
  topKeywords: Array<{
    keyword: string
    position: number
    clicks: number
  }>
  technicalIssues: Array<{
    type: "error" | "warning" | "success"
    title: string
    description: string
    priority: "high" | "medium" | "low"
    page?: string
  }>
}

export default function SEODashboard() {
  const router = useRouter()
  const { isAuthenticated, settings, updateSettings } = useStore()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [seoData, setSeoData] = useState<SEOData | null>(null)

  const [seoSettings, setSeoSettings] = useState({
    siteTitle: "PrintsBrindes - Presentes e Artigos Personalizados",
    siteDescription:
      "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    keywords:
      "presentes personalizados, brindes, festas, canecas, cadernos, bolos, personalização, Guaratiba, Rio de Janeiro",
    googleAnalyticsId: settings?.googleAnalyticsId || "",
    googleSearchConsoleId: settings?.googleSearchConsoleId || "",
    facebookPixelId: settings?.facebookPixelId || "",
    customDomain: "printsbrindes.com.br",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/area-administrativa")
    } else {
      fetchAnalyticsData()
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAnalyticsData() {
    setIsLoading(true)
    try {
      const res = await fetch("/api/analytics?type=all", {
        headers: { "Cache-Control": "no-cache" },
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success) {
          setAnalyticsData(json.data.analytics)
          setSeoData(json.data.seo)
          setLastUpdate(new Date().toLocaleString("pt-BR"))
        }
      }
    } catch (error) {
      console.error("Failed to fetch analytics data", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSaveSEOSettings() {
    updateSettings({
      googleAnalyticsId: seoSettings.googleAnalyticsId,
      googleSearchConsoleId: seoSettings.googleSearchConsoleId,
      facebookPixelId: seoSettings.facebookPixelId,
    })
      .then(() => alert("✅ Configurações de SEO salvas com sucesso!"))
      .catch(() => alert("❌ Erro ao salvar configurações. Tente novamente."))
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    alert("📋 Copiado para a área de transferência!")
  }

  function generateSitemap() {
    fetch("/api/sitemap/generate", { method: "POST" })
      .then(() => alert("✅ Sitemap regenerado com sucesso!"))
      .catch(() => alert("❌ Erro ao regenerar sitemap."))
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

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard SEO & Analytics</h1>
              <p className="text-gray-600">Monitore vendas, tráfego e performance do seu site em tempo real</p>
              {lastUpdate && <p className="text-sm text-gray-500 mt-1">Última atualização: {lastUpdate}</p>}
            </div>
            <div className="flex space-x-2">
              <Button onClick={fetchAnalyticsData} variant="outline" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Atualizar Dados
              </Button>
              <Button onClick={generateSitemap} className="bg-pink-500 hover:bg-pink-600 text-white">
                <Settings className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="sales">Vendas & Conversões</TabsTrigger>
              <TabsTrigger value="seo">SEO & Palavras-chave</TabsTrigger>
              <TabsTrigger value="traffic">Tráfego & Dispositivos</TabsTrigger>
              <TabsTrigger value="issues">Problemas Técnicos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Visualizações</p>
                        <p className="text-2xl font-bold text-gray-800">{analyticsData?.pageViews.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Visitantes Únicos</p>
                        <p className="text-2xl font-bold text-gray-800">{analyticsData?.uniqueVisitors.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <MousePointer className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Tempo de Permanência</p>
                        <p className="text-2xl font-bold text-gray-800">{analyticsData?.timeOnSite}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Taxa de Conversão</p>
                        <p className="text-2xl font-bold text-gray-800">{analyticsData?.conversionRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sales" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendas & Conversões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData?.topProducts.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{product.name}</span>
                        <span className="text-gray-600">Pedidos: {product.orders}</span>
                        <span className="text-gray-600">Receita: R$ {product.revenue.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Palavras-chave</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cliques Orgânicos</span>
                      <span className="font-bold text-gray-800">{seoData?.organicClicks}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Impressões</span>
                      <span className="font-bold text-gray-800">{seoData?.impressions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">CTR</span>
                      <span className="font-bold text-gray-800">{seoData?.ctr}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Páginas Indexadas</span>
                      <span className="font-bold text-gray-800">{seoData?.indexedPages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Palavras-chave Principais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seoData?.topKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{keyword.keyword}</span>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant="secondary">Posição: {keyword.position}</Badge>
                          <Badge variant="outline">Cliques: {keyword.clicks}</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tráfego & Dispositivos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fontes de Tráfego</span>
                    </div>
                    {analyticsData?.trafficSources.map((source, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{source.source}</span>
                        <span className="text-gray-600">{source.visitors} visitantes ({source.percentage}%)</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-gray-600">Dispositivos</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">Mobile</span>
                      <span className="text-gray-600">{analyticsData?.deviceStats.mobile}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">Desktop</span>
                      <span className="text-gray-600">{analyticsData?.deviceStats.desktop}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">Tablet</span>
                      <span className="text-gray-600">{analyticsData?.deviceStats.tablet}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues" className="space-y-6">
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
                          {issue.page && <p className="text-gray-500 text-xs mt-1">Página: {issue.page}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSeoSettings({ ...seoSettings, siteTitle: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="siteDescription">Descrição do Site</Label>
                      <Textarea
                        id="siteDescription"
                        value={seoSettings.siteDescription}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          setSeoSettings({ ...seoSettings, siteDescription: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                      <Textarea
                        id="keywords"
                        value={seoSettings.keywords}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                          setSeoSettings({ ...seoSettings, keywords: e.target.value })
                        }
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customDomain">Domínio Personalizado</Label>
                      <Input
                        id="customDomain"
                        value={seoSettings.customDomain}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSeoSettings({ ...seoSettings, customDomain: e.target.value })
                        }
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
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })
                        }
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="searchConsole">Google Search Console</Label>
                      <Input
                        id="searchConsole"
                        value={seoSettings.googleSearchConsoleId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSeoSettings({ ...seoSettings, googleSearchConsoleId: e.target.value })
                        }
                        placeholder="Código de verificação"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                      <Input
                        id="facebookPixel"
                        value={seoSettings.facebookPixelId}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setSeoSettings({ ...seoSettings, facebookPixelId: e.target.value })
                        }
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
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visualizar
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
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                      <Download className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-800 mb-2">Relatório SEO</h3>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Baixar PDF
                        </Button>
                        <Button variant="outline" size="sm">
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
