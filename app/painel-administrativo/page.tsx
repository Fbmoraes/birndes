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
} from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore, type Product, type CatalogItem } from "@/lib/store-new"

export default function PainelAdministrativoPage() {
  const router = useRouter()
  const { products, catalogItems, addProduct, updateProduct, deleteProduct, addCatalogItem, updateCatalogItem, deleteCatalogItem, isAuthenticated, logout, settings, updateSettings } = useStore()

  const [activeTab, setActiveTab] = useState<"products" | "catalog" | "seo" | "settings">("products")
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

  // Enhanced image handling with FileReader and base64 conversion
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "catalog" | "product-multiple",
  ) => {
    const files = e.target.files
    if (files) {
      if (type === "product-multiple") {
        // For multiple images, convert to base64 and add to images array
        Array.from(files).forEach((file) => {
          // Check file size (limit to 2MB per image)
          if (file.size > 2 * 1024 * 1024) {
            alert(`Arquivo ${file.name} é muito grande. Limite: 2MB por imagem.`)
            return
          }

          const reader = new FileReader()
          reader.onload = (event) => {
            const result = event.target?.result as string
            setProductForm((prev) => ({
              ...prev,
              images: [...prev.images, result],
              mainImage: prev.mainImage || result,
            }))
          }
          reader.onerror = () => {
            alert(`Erro ao carregar a imagem ${file.name}`)
          }
          reader.readAsDataURL(file)
        })
      } else {
        const file = files[0]

        // Check file size (limit to 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert("Arquivo muito grande. Limite: 2MB por imagem.")
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          const result = event.target?.result as string
          if (type === "product") {
            setProductForm((prev) => ({
              ...prev,
              mainImage: result,
              images: prev.images.length > 0 ? [result, ...prev.images.slice(1)] : [result],
            }))
          } else if (type === "catalog") {
            setCatalogForm({ ...catalogForm, image: result })
          }
        }
        reader.onerror = () => {
          alert("Erro ao carregar a imagem")
        }
        reader.readAsDataURL(file)
      }
    }
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

  const handleAddProduct = (e: React.FormEvent) => {
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

      addProduct(newProduct)

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

🔗 Você pode acessar a página do produto através do link "Ver Detalhes" na lista de produtos.`,
      )

      resetProductForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding product:", error)
      alert("❌ Erro ao adicionar produto. Tente novamente.")
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
  const totalValue = products.reduce((sum, product) => sum + Number(product.price), 0)
  const totalCategories = new Set(products.map((p) => p.category)).size

  if (!isAuthenticated) {
    // O useEffect já faz o redirect, pode retornar null
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/logo.png" alt="PrintsBrindes Logo" width={120} height={40} />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-600 hover:text-pink-500">
              Início
            </a>
            <a href="/produtos" className="text-gray-600 hover:text-pink-500">
              Produtos
            </a>
            <a href="/sobre-nos" className="text-gray-600 hover:text-pink-500">
              Sobre Nós
            </a>
            <a href="/contato" className="text-gray-600 hover:text-pink-500">
              Contato
            </a>
            <a href="/localizacao" className="text-gray-600 hover:text-pink-500">
              Localização
            </a>
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
                  <p className="text-gray-600 text-sm">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-800">R$ {totalValue.toFixed(2).replace(".", ",")}</p>
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
            <button
              onClick={() => setActiveTab("seo")}
              className={`pb-4 border-b-2 font-medium flex items-center space-x-2 ${
                activeTab === "seo"
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-gray-600 hover:text-pink-500"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>SEO Dashboard</span>
            </button>
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
                              Selecione múltiplas imagens (máximo 2MB cada). A primeira será a imagem principal.
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
                            <div className="text-sm text-gray-600 mt-1">Selecione uma imagem (máximo 2MB)</div>
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

          {/* SEO Dashboard Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              {/* SEO Overview Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="bg-white border border-gray-200 p-6">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Visualizações</p>
                      <p className="text-2xl font-bold text-gray-800">1,250</p>
                      <p className="text-green-600 text-sm">+12% vs mês anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-6">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Visitantes Únicos</p>
                      <p className="text-2xl font-bold text-gray-800">890</p>
                      <p className="text-green-600 text-sm">+8% vs mês anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-6">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <MousePointer className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Taxa de Rejeição</p>
                      <p className="text-2xl font-bold text-gray-800">45.2%</p>
                      <p className="text-red-600 text-sm">+2% vs mês anterior</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-6">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Posição Média Google</p>
                      <p className="text-2xl font-bold text-gray-800">12.5</p>
                      <p className="text-green-600 text-sm">-1.2 vs mês anterior</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SEO Tools and Configuration */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Configurações SEO
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="seoTitle">Título Principal do Site</Label>
                        <Input
                          id="seoTitle"
                          defaultValue="PrintsBrindes - Presentes e Artigos Personalizados"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seoDescription">Descrição Meta</Label>
                        <Textarea
                          id="seoDescription"
                          defaultValue="Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!"
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seoKeywords">Palavras-chave Principais</Label>
                        <Input
                          id="seoKeywords"
                          defaultValue="presentes personalizados, brindes, festas, canecas, cadernos, bolos"
                          className="mt-1"
                        />
                      </div>
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                        Salvar Configurações SEO
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Google Analytics & Search Console
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                        <Input id="googleAnalytics" placeholder="G-XXXXXXXXXX" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="searchConsole">Google Search Console</Label>
                        <Input id="searchConsole" placeholder="Código de verificação" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                        <Input id="facebookPixel" placeholder="123456789012345" className="mt-1" />
                      </div>
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Conectar Ferramentas</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SEO Status and Issues */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Status SEO e Problemas Detectados
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-800">Sitemap.xml Configurado</p>
                          <p className="text-sm text-gray-600">Sitemap está ativo e sendo indexado pelo Google</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">OK</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-800">Robots.txt Configurado</p>
                          <p className="text-sm text-gray-600">Arquivo robots.txt está configurado corretamente</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">OK</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-gray-800">Google Analytics não configurado</p>
                          <p className="text-sm text-gray-600">
                            Configure o Google Analytics para acompanhar o tráfego
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">Atenção</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-gray-800">Google Search Console não verificado</p>
                          <p className="text-sm text-gray-600">Verifique seu site no Google Search Console</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SEO Tools */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Ferramentas SEO
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                      <Globe className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-800 mb-2">Sitemap.xml</h4>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                      <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-800 mb-2">Robots.txt</h4>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visualizar
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                      <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-800 mb-2">Relatório SEO</h4>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-1" />
                        Baixar
                      </Button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg text-center">
                      <RefreshCw className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <h4 className="font-medium text-gray-800 mb-2">Atualizar</h4>
                      <Button variant="outline" size="sm" className="w-full">
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Regenerar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Keywords and Pages Performance */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Palavras-chave Principais
                    </h3>
                    <div className="space-y-3">
                      {[
                        { keyword: "presentes personalizados", position: 8, volume: "1.2k" },
                        { keyword: "brindes festa", position: 12, volume: "890" },
                        { keyword: "canecas personalizadas", position: 15, volume: "650" },
                        { keyword: "bolos personalizados", position: 18, volume: "420" },
                        { keyword: "lembrancinhas guaratiba", position: 22, volume: "180" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{item.keyword}</p>
                            <p className="text-xs text-gray-600">Volume: {item.volume}/mês</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Pos. {item.position}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Páginas Mais Visitadas
                    </h3>
                    <div className="space-y-3">
                      {[
                        { page: "/", views: 450, change: "+12%" },
                        { page: "/produtos", views: 320, change: "+8%" },
                        { page: "/produto/relogio-personalizado", views: 180, change: "+15%" },
                        { page: "/produto/caderno-colorir", views: 150, change: "+5%" },
                        { page: "/sobre-nos", views: 100, change: "-2%" },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{item.page}</p>
                            <p className="text-xs text-gray-600">{item.views} visualizações</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${item.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                          >
                            {item.change}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">🚀 Próximos Passos para Melhorar seu SEO</h3>
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
            </div>
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <Label htmlFor="editName">Nome</Label>
              <Input
                id="editName"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editDescription">Descrição</Label>
              <Textarea
                id="editDescription"
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editPrice">Preço</Label>
              <Input
                id="editPrice"
                type="number"
                step="0.01"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editCategory">Categoria</Label>
              <Input
                id="editCategory"
                value={productForm.category || ""} // Garante string
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editPersonalization">Personalização</Label>
              <Input
                id="editPersonalization"
                value={productForm.personalization}
                onChange={(e) => setProductForm({ ...productForm, personalization: e.target.value })}
                placeholder="Ex: Nome, idade e tema personalizados"
              />
            </div>
            <div>
              <Label htmlFor="editProductionTime">Prazo de Produção</Label>
              <Input
                id="editProductionTime"
                value={productForm.productionTime}
                onChange={(e) => setProductForm({ ...productForm, productionTime: e.target.value })}
                placeholder="Ex: 3-7 dias úteis"
              />
            </div>
            <div>
              <Label htmlFor="editImages">Imagens do Produto</Label>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="editImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, "product-multiple")}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Adicione mais imagens ou substitua as existentes (máximo 2MB cada)
                </div>
                {productForm.images.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{productForm.images.length} imagem(ns)</span>
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
                id="editShowOnHome"
                checked={productForm.showOnHome}
                onCheckedChange={(checked) => setProductForm({ ...productForm, showOnHome: !!checked })}
              />
              <Label htmlFor="editShowOnHome">Mostrar na página inicial</Label>
            </div>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              Atualizar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Catalog Dialog */}
      <Dialog open={isEditCatalogDialogOpen} onOpenChange={setIsEditCatalogDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Item do Catálogo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateCatalogItem} className="space-y-4">
            <div>
              <Label htmlFor="editCatalogTitle">Título</Label>
              <Input
                id="editCatalogTitle"
                value={catalogForm.title}
                onChange={(e) => setCatalogForm({ ...catalogForm, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editCatalogDescription">Descrição</Label>
              <Textarea
                id="editCatalogDescription"
                value={catalogForm.description}
                onChange={(e) => setCatalogForm({ ...catalogForm, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editBackgroundColor">Cor de Fundo</Label>
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
              <Label htmlFor="editCatalogImage">Imagem do Catálogo</Label>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="editCatalogImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "catalog")}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-sm text-gray-600 mt-1">Selecione uma nova imagem (máximo 2MB)</div>
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
              Atualizar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

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
