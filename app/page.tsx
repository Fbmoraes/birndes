"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Facebook, Instagram, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import ShoppingCartComponent from "@/components/shopping-cart"
import Header from "@/components/header"
import { useStore } from "@/lib/store-new"

export default function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { catalogItems, settings, fetchData } = useStore()

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onCartClick={() => setIsCartOpen(true)} currentPage="/" />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pink-100 to-pink-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <Image src="/logo-simple.png" alt="PrintsBrindes Logo" width={300} height={120} className="mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-pink-500 mb-6">
            Presentes e Artigos para Festas
            <br />
            Personalizados!
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Tudo o que você precisa para tornar seus momentos inesquecíveis. Canecas, cadernos, bolos e muito mais, tudo
            personalizado do seu jeito!
          </p>
          <a href="/produtos">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full text-lg">
              Ver Produtos
            </Button>
          </a>
        </div>
      </section>

      {/* Products Catalog Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-pink-500 text-center mb-12">Nossos Produtos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {catalogItems.map((item) => (
              <Card
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`${item.backgroundColor} h-48 flex items-center justify-center relative overflow-hidden`}
                >
                  {item.image ? (
                    <>
                      <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <h3 className="text-xl font-bold text-white text-center px-4 drop-shadow-lg">{item.title}</h3>
                      </div>
                    </>
                  ) : (
                    <h3 className={`text-xl font-bold ${item.textColor} text-center px-4`}>{item.title}</h3>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                  <a href={`/categoria/${item.slug}`}>
                    <Button variant="outline" className={`${item.buttonColor} w-full rounded-full`}>
                      Ver Opções
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More Products Section */}
      <section className="bg-gradient-to-b from-pink-100 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pink-500 mb-4">E Muito Mais!</h2>
          <p className="text-gray-600 mb-8">
            Exploramos diversas possibilidades de personalização! Se você tem uma ideia, fale conosco. Adoramos desafios
            criativos!
          </p>
          <a href="/produtos">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full">Mais Produtos</Button>
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-pink-500 mb-6">Sobre Nós</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Na PrintsBrindes, somos apaixonados por transformar ideias em produtos únicos e memoráveis. Nossa
                  missão é oferecer itens personalizados de alta qualidade que expressem a sua individualidade e tornem
                  cada ocasião ainda mais especial.
                </p>
                <p>
                  Com uma equipe criativa e dedicada, trabalhamos com carinho em cada detalhe, desde a concepção do
                  design até a entrega do produto final. Seja para um presente, uma festa ou para uso pessoal, estamos
                  aqui para ajudar você a criar algo verdadeiramente seu.
                </p>
                <p className="text-pink-500 font-medium">Sua imaginação é o nosso ponto de partida!</p>
                <a href="/sobre-nos">
                  <Button variant="outline" className="bg-white text-pink-500 border-pink-500 hover:bg-pink-50 mt-4">
                    Saiba Mais
                  </Button>
                </a>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-16 h-16 text-pink-500 fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Equipe da PrintsBrindes</h3>
              <p className="text-gray-600">Trabalhando com amor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pink-500 mb-6">Entre em Contato</h2>
          <p className="text-gray-600 mb-8">
            Pronto para criar algo especial? Entre em contato conosco e vamos transformar sua ideia em realidade!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleContactClick}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full"
            >
              Fale Conosco
            </Button>
            <a href="/localizacao">
              <Button
                variant="outline"
                className="bg-white text-pink-500 border-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full"
              >
                Nossa Localização
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <a href="/area-administrativa" className="text-pink-500 hover:text-pink-400 text-sm mb-4 inline-block">
              Área Administrativa
            </a>
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
            <p className="text-pink-500 text-sm">PrintsBrindes ❤️ Feito PrintsBrindes</p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart */}
      <ShoppingCartComponent isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
