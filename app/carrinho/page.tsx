"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Facebook, Instagram, MessageCircle, Minus, Plus, Trash2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useStore } from "@/lib/store-new"

export default function CarrinhoPage() {
  const { cartItems, updateCartItem, removeFromCart, clearCart, settings } = useStore()

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const generateWhatsAppMessage = () => {
    // Calculate the actual total from items being sent
    const actualTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    let message = `🛍️ *Novo Pedido - PrintsBrindes*\n\n`
    message += `📋 *Itens do Pedido:*\n`

    cartItems.forEach((item, index) => {
      const itemSubtotal = item.price * item.quantity
      message += `${index + 1}. *${item.name}*\n`
      message += `   💰 R$ ${item.price.toFixed(2).replace(".", ",")}\n`
      message += `   📦 Quantidade: ${item.quantity}\n`
      if (item.customText) message += `   ✏️ Personalização: ${item.customText}\n`
      if (item.theme) message += `   🎨 Tema: ${item.theme}\n`
      message += `   💵 Subtotal: R$ ${itemSubtotal.toFixed(2).replace(".", ",")}\n\n`
    })

    message += `💰 *Total do Pedido: R$ ${actualTotal.toFixed(2).replace(".", ",")}*\n\n`
    message += `📱 Pedido enviado através do site: ${window.location.origin}\n`
    message += `🕒 Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`
    message += `Aguardo confirmação! 😊`

    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) {
      alert("Seu carrinho está vazio!")
      return
    }
    
    const message = generateWhatsAppMessage()
    const whatsappNumber = settings.whatsappNumber.replace(/\D/g, "")
    window.open(`https://wa.me/55${whatsappNumber}?text=${message}`, "_blank")
    
    // Optional: Clear cart after sending (uncomment if desired)
    // setTimeout(() => {
    //   clearCart()
    // }, 2000)
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
              <ShoppingCart className="w-6 h-6 text-pink-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <a href="/produtos" className="text-pink-500 hover:text-pink-600 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-3xl font-bold text-gray-800">
              Seu Carrinho ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
              {cartItems.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "itens"})
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <Card className="bg-white border border-gray-200 p-8 text-center">
              <CardContent className="p-0">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                <p className="text-gray-600 mb-6">Adicione alguns produtos para começar suas compras!</p>
                <a href="/produtos">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">
                    Ver Produtos
                  </Button>
                </a>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <Card key={`${item.id}-${item.customText}-${item.theme}`} className="bg-white border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Image
                            src="/placeholder.svg?height=80&width=80"
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                          {item.customText && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Texto personalizado:</strong> {item.customText}
                            </p>
                          )}

                          {item.theme && (
                            <p className="text-sm text-gray-600 mb-3">
                              <strong>Tema:</strong> {item.theme}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-medium text-lg">{item.quantity}</span>
                              <button
                                onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">R$ {item.price.toFixed(2).replace(".", ",")} cada</p>
                              <p className="text-lg font-bold text-pink-500">
                                R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="bg-white border border-gray-200 sticky top-4">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo do Pedido</h2>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Frete:</span>
                        <span className="font-medium text-green-600">A calcular</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-pink-500">R$ {total.toFixed(2).replace(".", ",")}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleWhatsAppOrder}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Finalizar pelo WhatsApp
                      </Button>

                      <Button
                        onClick={clearCart}
                        variant="outline"
                        className="w-full text-pink-500 border-pink-500 hover:bg-pink-50 py-3 rounded-full"
                      >
                        Limpar Carrinho
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Informações do Pedido</h3>
                      <p className="text-sm text-gray-600">
                        Ao finalizar pelo WhatsApp, você será redirecionado para conversar diretamente conosco para
                        confirmar os detalhes e forma de pagamento.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
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
