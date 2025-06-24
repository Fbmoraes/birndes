import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Facebook, Instagram, MessageCircle, Heart, Star, Users, Award } from "lucide-react"
import Image from "next/image"

export default function SobreNosPage() {
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
            <a href="/sobre-nos" className="text-pink-500 font-medium bg-pink-100 px-4 py-2 rounded-full">
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
            <ShoppingCart className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-pink-500 mb-4">Sobre Nós</h1>
          <p className="text-gray-600 text-lg">
            Conheça a história e os valores que fazem da PrintsBrindes uma empresa especial
          </p>
        </div>
      </section>

      {/* Nossa História Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa História</h2>
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
              </div>
            </div>
            <div className="text-center">
              <div className="bg-pink-500 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-16 h-16 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Equipe da PrintsBrindes</h3>
              <p className="text-gray-600">
                Trabalhando com amor e dedicação para criar produtos únicos que marquem seus momentos especiais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Valores Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Paixão</h3>
                <p className="text-gray-600 text-sm">
                  Somos apaixonados por transformar ideias em produtos únicos e memoráveis.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Qualidade</h3>
                <p className="text-gray-600 text-sm">
                  Oferecemos itens personalizados de alta qualidade que expressam sua individualidade.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Dedicação</h3>
                <p className="text-gray-600 text-sm">
                  Nossa equipe criativa trabalha com carinho em cada detalhe do seu produto.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border border-gray-200">
              <CardContent className="p-0">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Excelência</h3>
                <p className="text-gray-600 text-sm">
                  Desde a concepção do design até a entrega, buscamos sempre a excelência.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossa Missão Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white border border-gray-200 p-8">
            <CardContent className="p-0 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa Missão</h2>
              <p className="text-gray-600 text-lg mb-8">
                Transformar momentos especiais em memórias inesquecíveis através de produtos personalizados únicos,
                criados com amor e atenção aos detalhes.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-pink-500 mb-2">100%</div>
                  <p className="text-gray-600">Personalizado</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-pink-500 fill-current mx-auto mb-2" />
                  <p className="text-gray-600">Feito com Amor</p>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-yellow-500 fill-current mx-auto mb-2" />
                  <p className="text-gray-600">Alta Qualidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* O Que Fazemos Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">O Que Fazemos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-gray-200 p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Produtos Personalizados</h3>
                <p className="text-gray-600 text-sm">
                  Criamos uma ampla variedade de produtos personalizados, desde relógios e cadernos até itens únicos sob
                  medida.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Lembrancinhas de Festa</h3>
                <p className="text-gray-600 text-sm">
                  Especializados em lembrancinhas personalizadas que tornam qualquer festa ainda mais especial e
                  memorável.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 p-6">
              <CardContent className="p-0">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Presentes Únicos</h3>
                <p className="text-gray-600 text-sm">
                  Criamos presentes únicos e personalizados para todas as ocasiões especiais da sua vida.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-pink-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para Criar Algo Especial?</h2>
          <p className="text-pink-100 text-lg mb-8">
            Entre em contato conosco e vamos transformar sua ideia em realidade!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/produtos">
              <Button className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-3 rounded-full">Ver Produtos</Button>
            </a>
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-pink-500 px-8 py-3 rounded-full"
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
