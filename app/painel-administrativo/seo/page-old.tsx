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
  Shield
} from "lucide-react"
import { useStore } from "@/lib/store-new"

export default function SEODashboardPage() {
  const router = useRouter()
  const { isAuthenticated, settings, updateSettings } = useStore()
  
  const [seoData, setSeoData] = useState({
    title: "PrintsBrindes - Presentes e Artigos Personalizados",
    description: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
    keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
    googleAnalytics: "",
    searchConsole: "",
    facebookPixel: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/area-administrativa")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (settings?.seo) {
      setSeoData(prev => ({
        ...prev,
        title: settings.seo.title || prev.title,
        description: settings.seo.description || prev.description,
        keywords: settings.seo.keywords || prev.keywords,
      }))
    }
  }, [settings])

  const handleSaveSEO = async () => {
    setIsLoading(true)
    try {
      await updateSettings({
        seo: {
          title: seoData.title,
          description: seoData.description,
          keywords: seoData.keywords,
        }
      })
      setLastUpdated(new Date())
      alert("✅ Configurações de SEO salvas com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar configurações de SEO:", error)
      alert("❌ Erro ao salvar configurações de SEO")
    } finally {
      setIsLoading(false)
    }
  }

  const seoScore = 75 // Mock score - can be calculated based on filled fields

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
            {/* Metrics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Visualizações</p>
                      <p className="text-2xl font-bold text-gray-800">-</p>
                      <p className="text-gray-500 text-sm">Configure Analytics</p>
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
                      <p className="text-gray-600 text-sm">Visitantes</p>
                      <p className="text-2xl font-bold text-gray-800">-</p>
                      <p className="text-gray-500 text-sm">Configure Analytics</p>
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
                      <p className="text-gray-600 text-sm">Taxa de Cliques</p>
                      <p className="text-2xl font-bold text-gray-800">-</p>
                      <p className="text-gray-500 text-sm">Configure Search Console</p>
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
                      <p className="text-gray-600 text-sm">Posição Média</p>
                      <p className="text-2xl font-bold text-gray-800">-</p>
                      <p className="text-gray-500 text-sm">Configure Search Console</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SEO Health Check */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Verificação de Saúde SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Título SEO Configurado</p>
                      <p className="text-sm text-gray-600">Título principal está definido</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">OK</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-800">Meta Descrição Configurada</p>
                      <p className="text-sm text-gray-600">Descrição meta está definida</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">OK</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-800">Google Analytics</p>
                      <p className="text-sm text-gray-600">Configure para acompanhar o tráfego</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="font-medium text-gray-800">Google Search Console</p>
                      <p className="text-sm text-gray-600">Verifique seu site no Search Console</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
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
                      value={seoData.title}
                      onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                      className="mt-1"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {seoData.title.length}/60 caracteres
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Descrição Meta</Label>
                    <Textarea
                      id="seoDescription"
                      value={seoData.description}
                      onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                      rows={3}
                      className="mt-1"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {seoData.description.length}/160 caracteres
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="seoKeywords">Palavras-chave Principais</Label>
                    <Input
                      id="seoKeywords"
                      value={seoData.keywords}
                      onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                      className="mt-1"
                      placeholder="palavra1, palavra2, palavra3"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveSEO} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar Configurações SEO"}
                  </Button>
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
                      value={seoData.googleAnalytics}
                      onChange={(e) => setSeoData({ ...seoData, googleAnalytics: e.target.value })}
                      placeholder="G-XXXXXXXXXX" 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="searchConsole">Google Search Console</Label>
                    <Input 
                      id="searchConsole" 
                      value={seoData.searchConsole}
                      onChange={(e) => setSeoData({ ...seoData, searchConsole: e.target.value })}
                      placeholder="Código de verificação" 
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                    <Input 
                      id="facebookPixel" 
                      value={seoData.facebookPixel}
                      onChange={(e) => setSeoData({ ...seoData, facebookPixel: e.target.value })}
                      placeholder="123456789012345" 
                      className="mt-1" 
                    />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Conectar Ferramentas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics em Preparação</h3>
              <p className="text-gray-600 mb-6">
                Configure o Google Analytics para ver dados detalhados aqui
              </p>
              <Button variant="outline">
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
                  <Button variant="outline" size="sm" className="w-full">
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
                  <Button variant="outline" size="sm" className="w-full">
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
                  <Button variant="outline" size="sm" className="w-full">
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