import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ShoppingCart,
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  Truck,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react"
import Image from "next/image"

export default function LocalizacaoPage() {
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
            <a href="/localizacao" className="text-pink-500 font-medium bg-pink-100 px-4 py-2 rounded-full">
              Localização
            </a>
          </nav>
          <div className="flex items-center">
            <ShoppingCart className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-pink-500 mb-4">Nossa Localização</h1>
          <p className="text-gray-600 text-lg">
            Venha nos visitar! Estamos localizados em Guaratiba e prontos para atender você.
          </p>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map Section */}
            <Card className="bg-gray-100 border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 flex flex-col items-center justify-center p-8">
                  <div className="bg-pink-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Mapa Interativo</h3>
                  <p className="text-gray-600 text-center mb-6">
                    Clique no botão abaixo para ver nossa localização no Google Maps
                  </p>
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full">
                    Abrir no Google Maps
                  </Button>
                </div>
                <div className="bg-white p-4 text-center">
                  <h4 className="font-bold text-gray-800 mb-1">PrintsBrindes</h4>
                  <p className="text-gray-600 text-sm">Rua Goes e Vasconcellos 96, Guaratiba - CEP: 23030-240</p>
                </div>
              </CardContent>
            </Card>

            {/* Store Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações da Loja</h2>
                <p className="text-gray-600 mb-6">
                  Nossa loja está localizada em Guaratiba, Rio de Janeiro. Venha nos visitar para conhecer nossos
                  produtos de perto e conversar sobre suas ideias de personalização!
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mt-1">
                      <MapPin className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Endereço</h3>
                      <p className="text-pink-500">Rua Goes e Vasconcellos 96, Guaratiba - CEP: 23030-240</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-start space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center mt-1">
                      <Clock className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Horário de Funcionamento</h3>
                      <div className="text-pink-500 space-y-1">
                        <p>Segunda a Sexta: 9h às 18h</p>
                        <p>Sábado: 9h às 15h</p>
                        <p>Domingo: Fechado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Telefone</h3>
                      <p className="text-pink-500">(21) 99930-0409</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                      <p className="text-pink-500">contato@printsbrindes.com</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Directions Section */}
              <Card className="bg-pink-500 p-6 text-center">
                <CardContent className="p-0">
                  <Navigation className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Como Chegar</h3>
                  <p className="text-pink-100 mb-4">
                    Precisa de direções? Clique no botão abaixo para abrir a navegação no Google Maps.
                  </p>
                  <Button className="bg-white text-pink-500 hover:bg-gray-100 px-6 py-2 rounded-full">
                    Obter Direções
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Important Information Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Informações Importantes</h2>
            <p className="text-gray-600">Algumas informações úteis para sua visita</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Envio para Todo o Brasil</h3>
                <p className="text-gray-600 text-sm">
                  Fazemos entregas para todo o território nacional. Consulte prazos e valores de frete!
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Agendamento</h3>
                <p className="text-gray-600 text-sm">
                  Recomendamos agendar sua visita para garantir um atendimento personalizado e exclusivo.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Consultoria</h3>
                <p className="text-gray-600 text-sm">
                  Nossa equipe está pronta para ajudar você a criar o produto personalizado perfeito.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Formas de Pagamento</h3>
                <p className="text-gray-600 text-sm">
                  Aceitamos dinheiro, cartão de débito, crédito e PIX para sua comodidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ainda tem dúvidas?</h2>
          <p className="text-gray-600 text-lg mb-8">Entre em contato conosco antes de sua visita!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full">
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="bg-white text-pink-500 border-pink-500 hover:bg-pink-50 px-8 py-3 rounded-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              Ligar Agora
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
