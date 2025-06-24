"use client"

import { useState } from "react"
import { ShoppingCart, Menu, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onCartClick?: () => void
  currentPage?: string
}

export default function Header({ onCartClick, currentPage = "/" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/produtos", label: "Produtos" },
    { href: "/sobre-nos", label: "Sobre Nós" },
    { href: "/contato", label: "Contato" },
    { href: "/localizacao", label: "Localização" },
  ]

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/">
            <Image src="/logo.png" alt="PrintsBrindes Logo" width={120} height={40} />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                currentPage === item.href
                  ? "text-pink-500 font-medium"
                  : "text-gray-600 hover:text-pink-500"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side - Cart and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Shopping Cart */}
          <button onClick={onCartClick} className="p-2">
            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-pink-500 transition-colors" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Image src="/logo.png" alt="PrintsBrindes Logo" width={100} height={33} />
          <button onClick={closeMobileMenu} className="p-2">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`block py-3 px-4 rounded-lg transition-colors ${
                    currentPage === item.href
                      ? "bg-pink-50 text-pink-500 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-pink-500"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Button
              onClick={() => {
                onCartClick?.()
                closeMobileMenu()
              }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ver Carrinho
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

