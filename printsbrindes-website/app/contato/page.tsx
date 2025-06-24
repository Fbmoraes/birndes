"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
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
            <a href="/contato" className="text-pink-500 font-medium bg-pink-100 px-4 py-2 rounded-full">
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
          <h1 className="text-4xl font-bold text-pink-500 mb-4">Entre em Contato</h1>
          <p className="text-gray-600 text-lg">
            Estamos aqui para ajudar você a criar produtos personalizados únicos. Entre em contato conosco!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-white border border-gray-200 p-8">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Envie sua Mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nome" className="text-sm text-gray-700">
                      Nome *
                    </Label>
                    <Input
                      id="nome"
                      name="nome"
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="text-sm text-gray-700">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      placeholder="(21) 99999-9999"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mensagem" className="text-sm text-gray-700">
                      Mensagem *
                    </Label>
                    <Textarea
                      id="mensagem"
                      name="mensagem"
                      placeholder="Conte-nos sobre seu projeto ou dúvida..."
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Informações de Contato</h2>
                <p className="text-gray-600 mb-6">
                  Estamos sempre prontos para atender você! Entre em contato através de qualquer um dos canais abaixo.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Email</h3>
                      <p className="text-pink-500">contato@printsbrindes.com</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Telefone</h3>
                      <p className="text-pink-500">(21) 99930-0409</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Endereço</h3>
                      <p className="text-pink-500">Rua Goes e Vasconcellos 96, Guaratiba - CEP: 23030-240</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 p-4">
                  <CardContent className="p-0 flex items-center space-x-4">
                    <div className="bg-pink-100 rounded-full w-12 h-12 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Horário</h3>
                      <p className="text-pink-500">Segunda a Sexta: 9h às 18h</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* WhatsApp Section */}
              <Card className="bg-green-50 border border-green-200 p-6 text-center">
                <CardContent className="p-0">
                  <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">WhatsApp</h3>
                  <p className="text-gray-600 mb-4">
                    Fale conosco diretamente pelo WhatsApp para um atendimento mais rápido!
                  </p>
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full">
                    Chamar no WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Qual o prazo de entrega?</h3>
                <p className="text-gray-600">
                  O prazo varia de acordo com o produto e a quantidade. Geralmente entre 3 a 7 dias úteis após a
                  confirmação do pedido.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Posso personalizar qualquer produto?</h3>
                <p className="text-gray-600">
                  Sim! Trabalhamos com personalizações completas. Se você tem uma ideia específica, entre em contato
                  conosco.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Como faço meu pedido?</h3>
                <p className="text-gray-600">
                  Você pode adicionar produtos ao carrinho em nosso site e finalizar pelo WhatsApp, ou entrar em contato
                  diretamente conosco.
                </p>
              </CardContent>
            </Card>
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
