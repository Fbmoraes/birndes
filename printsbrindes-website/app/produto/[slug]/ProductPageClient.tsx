"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ShoppingCart,
  Facebook,
  Instagram,
  MessageCircle,
  Minus,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"

export default function ProductPageClient() {
  const params = useParams()
  const slug = params.slug as string
  const { getProductBySlug, addToCart, settings } = useStore()

  const product = getProductBySlug(slug)

  const [quantity, setQuantity] = useState(1)
  const [customText, setCustomText] = useState("")
  const [theme, setTheme] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, customText, theme)
      alert("Produto adicionado ao carrinho!")
    }
  }

  const handleContactClick = () => {
    const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o produto: ${product?.name}`)
    window.open(`https://wa.me/55${whatsappNumber}?text=${message}`, "_blank")
  }

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h1>
          <a href="/produtos">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
              Ver Todos os Produtos
            </Button>
          </a>
        </div>
      </div>
    )
  }

  const productImages = product.images || ["/placeholder.svg?height=500&width=500"]
  const currentImage = productImages[currentImageIndex]

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
          <div className="flex items-center">
            <a href="/carrinho">
              <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-pink-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Product Details */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <a href="/produtos" className="text-pink-500 hover:text-pink-600 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:text-pink-500">
                Início
              </a>
              <span className="mx-2">/</span>
              <a href="/produtos" className="hover:text-pink-500">
                Produtos
              </a>
              <span className="mx-2">/</span>
              <span className="text-pink-500">{product.name}</span>
            </nav>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4" id="galeria">
              {/* Main Image */}
              <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                <Image src={currentImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />

                {/* Navigation arrows for multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Galeria de Imagens ({productImages.length} fotos)
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? "border-pink-500" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`${product.name} ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="text-3xl font-bold text-pink-500 mb-4">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </div>
                <p className="text-gray-600 text-lg">{product.description}</p>
              </div>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Personalize seu produto</h3>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="customText" className="text-sm text-gray-700">
                        Texto personalizado (opcional)
                      </Label>
                      <Input
                        id="customText"
                        placeholder="Digite o texto que deseja personalizar"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="theme" className="text-sm text-gray-700">
                        Tema (opcional)
                      </Label>
                      <Input
                        id="theme"
                        placeholder="Ex: Festa infantil, aniversário, casamento..."
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-gray-700 mb-2 block">Quantidade</Label>
                      <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={decrementQuantity} className="w-10 h-10 p-0">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                        <Button variant="outline" size="sm" onClick={incrementQuantity} className="w-10 h-10 p-0">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 space-y-3">
                      <Button
                        onClick={handleAddToCart}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full text-lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>

                      <Button
                        onClick={handleContactClick}
                        variant="outline"
                        className="w-full text-pink-500 border-pink-500 hover:bg-pink-50 py-3 rounded-full"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Fale Conosco sobre este Produto
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card className="bg-gray-50 border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes do Produto</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-medium text-gray-800">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Personalização:</span>
                      <span className="font-medium text-gray-800">{product.personalization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prazo de produção:</span>
                      <span className="font-medium text-gray-800">{product.productionTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imagens disponíveis:</span>
                      <span className="font-medium text-gray-800">{productImages.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">© 2024 PrintsBrindes. Todos os direitos reservados.</p>
          </div>
          <div className="flex justify-center space-x-6">
            <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </a>
            <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </a>
            <a href={settings.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </a>
          </div>
          <div className="text-center mt-4">
            <p className="text-pink-500 text-sm">Feito com ❤️ pela PrintsBrindes</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
