"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
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
  ExternalLink,
  Download,
  RefreshCw,
  Settings,
  Zap,
  Award,
  Activity,
  Calendar,
  Clock,
  FileText,
  Link,
  Smartphone,
  Monitor,
  Wifi,
  Shield,
  Save
} from "lucide-react"
import { useStore } from "@/lib/store"

export default function SEODashboardPage() {
  const router = useRouter()
  const { isAuthenticated, settings, updateSettings, fetchSettings } = useStore()
  
  const [seoData, setSeoData] = useState({
    seo_title: "PrintsBrindes - Presentes e Artigos Personalizados",
    seo_description: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    seo_keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
    google_analytics_id: "G-PS2KYDM9N0",
    google_search_console_id: "",
    facebook_pixel_id: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/area-administrativa")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    if (settings) {
      setSeoData({
        seo_title: settings.seo_title || "PrintsBrindes - Presentes e Artigos Personalizados",
        seo_description: settings.seo_description || "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
        seo_keywords: settings.seo_keywords || "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
        google_analytics_id: settings.google_analytics_id || "G-PS2KYDM9N0",
        google_search_console_id: settings.google_search_console_id || "",
        facebook_pixel_id: settings.facebook_pixel_id || "",
      })
    }
  }, [settings])

  const handleSaveSEO = async () => {
    setIsLoading(true)
    setSaveStatus('saving')
    
    try {
      await updateSettings(seoData)
      setLastUpdated(new Date())
      setSaveStatus('success')
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error("Erro ao salvar configurações de SEO:", error)
      setSaveStatus('error')
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSitemap = () => {
    window.open('/sitemap.xml', '_blank')
  }

  const handleViewRobots = () => {
    window.open('/robots.txt', '_blank')
  }

  const handleDownloadReport = () => {
    const report = {
      seoScore: calculateSEOScore(),
      title: seoData.seo_title,
      description: seoData.seo_description,
      keywords: seoData.seo_keywords,
      analytics: seoData.google_analytics_id ? 'Configurado' : 'Não configurado',
      searchConsole: seoData.google_search_console_id ? 'Configurado' : 'Não configurado',
      facebookPixel: seoData.facebook_pixel_id ? 'Configurado' : 'Não configurado',
      generatedAt: new Date().toISOString(),
      recommendations: [
        'Configure Google Analytics para monitorar tráfego',
        'Verifique o site no Google Search Console',
        'Otimize palavras-chave para melhor posicionamento',
        'Mantenha conteúdo atualizado regularmente'
      ]
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-printsbrindes-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleConfigureAnalytics = () => {
    window.open('https://analytics.google.com/', '_blank')
  }

  const handleRefreshData = () => {
    fetchSettings()
    setLastUpdated(new Date())
  }

  // Calculate SEO score based on filled fields
  const calculateSEOScore = () => {
    let score = 0
    if (seoData.seo_title && seoData.seo_title.length >= 30) score += 25
    if (seoData.seo_description && seoData.seo_description.length >= 120) score += 25
    if (seoData.seo_keywords && seoData.seo_keywords.length >= 20) score += 20
    if (seoData.google_analytics_id) score += 15
    if (seoData.google_search_console_id) score += 15
    return score
  }

  const seoScore = calculateSEOScore()

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.push('/painel-administrativo')}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">SEO Dashboard</h1>
              <p className="text-gray-600">Otimização para Motores de Busca</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Activity className="w-3 h-3 mr-1" />
              Ativo
            </Badge>
            {lastUpdated && (
              <Badge variant="secondary">
                <Clock className="w-3 h-3 mr-1" />
                Atualizado {lastUpdated.toLocaleTimeString()}
              </Badge>
            )}
            {saveStatus === 'success' && (
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Salvo
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge className="bg-red-100 text-red-700 border-red-200">
                <AlertCircle className="w-3 h-3 mr-1" />
                Erro
              </Badge>
            )}
            <Button
              onClick={handleRefreshData}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* SEO Score Overview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Score SEO Geral</h2>
                <p className="text-blue-100">Análise da otimização do seu site</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{seoScore}/100</div>
                <Progress value={seoScore} className="w-32 h-3 bg-white/20" />
                <p className="text-sm mt-2 text-blue-100">
                  {seoScore >= 80 ? "Excelente" : seoScore >= 60 ? "Bom" : "Precisa melhorar"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* SEO Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Verificação de Saúde SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`flex items-center justify-between p-3 border rounded-lg ${
                  seoData.seo_title && seoData.seo_title.length >= 30 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {seoData.seo_title && seoData.seo_title.length >= 30 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">Título SEO</p>
                      <p className="text-sm text-gray-600">
                        {seoData.seo_title ? `${seoData.seo_title.length} caracteres` : 'Não configurado'}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    seoData.seo_title && seoData.seo_title.length >= 30 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }>
                    {seoData.seo_title && seoData.seo_title.length >= 30 ? 'OK' : 'Atenção'}
                  </Badge>
                </div>

                <div className={`flex items-center justify-between p-3 border rounded-lg ${
                  seoData.seo_description && seoData.seo_description.length >= 120 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {seoData.seo_description && seoData.seo_description.length >= 120 ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">Meta Descrição</p>
                      <p className="text-sm text-gray-600">
                        {seoData.seo_description ? `${seoData.seo_description.length} caracteres` : 'Não configurado'}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    seoData.seo_description && seoData.seo_description.length >= 120 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }>
                    {seoData.seo_description && seoData.seo_description.length >= 120 ? 'OK' : 'Atenção'}
                  </Badge>
                </div>

                <div className={`flex items-center justify-between p-3 border rounded-lg ${
                  seoData.google_analytics_id 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    {seoData.google_analytics_id ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">Google Analytics</p>
                      <p className="text-sm text-gray-600">
                        {seoData.google_analytics_id ? 'Configurado' : 'Configure para acompanhar o tráfego'}
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    seoData.google_analytics_id 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }>
                    {seoData.google_analytics_id ? 'OK' : 'Pendente'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="w-5 h-5 mr-2" />
                    Configurações SEO Básicas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="seoTitle">Título Principal do Site</Label>
                    <Input
                      id="seoTitle"
                      value={seoData.seo_title}
                      onChange={(e) => setSeoData({ ...seoData, seo_title: e.target.value })}
                      className="mt-1"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {seoData.seo_title.length}/60 caracteres (recomendado: 30-60)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Descrição Meta</Label>
                    <Textarea
                      id="seoDescription"
                      value={seoData.seo_description}
                      onChange={(e) => setSeoData({ ...seoData, seo_description: e.target.value })}
                      rows={3}
                      className="mt-1"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {seoData.seo_description.length}/160 caracteres (recomendado: 120-160)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoKeywords">Palavras-chave Principais</Label>
                    <Input
                      id="seoKeywords"
                      value={seoData.seo_keywords}
                      onChange={(e) => setSeoData({ ...seoData, seo_keywords: e.target.value })}
                      className="mt-1"
                      placeholder="palavra1, palavra2, palavra3"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separe as palavras-chave com vírgulas
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Ferramentas de Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input 
                      id="googleAnalytics" 
                      value={seoData.google_analytics_id}
                      onChange={(e) => setSeoData({ ...seoData, google_analytics_id: e.target.value })}
                      placeholder="G-XXXXXXXXXX" 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="searchConsole">Google Search Console</Label>
                    <Input 
                      id="searchConsole" 
                      value={seoData.google_search_console_id}
                      onChange={(e) => setSeoData({ ...seoData, google_search_console_id: e.target.value })}
                      placeholder="Código de verificação" 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                    <Input 
                      id="facebookPixel" 
                      value={seoData.facebook_pixel_id}
                      onChange={(e) => setSeoData({ ...seoData, facebook_pixel_id: e.target.value })}
                      placeholder="123456789012345" 
                      className="mt-1" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleSaveSEO} 
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isLoading || saveStatus === 'saving'}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações SEO
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics em Preparação</h3>
              <p className="text-gray-600 mb-6">
                Configure o Google Analytics para ver dados detalhados aqui
              </p>
              <Button variant="outline" onClick={handleConfigureAnalytics}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Configurar Google Analytics
              </Button>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Sitemap.xml</h3>
                  <p className="text-sm text-gray-600 mb-4">Mapa do site para motores de busca</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleViewSitemap}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Robots.txt</h3>
                  <p className="text-sm text-gray-600 mb-4">Instruções para crawlers</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleViewRobots}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-800 mb-2">Relatório SEO</h3>
                  <p className="text-sm text-gray-600 mb-4">Análise completa do site</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="w-6 h-6 mr-2" />
                  Próximos Passos para Melhorar seu SEO
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">1. Configure Google Analytics</h4>
                    <p className="text-sm opacity-90">Monitore o tráfego e comportamento dos usuários</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">2. Verifique Search Console</h4>
                    <p className="text-sm opacity-90">Monitore como o Google vê seu site</p>
                  </div>
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">3. Otimize Conteúdo</h4>
                    <p className="text-sm opacity-90">Melhore descrições e palavras-chave</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}