"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, MessageCircle, User, Lock, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { useStore } from "@/lib/store-new"

export default function AreaAdministrativaPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(formData.usuario, formData.senha)
    if (success) {
      // Force a hard refresh when redirecting to the panel
      window.location.href = "/painel-administrativo"
    } else {
      setError("Credenciais inválidas!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <Header currentPage="/area-administrativa" />

      {/* Login Section */}
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Image src="/logo-simple.png" alt="PrintsBrindes Logo" width={200} height={80} className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Área Administrativa</h1>
            <p className="text-gray-600">Faça login para gerenciar seus produtos</p>
          </div>

          <Card className="bg-white border border-gray-200 p-8">
            <CardContent className="p-0">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Entrar no Sistema</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="usuario" className="text-sm text-gray-700 mb-2 block">
                    Usuário
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="usuario"
                      name="usuario"
                      placeholder="Digite seu usuário"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="senha" className="text-sm text-gray-700 mb-2 block">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="senha"
                      name="senha"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.senha}
                      onChange={handleInputChange}
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-full">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">© 2024 PrintsBrindes. Todos os direitos reservados.</p>
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
