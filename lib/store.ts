"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type Product, type CatalogItem, type Settings } from './supabase'

export interface CartItem extends Product {
  quantity: number
  customText?: string
  theme?: string
}

interface Store {
  // Data
  products: Product[]
  catalogItems: CatalogItem[]
  settings: Settings | null
  cartItems: CartItem[]
  isAuthenticated: boolean
  isLoading: boolean

  // API Actions
  fetchProducts: () => Promise<void>
  fetchCatalogItems: () => Promise<void>
  fetchSettings: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  updateSettings: (settings: Partial<Settings>) => Promise<void>
  getProductBySlug: (slug: string) => Product | undefined

  // Cart Actions (local only)
  addToCart: (product: Product, quantity?: number, customText?: string, theme?: string) => void
  updateCartItem: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void

  // Auth Actions
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
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
      // Initial state
      products: [],
      catalogItems: [],
      settings: null,
      cartItems: [],
      isAuthenticated: false,
      isLoading: false,

      // Fetch products
      fetchProducts: async () => {
        try {
          set({ isLoading: true })
          const response = await fetch('/api/products')
          const result = await response.json()
          
          if (result.success) {
            set({ products: result.data })
          }
        } catch (error) {
          console.error('Failed to fetch products:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Fetch catalog items
      fetchCatalogItems: async () => {
        try {
          // For now, we'll use the default catalog items
          // You can implement this API later if needed
          const defaultCatalogItems = [
            {
              id: 1,
              title: "Relógios Personalizados",
              description: "Relógios digitais personalizados com nome, letra ou frase especial.",
              background_color: "bg-pink-200",
              text_color: "text-pink-700",
              button_color: "border-pink-500 text-pink-500 hover:bg-pink-50",
              product_ids: [1],
              slug: "relogios",
              image: "/placeholder.svg?height=200&width=300",
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 2,
              title: "Bolos Personalizados",
              description: "Celebre momentos especiais com bolos deliciosos e personalizados.",
              background_color: "bg-yellow-200",
              text_color: "text-yellow-700",
              button_color: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
              product_ids: [3],
              slug: "bolos",
              image: "/placeholder.svg?height=200&width=300",
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: 3,
              title: "Cadernos de Colorir Personalizados",
              description: "Cadernos de colorir personalizados com nome e tema à sua escolha.",
              background_color: "bg-purple-200",
              text_color: "text-purple-700",
              button_color: "border-purple-500 text-purple-500 hover:bg-purple-50",
              product_ids: [2],
              slug: "cadernos",
              image: "/placeholder.svg?height=200&width=300",
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]
          set({ catalogItems: defaultCatalogItems })
        } catch (error) {
          console.error('Failed to fetch catalog items:', error)
        }
      },

      // Fetch settings
      fetchSettings: async () => {
        try {
          const response = await fetch('/api/settings')
          const result = await response.json()
          
          if (result.success) {
            set({ settings: result.data })
          }
        } catch (error) {
          console.error('Failed to fetch settings:', error)
        }
      },

      // Add product
      addProduct: async (product) => {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
          })
          
          const result = await response.json()
          
          if (result.success) {
            // Refresh products list
            await get().fetchProducts()
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Failed to add product:', error)
          throw error
        }
      },

      // Update product
      updateProduct: async (id, updates) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          })
          
          const result = await response.json()
          
          if (result.success) {
            // Refresh products list
            await get().fetchProducts()
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Failed to update product:', error)
          throw error
        }
      },

      // Delete product
      deleteProduct: async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          })
          
          const result = await response.json()
          
          if (result.success) {
            // Refresh products list and remove from cart
            await get().fetchProducts()
            set((state) => ({
              cartItems: state.cartItems.filter((item) => item.id !== id),
            }))
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Failed to delete product:', error)
          throw error
        }
      },

      // Update settings
      updateSettings: async (updates) => {
        try {
          const response = await fetch('/api/settings', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          })
          
          const result = await response.json()
          
          if (result.success) {
            // Refresh settings
            await get().fetchSettings()
          } else {
            throw new Error(result.error)
          }
        } catch (error) {
          console.error('Failed to update settings:', error)
          throw error
        }
      },

      // Get product by slug
      getProductBySlug: (slug) => {
        const state = get()
        return state.products.find((p) => p.slug === slug)
      },

      // Cart actions (local only)
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

      // Auth actions
      login: async (username, password) => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'login', username, password }),
          })
          
          const result = await response.json()
          
          if (result.success) {
            set({ isAuthenticated: true })
            return true
          }
          return false
        } catch (error) {
          console.error('Login failed:', error)
          return false
        }
      },

      logout: async () => {
        try {
          await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'logout' }),
          })
          set({ isAuthenticated: false })
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },

      checkAuth: async () => {
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'check' }),
          })
          
          const result = await response.json()
          set({ isAuthenticated: result.authenticated })
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ isAuthenticated: false })
        }
      },
    }),
    {
      name: "printsbrindes-store",
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        cartItems: state.cartItems, // Only persist cart items locally
      }),
    },
  ),
)