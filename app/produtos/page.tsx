"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, MessageCircle, Minus, Plus, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import ShoppingCartComponent from "@/components/shopping-cart"
import { useStore, type Product } from "@/lib/store-new"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number, customText?: string, theme?: string) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [customText, setCustomText] = useState("")
  const [theme, setTheme] = useState("")

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleAddToCart = () => {
    onAddToCart(product, quantity, customText, theme)
    alert("Produto adicionado ao carrinho!")
  }

  const displayImage = product.mainImage || product.images?.[0] || "/placeholder.svg?height=300&width=300"
  const hasMultipleImages = product.images && product.images.length > 1

  return (
    <Card className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
        <Image
          src={displayImage || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="text-2xl font-bold text-pink-500 mb-4">R$ {product.price.toFixed(2).replace(".", ",")}</div>

        <div className="space-y-4">
          <div>
            <Label htmlFor={`text-${product.id}`} className="text-sm text-gray-700">
              Texto personalizado (opcional)
            </Label>
            <Input
              id={`text-${product.id}`}
              placeholder="Texto personalizado (opcional)"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`theme-${product.id}`} className="text-sm text-gray-700">
              Tema (opcional)
            </Label>
            <Input
              id={`theme-${product.id}`}
              placeholder="Tema (opcional)"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-700 mb-2 block">Quantidade</Label>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={decrementQuantity} className="w-8 h-8 p-0">
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <Button variant="outline" size="sm" onClick={incrementQuantity} className="w-8 h-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-3"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Adicionar
            </Button>

            <a href={`/produto/${product.slug}`}>
              <Button
                variant="outline"
                className="w-full text-pink-500 border-pink-500 hover:bg-pink-50 rounded-full py-3 mt-2"
              >
                Ver Detalhes
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProdutosPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { products, addToCart, settings, cartItems, fetchData } = useStore()

  // Auto-refresh data every 30 seconds to ensure sync across devices
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().catch(console.error)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchData])

  const handleContactClick = () => {
    const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "")
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre os produtos da PrintsBrindes.")
    window.open(`https://wa.me/55${whatsappNumber}?text=${message}`, "_blank")
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <Header onCartClick={() => setIsCartOpen(true)} currentPage="/produtos" />

      {/* Shopping Cart */}
      <ShoppingCartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Products Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-pink-500 mb-4">Nossos Produtos</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Descubra nossa coleção de produtos personalizados para tornar seus momentos ainda mais especiais!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>

          {/* Finalize Order Section */}
          {totalItems > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-pink-500 mb-4">Finalizar Pedido</h2>
              <p className="text-gray-600 mb-6">
                Você tem {totalItems} {totalItems === 1 ? "item" : "itens"} no seu carrinho. Finalize seu pedido agora!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/carrinho">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                    Ver Carrinho
                  </Button>
                </a>
                <a href="/carrinho">
                  <Button
                    variant="outline"
                    className="bg-white text-pink-500 border-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full"
                  >
                    Finalizar Pedido
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-pink-500 mb-4">Não encontrou o que procura?</h2>
            <p className="text-gray-600 mb-6">
              Temos muitas outras opções! Entre em contato conosco para produtos personalizados especiais.
            </p>
            <Button
              onClick={handleContactClick}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full"
            >
              Fale Conosco
            </Button>
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
