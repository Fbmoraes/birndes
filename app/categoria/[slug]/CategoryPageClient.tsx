"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Facebook, Instagram, MessageCircle, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useStore } from "@/lib/store"

export default function CategoryPageClient({ params }: { params: { slug: string } }) {
  const slug = params.slug as string
  const { catalogItems, products, settings } = useStore()

  const categoryItem = catalogItems.find((item) => item.slug === slug)
  const categoryProducts = categoryItem
    ? products.filter((product) => categoryItem.productIds.includes(product.id))
    : []

  if (!categoryItem) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Categoria não encontrada</h1>
          <a href="/">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
              Voltar ao Início
            </Button>
          </a>
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

      {/* Category Hero */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <a href="/" className="text-pink-500 hover:text-pink-600 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <nav className="text-sm text-gray-600">
              <a href="/" className="hover:text-pink-500">
                Início
              </a>
              <span className="mx-2">/</span>
              <span className="text-pink-500">{categoryItem.title}</span>
            </nav>
          </div>

          <Card className="border border-gray-200 overflow-hidden mb-12">
            <div className={`${categoryItem.backgroundColor} h-32 flex items-center justify-center`}>
              <h1 className={`text-3xl font-bold ${categoryItem.textColor} text-center px-4`}>{categoryItem.title}</h1>
            </div>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 text-lg">{categoryItem.description}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Produtos Disponíveis</h2>

          {categoryProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                    <Image
                      src={product.image || "/placeholder.svg?height=200&width=200"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="text-2xl font-bold text-pink-500 mb-4">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </div>
                    <a href={`/produto/${product.slug}`}>
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-3">
                        Ver Detalhes
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Nenhum produto encontrado nesta categoria.</p>
              <a href="/produtos">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                  Ver Todos os Produtos
                </Button>
              </a>
            </div>
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
