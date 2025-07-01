"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Minus, Plus, Trash2, MessageCircle } from "lucide-react"
import { useStore } from "@/lib/store-new"
import { useGoogleAnalytics } from "./google-analytics"

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShoppingCart({ isOpen, onClose }: ShoppingCartProps) {
  const { cartItems, updateCartItem, removeFromCart, clearCart, settings } = useStore()
  const { trackEvent, trackPurchase } = useGoogleAnalytics()

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(id)
      trackEvent('remove_from_cart', 'ecommerce', `Product ID: ${id}`)
    } else {
      updateCartItem(id, newQuantity)
      trackEvent('update_cart', 'ecommerce', `Product ID: ${id}`, newQuantity)
    }
  }

  const removeItem = (id: number) => {
    removeFromCart(id)
    trackEvent('remove_from_cart', 'ecommerce', `Product ID: ${id}`)
  }

  const handleClearCart = () => {
    clearCart()
    trackEvent('clear_cart', 'ecommerce')
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return

    // Track purchase event
    const transactionId = `WA-${Date.now()}`
    const items = cartItems.map(item => ({
      item_id: item.id.toString(),
      item_name: item.name,
      category: item.category || 'produto',
      quantity: item.quantity,
      price: item.price
    }))

    trackPurchase(transactionId, total, items)
    trackEvent('begin_checkout', 'ecommerce', 'WhatsApp', total)

    // Generate WhatsApp message
    let message = `🛍️ *Novo Pedido - PrintsBrindes*\n\n`
    message += `📋 *Itens do Pedido:*\n`
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   💰 R$ ${item.price.toFixed(2).replace(".", ",")}\n`
      message += `   📦 Quantidade: ${item.quantity}\n`
      if (item.customText) {
        message += `   ✏️ Personalização: ${item.customText}\n`
      }
      if (item.theme) {
        message += `   🎨 Tema: ${item.theme}\n`
      }
      message += `   💵 Subtotal: R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}\n\n`
    })

    message += `💰 *Total do Pedido: R$ ${total.toFixed(2).replace(".", ",")}*\n\n`
    message += `📱 Pedido enviado através do site: ${window.location.origin}\n`
    message += `🕒 Data/Hora: ${new Date().toLocaleString('pt-BR')}\n\n`
    message += `Aguardo confirmação! 😊`

    const whatsappNumber = settings.whatsappNumber?.replace(/\D/g, '') || '5521999300409'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    window.open(whatsappUrl, '_blank')
    
    // Clear cart after sending
    setTimeout(() => {
      handleClearCart()
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Seu Carrinho ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400 mt-2">Adicione produtos para começar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={`${item.id}-${item.customText}-${item.theme}`} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-pink-500 font-medium">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                          {item.customText && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Personalização:</span> {item.customText}
                            </p>
                          )}
                          {item.theme && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Tema:</span> {item.theme}
                            </p>
                          )}
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="font-medium text-gray-800">
                            R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                </span>
                <span className="text-sm text-gray-600">
                  Subtotal: R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-pink-500">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <Button 
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Pedido por WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="w-full text-pink-500 border-pink-500 hover:bg-pink-50 py-3 rounded-full"
              >
                Limpar Carrinho
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}