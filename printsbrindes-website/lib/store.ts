"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images?: string[]
  mainImage?: string
  showOnHome?: boolean
  slug?: string
  personalization?: string
  productionTime?: string
}

export interface CatalogItem {
  id: number
  title: string
  description: string
  backgroundColor: string
  textColor: string
  buttonColor: string
  productIds: number[]
  slug: string
  image?: string
}

export interface CartItem extends Product {
  quantity: number
  customText?: string
  theme?: string
}

export interface Settings {
  whatsappNumber: string
  email: string
  socialMedia: {
    facebook: string
    instagram: string
    whatsapp: string
  }
}

interface Store {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: number, product: Partial<Product>) => void
  deleteProduct: (id: number) => void
  getProductBySlug: (slug: string) => Product | undefined

  // Catalog
  catalogItems: CatalogItem[]
  addCatalogItem: (item: Omit<CatalogItem, "id">) => void
  updateCatalogItem: (id: number, item: Partial<CatalogItem>) => void
  deleteCatalogItem: (id: number) => void

  // Cart
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number, customText?: string, theme?: string) => void
  updateCartItem: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void

  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Auth
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

// Safe storage that works in both client and server environments
const safeStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(name, value)
    } catch {
      // Silently fail if localStorage is not available
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(name)
    } catch {
      // Silently fail if localStorage is not available
    }
  },
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Initial products with default images and multiple images
      products: [
        {
          id: 1,
          name: "Relógio",
          description: "Relógios personalizados para festas e lembrancinhas, com tema, nome e idade à sua escolha!",
          price: 9.9,
          category: "relógios",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "relogio-personalizado",
          personalization: "Nome, idade e tema personalizados",
          productionTime: "3-5 dias úteis",
        },
        {
          id: 2,
          name: "Caderno",
          description: "Caderno de colorir personalizado para festas, lembrancinhas e diversão criativa!",
          price: 7.9,
          category: "cadernos",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "caderno-colorir",
          personalization: "Nome e tema personalizados",
          productionTime: "2-4 dias úteis",
        },
        {
          id: 3,
          name: "Bolos Personalizados",
          description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa.",
          price: 25.0,
          category: "bolos",
          images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
          mainImage: "/placeholder.svg?height=400&width=400",
          showOnHome: true,
          slug: "bolos-personalizados",
          personalization: "Tema, cores e decoração personalizados",
          productionTime: "5-7 dias úteis",
        },
      ],

      // Initial catalog items with images
      catalogItems: [
        {
          id: 1,
          title: "Relógios Personalizados",
          description:
            "Relógios digitais personalizados com nome, letra ou frase especial. Perfeitos para lembrancinhas de festas, presentes criativos...",
          backgroundColor: "bg-pink-200",
          textColor: "text-pink-700",
          buttonColor: "border-pink-500 text-pink-500 hover:bg-pink-50",
          productIds: [1],
          slug: "relogios",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 2,
          title: "Bolos Personalizados",
          description:
            "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa. Um toque doce e único!",
          backgroundColor: "bg-yellow-200",
          textColor: "text-yellow-700",
          buttonColor: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
          productIds: [3],
          slug: "bolos",
          image: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 3,
          title: "Cadernos de Colorir Personalizados",
          description:
            "Cadernos de colorir personalizados com nome e tema à sua escolha. Ideais para festas, lembrancinhas e para estimular a...",
          backgroundColor: "bg-purple-200",
          textColor: "text-purple-700",
          buttonColor: "border-purple-500 text-purple-500 hover:bg-purple-50",
          productIds: [2],
          slug: "cadernos",
          image: "/placeholder.svg?height=200&width=300",
        },
      ],

      // Cart
      cartItems: [],

      // Settings
      settings: {
        whatsappNumber: "(21) 99930-0409",
        email: "contato@printsbrindes.com",
        socialMedia: {
          facebook: "https://facebook.com/printsbrindes",
          instagram: "https://instagram.com/printsbrindes",
          whatsapp: "https://wa.me/5521999300409",
        },
      },

      // Auth
      isAuthenticated: false,

      // Product actions
      addProduct: (product) =>
        set((state) => {
          try {
            const slug = product.name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Remove accents
              .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
              .replace(/\s+/g, "-") // Replace spaces with hyphens
              .replace(/-+/g, "-") // Replace multiple hyphens with single
              .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
              .trim()

            const newProduct: Product = {
              ...product,
              id: Date.now(),
              slug: slug || `produto-${Date.now()}`,
              images:
                product.images && product.images.length > 0
                  ? product.images
                  : ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
              mainImage: product.mainImage || product.images?.[0] || "/placeholder.svg?height=400&width=400",
              showOnHome: product.showOnHome || false,
              personalization: product.personalization || "Disponível",
              productionTime: product.productionTime || "3-7 dias úteis",
            }

            return {
              products: [...state.products, newProduct],
            }
          } catch (error) {
            console.error("Error adding product:", error)
            return state // Return unchanged state on error
          }
        }),

      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      getProductBySlug: (slug) => {
        const state = get()
        return state.products.find((p) => p.slug === slug)
      },

      // Catalog actions
      addCatalogItem: (item) =>
        set((state) => ({
          catalogItems: [...state.catalogItems, { ...item, id: Date.now() }],
        })),

      updateCatalogItem: (id, updatedItem) =>
        set((state) => ({
          catalogItems: state.catalogItems.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)),
        })),

      deleteCatalogItem: (id) =>
        set((state) => ({
          catalogItems: state.catalogItems.filter((item) => item.id !== id),
        })),

      // Cart actions
      addToCart: (product, quantity = 1, customText = "", theme = "") =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === product.id && item.customText === customText && item.theme === theme,
          )

          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id && item.customText === customText && item.theme === theme
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            }
          }

          return {
            cartItems: [...state.cartItems, { ...product, quantity, customText, theme }],
          }
        }),

      updateCartItem: (id, quantity) =>
        set((state) => ({
          cartItems:
            quantity === 0
              ? state.cartItems.filter((item) => item.id !== id)
              : state.cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
        })),

      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== id),
        })),

      clearCart: () => set({ cartItems: [] }),

      // Settings actions
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Auth actions
      login: (username, password) => {
        if (username === "admin" && password === "printsbrindes2024") {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "printsbrindes-store",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        products: state.products,
        catalogItems: state.catalogItems,
        cartItems: state.cartItems,
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
