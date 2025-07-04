"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Facebook,
  Instagram,
  MessageCircle,
  Package,
  DollarSign,
  Grid3X3,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Settings,
  Palette,
  X,
  Upload,
  Search,
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore, type Product, type CatalogItem } from "@/lib/store-new"
import { SyncIndicator } from "@/components/sync-indicator"

export default function PainelAdministrativoPage() {
  const router = useRouter()
  const { products, catalogItems, addProduct, updateProduct, deleteProduct, addCatalogItem, updateCatalogItem, deleteCatalogItem, isAuthenticated, logout, settings, updateSettings, syncStatus, syncMessage } = useStore()

  const [activeTab, setActiveTab] = useState<"products" | "catalog" | "settings">("products")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCatalogDialogOpen, setIsCatalogDialogOpen] = useState(false)
  const [isEditCatalogDialogOpen, setIsEditCatalogDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCatalogItem, setEditingCatalogItem] = useState<CatalogItem | null>(null)

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    showOnHome: false,
    images: [] as string[],
    mainImage: "",
    personalization: "",
    productionTime: "",
  })

  const [catalogForm, setCatalogForm] = useState({
    title: "",
    description: "",
    backgroundColor: "bg-pink-200",
    textColor: "text-pink-700",
    buttonColor: "border-pink-500 text-pink-500 hover:bg-pink-50",
    productIds: [] as number[],
    slug: "",
    image: "",
  })

  const [settingsForm, setSettingsForm] = useState(() => ({
    email: "",
    whatsappNumber: "",
    socialMedia: { facebook: "", instagram: "", whatsapp: "" },
    seo: { title: "", description: "", keywords: "" }
  }));

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/area-administrativa")
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        email: settings.email || "",
        whatsappNumber: settings.whatsappNumber || "",
        socialMedia: {
          facebook: settings.socialMedia?.facebook || "",
          instagram: settings.socialMedia?.instagram || "",
          whatsapp: settings.socialMedia?.whatsapp || "",
        },
        seo: {
          title: settings.seo?.title || "",
          description: settings.seo?.description || "",
          keywords: settings.seo?.keywords || "",
        }
      });
    }
  }, [settings])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      showOnHome: false,
      images: [],
      mainImage: "",
      personalization: "",
      productionTime: "",
    })
  }

  const resetCatalogForm = () => {
    setCatalogForm({
      title: "",
      description: "",
      backgroundColor: "bg-pink-200",
      textColor: "text-pink-700",
      buttonColor: "border-pink-500 text-pink-500 hover:bg-pink-50",
      productIds: [],
      slug: "",
      image: "",
    })
  }

  // Simplified and robust image compression
  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log('Starting image compression:', {
        fileName: file.name,
        originalSize: file.size,
        maxWidth,
        quality
      })

      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Arquivo deve ser uma imagem'))
        return
      }

      // Use FileReader for better compatibility
      const reader = new FileReader()
      
      reader.onload = function(event) {
        const img = document.createElement('img')
        
        img.onload = function() {
          try {
            console.log('Image loaded:', {
              originalWidth: img.width,
              originalHeight: img.height
            })

            // Create canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            
            if (!ctx) {
              reject(new Error('Não foi possível criar contexto do canvas'))
              return
            }

            // Calculate new dimensions maintaining aspect ratio
            let newWidth = img.width
            let newHeight = img.height
            
            if (newWidth > newHeight) {
              if (newWidth > maxWidth) {
                newHeight = (newHeight * maxWidth) / newWidth
                newWidth = maxWidth
              }
            } else {
              if (newHeight > maxWidth) {
                newWidth = (newWidth * maxWidth) / newHeight
                newHeight = maxWidth
              }
            }

            // Set canvas dimensions
            canvas.width = newWidth
            canvas.height = newHeight

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, newWidth, newHeight)

            // Convert to compressed JPEG
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
            
            console.log('Image compressed successfully:', {
              newWidth,
              newHeight,
              originalSize: file.size,
              compressedSize: compressedDataUrl.length,
              compressionRatio: ((file.size - compressedDataUrl.length) / file.size * 100).toFixed(1) + '%'
            })

            resolve(compressedDataUrl)
          } catch (error) {
            console.error('Error during compression:', error)
            reject(new Error('Erro ao comprimir a imagem'))
          }
        }
        
        img.onerror = function() {
          reject(new Error('Erro ao carregar a imagem'))
        }

        // Set image source from FileReader result
        img.src = event.target?.result as string
      }
      
      reader.onerror = function() {
        reject(new Error('Erro ao ler o arquivo'))
      }

      // Read file as data URL
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "catalog" | "product-multiple",
  ) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      return
    }

    console.log('Starting image upload process:', {
      type,
      fileCount: files.length,
      files: Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }))
    })

    if (type === "product-multiple") {
      // For multiple images, compress and add to images array
      let successCount = 0
      let errorCount = 0

      for (const file of Array.from(files)) {
        console.log(`Processing file: ${file.name}`)

        // Check file size (limit to 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
          alert(`❌ Arquivo ${file.name} é muito grande. Limite: 10MB por imagem.`)
          errorCount++
          continue
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          alert(`❌ ${file.name} não é uma imagem válida.`)
          errorCount++
          continue
        }

        try {
          console.log(`Compressing ${file.name}...`)
          const compressedImage = await compressImage(file, 400, 0.5)
          
          setProductForm((prev) => ({
            ...prev,
            images: [...prev.images, compressedImage],
            mainImage: prev.mainImage || compressedImage,
          }))
          
          successCount++
          console.log(`✅ ${file.name} processed successfully`)
        } catch (error) {
          console.error(`❌ Error processing ${file.name}:`, error)
          alert(`❌ Erro ao processar ${file.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
          errorCount++
        }
      }

      // Show summary
      if (successCount > 0) {
        alert(`✅ ${successCount} imagem(ns) adicionada(s) com sucesso!${errorCount > 0 ? ` (${errorCount} falharam)` : ''}`)
      }
    } else {
      // Single image upload
      const file = files[0]
      console.log(`Processing single file: ${file.name}`)

      // Check file size (limit to 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        alert("❌ Arquivo muito grande. Limite: 10MB por imagem.")
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("❌ Arquivo deve ser uma imagem válida.")
        return
      }

      try {
        console.log(`Compressing ${file.name}...`)
        const compressedImage = await compressImage(file, 400, 0.5)
        
        if (type === "product") {
          setProductForm((prev) => ({
            ...prev,
            mainImage: compressedImage,
            images: prev.images.length > 0 ? [compressedImage, ...prev.images.slice(1)] : [compressedImage],
          }))
        } else if (type === "catalog") {
          setCatalogForm({ ...catalogForm, image: compressedImage })
        }
        
        console.log(`✅ ${file.name} processed successfully`)
        alert(`✅ Imagem ${file.name} adicionada com sucesso!`)
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error)
        alert(`❌ Erro ao processar a imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }

    // Clear the input to allow re-uploading the same file
    e.target.value = ''
  }

  const removeProductImage = (index: number) => {
    setProductForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index)
      return {
        ...prev,
        images: newImages,
        mainImage: index === 0 ? newImages[0] || "" : prev.mainImage,
      }
    })
  }

  const clearAllImages = () => {
    setProductForm((prev) => ({
      ...prev,
      images: [],
      mainImage: "",
    }))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate required fields
      if (!productForm.name.trim()) {
        alert("Nome do produto é obrigatório!")
        return
      }

      if (!productForm.description.trim()) {
        alert("Descrição do produto é obrigatória!")
        return
      }

      if (!productForm.price || isNaN(Number.parseFloat(productForm.price))) {
        alert("Preço válido é obrigatório!")
        return
      }

      if (!productForm.category.trim()) {
        alert("Categoria do produto é obrigatória!")
        return
      }

      // Use uploaded images or fallback to placeholders
      const productImages =
        productForm.images.length > 0
          ? productForm.images
          : ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"]

      const newProduct = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number.parseFloat(productForm.price),
        category: productForm.category.trim(),
        showOnHome: productForm.showOnHome,
        images: productImages,
        mainImage: productForm.mainImage || productImages[0],
        personalization: productForm.personalization.trim() || "Disponível",
        productionTime: productForm.productionTime.trim() || "3-7 dias úteis",
      }

      console.log('Attempting to add product:', newProduct.name)
      
      await addProduct(newProduct)

      // Generate slug for success message
      const slug =
        productForm.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "")
          .trim() || `produto-${Date.now()}`

      const imageMessage =
        productForm.images.length > 0
          ? `🖼️ O produto foi criado com ${productForm.images.length} imagem(ns) personalizada(s).`
          : `🖼️ O produto foi criado com imagens de demonstração.`

      alert(
        `✅ Produto "${productForm.name}" adicionado com sucesso!

📄 Página criada automaticamente em: /produto/${slug}

${imageMessage}

🔗 Você pode acessar a página do produto através do link "Ver Detalhes" na lista de produtos.

📱 Os dados serão sincronizados automaticamente em todos os dispositivos em até 30 segundos.`,
      )

      resetProductForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding product:", error)
      alert(`❌ Erro ao adicionar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`)
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      showOnHome: product.showOnHome || false,
      images: product.images || [],
      mainImage: product.mainImage || "",
      personalization: product.personalization || "",
      productionTime: product.productionTime || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingProduct) {
        // Validate required fields
        if (!productForm.name.trim()) {
          alert("Nome do produto é obrigatório!")
          return
        }

        if (!productForm.description.trim()) {
          alert("Descrição do produto é obrigatória!")
          return
        }

        if (!productForm.price || isNaN(Number.parseFloat(productForm.price))) {
          alert("Preço válido é obrigatório!")
          return
        }

        if (!productForm.category.trim()) {
          alert("Categoria do produto é obrigatória!")
          return
        }

        updateProduct(editingProduct.id, {
          name: productForm.name.trim(),
          description: productForm.description.trim(),
          price: Number.parseFloat(productForm.price),
          category: productForm.category.trim(),
          showOnHome: productForm.showOnHome,
          images: productForm.images.length > 0 ? productForm.images : undefined,
          mainImage: productForm.mainImage || undefined,
          personalization: productForm.personalization.trim() || "Disponível",
          productionTime: productForm.productionTime.trim() || "3-7 dias úteis",
        })

        alert("✅ Produto atualizado com sucesso!")
        resetProductForm()
        setIsEditDialogOpen(false)
        setEditingProduct(null)
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Erro ao atualizar produto. Tente novamente.")
    }
  }

  const handleDeleteProduct = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      deleteProduct(id)
      alert("✅ Produto excluído com sucesso!")
    }
  }

  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault()

    addCatalogItem({
      ...catalogForm,
      slug: catalogForm.title.toLowerCase().replace(/\s+/g, "-"),
      image: catalogForm.image || "/placeholder.svg?height=200&width=300",
    })

    alert("✅ Item do catálogo adicionado com sucesso!")
    resetCatalogForm()
    setIsCatalogDialogOpen(false)
  }

  const handleEditCatalogItem = (item: CatalogItem) => {
    setEditingCatalogItem(item)
    setCatalogForm({
      title: item.title,
      description: item.description,
      backgroundColor: item.backgroundColor,
      textColor: item.textColor,
      buttonColor: item.buttonColor,
      productIds: item.productIds,
      slug: item.slug,
      image: item.image || "",
    })
    setIsEditCatalogDialogOpen(true)
  }

  const handleUpdateCatalogItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCatalogItem) {
      updateCatalogItem(editingCatalogItem.id, catalogForm)
      alert("✅ Item do catálogo atualizado com sucesso!")
      resetCatalogForm()
      setIsEditCatalogDialogOpen(false)
      setEditingCatalogItem(null)
    }
  }

  const handleDeleteCatalogItem = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este item do catálogo?")) {
      deleteCatalogItem(id)
      alert("✅ Item do catálogo excluído com sucesso!")
    }
  }

  const handleSaveSettings = () => {
    updateSettings(settingsForm)
    alert("✅ Configurações salvas com sucesso!")
  }

  const totalProducts = products.length
  
  // Mock sales data for demonstration - replace with real sales data
  const mockSalesData = [
    { productName: "Relógio Personalizado", quantity: 2, totalPrice: 19.8, date: "2024-01-15" },
    { productName: "Bolo Personalizado", quantity: 1, totalPrice: 25.0, date: "2024-01-16" },
    { productName: "Caderno de Colorir", quantity: 5, totalPrice: 39.5, date: "2024-01-17" },
    { productName: "Relógio Personalizado", quantity: 3, totalPrice: 29.7, date: "2024-01-18" },
  ]
  
  const totalRevenue = mockSalesData.reduce((sum, sale) => sum + sale.totalPrice, 0)
  const totalOrders = mockSalesData.length
  const totalCategories = new Set(products.map((p) => p.category)).size

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Sync Indicator */}
      <SyncIndicator 
        isVisible={syncStatus !== 'idle'} 
        status={syncStatus === 'syncing' ? 'syncing' : syncStatus === 'success' ? 'success' : 'error'}
        message={syncMessage}
      />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="PrintsBrindes Logo" width={120} height={40} />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-pink-500">Início</a>
            <a href="/produtos" className="text-gray-600 hover:text-pink-500">Produtos</a>
            <a href="/sobre-nos" className="text-gray-600 hover:text-pink-500">Sobre Nós</a>
            <a href="/contato" className="text-gray-600 hover:text-pink-500">Contato</a>
            <a href="/localizacao" className="text-gray-600 hover:text-pink-500">Localização</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button onClick={handleLogout} variant="outline" className="text-pink-500 border-pink-500 hover:bg-pink-50">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Package className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total de Produtos</p>
                  <p className="text-2xl font-bold text-gray-800">{totalProducts}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-800">R$ {totalRevenue.toFixed(2).replace(".", ",")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 p-6">
              <CardContent className="p-0 flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <Grid3X3 className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Categorias</p>
                  <p className="text-2xl font-bold text-gray-800">{totalCategories}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-4 border-b-2 font-medium flex items-center space-x-2 ${
                activeTab === "products"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-600 hover:text-pink-500"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Produtos</span>
            </button>
            <button
              onClick={() => setActiveTab("catalog")}
              className={`pb-4 border-b-2 font-medium flex items-center space-x-2 ${
                activeTab === "catalog"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-600 hover:text-pink-500"
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Catálogo Início</span>
            </button>
            <Button
              onClick={() => router.push('/painel-administrativo/seo')}
              variant="outline"
              className="border-pink-500 text-pink-500 hover:bg-pink-50"
            >
              <Search className="w-4 h-4 mr-2" />
              SEO Dashboard
            </Button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-4 border-b-2 font-medium flex items-center space-x-2 ${
                activeTab === "settings"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-600 hover:text-pink-500"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </div>

          {/* Products Tab */}
          {activeTab === "products" && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Gerenciar Produtos</h2>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adicionar Produto</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nome</Label>
                          <Input
                            id="name"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Preço</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Categoria</Label>
                          <Input
                            id="category"
                            value={productForm.category}
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="personalization">Personalização</Label>
                          <Input
                            id="personalization"
                            value={productForm.personalization}
                            onChange={(e) => setProductForm({ ...productForm, personalization: e.target.value })}
                            placeholder="Ex: Nome, idade e tema personalizados"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productionTime">Prazo de Produção</Label>
                          <Input
                            id="productionTime"
                            value={productForm.productionTime}
                            onChange={(e) => setProductForm({ ...productForm, productionTime: e.target.value })}
                            placeholder="Ex: 3-7 dias úteis"
                          />
                        </div>
                        <div>
                          <Label htmlFor="images">Imagens do Produto</Label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                id="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageUpload(e, "product-multiple")}
                                className="flex-1"
                              />
                              <Upload className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-600">
                              Selecione múltiplas imagens (máximo 10MB cada). Serão comprimidas automaticamente para otimizar o carregamento.
                            </div>
                            {productForm.images.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {productForm.images.length} imagem(ns) selecionada(s)
                                  </span>
                                  <Button
                                    type="button"
                                    onClick={clearAllImages}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-600 hover:bg-red-50"
                                  >
                                    Limpar Todas
                                  </Button>
                                </div>
                                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                  {productForm.images.map((image, index) => (
                                    <div key={index} className="relative">
                                      <div className="w-20 h-20 border rounded overflow-hidden">
                                        <Image
                                          src={image || "/placeholder.svg"}
                                          alt={`Preview ${index + 1}`}
                                          width={80}
                                          height={80}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                      {index === 0 && (
                                        <span className="absolute -top-2 -left-2 bg-pink-500 text-white text-xs px-1 rounded">
                                          Principal
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => removeProductImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showOnHome"
                            checked={productForm.showOnHome}
                            onCheckedChange={(checked) => setProductForm({ ...productForm, showOnHome: !!checked })}
                          />
                          <Label htmlFor="showOnHome">Mostrar na página inicial</Label>
                        </div>
                        <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                          Adicionar
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Produto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Preço</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Página Inicial</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              {product.mainImage && (
                                <div className="w-12 h-12 rounded overflow-hidden">
                                  <Image
                                    src={product.mainImage || "/placeholder.svg"}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-600">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                              {product.category}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium text-gray-800">
                              R$ {Number(product.price).toFixed(2).replace(".", ",")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {product.showOnHome ? (
                              <Badge className="bg-green-100 text-green-700">Sim</Badge>
                            ) : (
                              <Badge variant="secondary">Não</Badge>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleEditProduct(product)}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteProduct(product.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Catalog Tab */}
          {activeTab === "catalog" && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Gerenciar Catálogo da Página Inicial</h2>
                  <Dialog open={isCatalogDialogOpen} onOpenChange={setIsCatalogDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adicionar Item ao Catálogo</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddCatalogItem} className="space-y-4">
                        <div>
                          <Label htmlFor="catalogTitle">Título</Label>
                          <Input
                            id="catalogTitle"
                            value={catalogForm.title}
                            onChange={(e) => setCatalogForm({ ...catalogForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="catalogDescription">Descrição</Label>
                          <Textarea
                            id="catalogDescription"
                            value={catalogForm.description}
                            onChange={(e) => setCatalogForm({ ...catalogForm, description: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                          <Select
                            value={catalogForm.backgroundColor}
                            onValueChange={(value) => setCatalogForm({ ...catalogForm, backgroundColor: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bg-pink-200">Rosa</SelectItem>
                              <SelectItem value="bg-yellow-200">Amarelo</SelectItem>
                              <SelectItem value="bg-purple-200">Roxo</SelectItem>
                              <SelectItem value="bg-blue-200">Azul</SelectItem>
                              <SelectItem value="bg-green-200">Verde</SelectItem>
                              <SelectItem value="bg-orange-200">Laranja</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="catalogImage">Imagem do Catálogo</Label>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <Input
                                id="catalogImage"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "catalog")}
                                className="flex-1"
                              />
                              <Upload className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Selecione uma imagem (máximo 10MB) - será comprimida automaticamente</div>
                            {catalogForm.image && (
                              <div className="mt-2 relative inline-block">
                                <div className="w-20 h-20 border rounded overflow-hidden">
                                  <Image
                                    src={catalogForm.image || "/placeholder.svg"}
                                    alt="Preview"
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setCatalogForm({ ...catalogForm, image: "" })}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                          Adicionar
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Catalog Items Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {catalogItems.map((item) => (
                    <Card key={item.id} className="border border-gray-200">
                      <CardContent className="p-0">
                        <div
                          className={`${item.backgroundColor} h-32 flex items-center justify-center relative overflow-hidden`}
                        >
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <h3 className={`text-lg font-bold ${item.textColor} text-center px-4`}>{item.title}</h3>
                          )}
                          {item.image && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                              <h3 className="text-lg font-bold text-white text-center px-4">{item.title}</h3>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleEditCatalogItem(item)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteCatalogItem(item.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Configurações do Site</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="whatsapp">Número do WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          whatsappNumber: e.target.value,
                        })
                      }
                      placeholder="(21) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email de Contato</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="contato@printsbrindes.com"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Redes Sociais</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          value={settingsForm.socialMedia.facebook}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialMedia: {
                                ...settingsForm.socialMedia,
                                facebook: e.target.value,
                              },
                            })
                          }
                          placeholder="https://facebook.com/printsbrindes"
                        />
                      </div>

                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={settingsForm.socialMedia.instagram}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialMedia: {
                                ...settingsForm.socialMedia,
                                instagram: e.target.value,
                              },
                            })
                          }
                          placeholder="https://instagram.com/printsbrindes"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsappLink">Link do WhatsApp</Label>
                        <Input
                          id="whatsappLink"
                          value={settingsForm.socialMedia.whatsapp}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              socialMedia: {
                                ...settingsForm.socialMedia,
                                whatsapp: e.target.value,
                              },
                            })
                          }
                          placeholder="https://wa.me/5521999999999"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveSettings} className="bg-pink-500 hover:bg-pink-600 text-white">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">© 2024 PrintsBrindes. Todos os direitos reservados.</p>
          </div>
          <div className="flex justify-center space-x-6">
            <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            <MessageCircle className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
          </div>
          <div className="text-center mt-4">
            <p className="text-pink-500 text-sm">Feito com ❤️ pela PrintsBrindes</p>
          </div>
        </div>
      </footer>
    </div>
  )
}