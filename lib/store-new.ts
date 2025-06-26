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
  // Data
  products: Product[]
  catalogItems: CatalogItem[]
  settings: Settings
  cartItems: CartItem[]
  isAuthenticated: boolean
  isLoading: boolean

  // API Actions
  fetchData: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  getProductBySlug: (slug: string) => Product | undefined

  // Catalog Actions
  addCatalogItem: (item: Omit<CatalogItem, "id">) => Promise<void>
  updateCatalogItem: (id: number, item: Partial<CatalogItem>) => Promise<void>
  deleteCatalogItem: (id: number) => Promise<void>

  // Settings Actions
  updateSettings: (settings: Partial<Settings>) => Promise<void>

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

// API helper functions
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`/api/${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access
      throw new Error('Unauthorized - please login again')
    }
    throw new Error(`API call failed: ${response.statusText}`)
  }
  
  return response.json()
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
      settings: {
        whatsappNumber: "(21) 99930-0409",
        email: "contato@printsbrindes.com",
        socialMedia: {
          facebook: "https://facebook.com/printsbrindes",
          instagram: "https://instagram.com/printsbrindes",
          whatsapp: "https://wa.me/5521999300409",
        },
      },
      cartItems: [],
      isAuthenticated: false,
      isLoading: false,

      // Fetch data from API
      fetchData: async () => {
        try {
          set({ isLoading: true })
          const data = await apiCall('store')
          set({
            products: data.products || [],
            catalogItems: data.catalogItems || [],
            settings: data.settings || get().settings,
            isLoading: false,
          })
        } catch (error) {
          console.error('Failed to fetch data:', error)
          set({ isLoading: false })
        }
      },

      // Product actions
      addProduct: async (product) => {
        try {
          const data = await apiCall('store', {
            method: 'POST',
            body: JSON.stringify({ type: 'products', item: product }),
          })
          set({ products: data.data.products })
        } catch (error) {
          console.error('Failed to add product:', error)
          if (error instanceof Error && error.message.includes('Unauthorized')) {
            set({ isAuthenticated: false })
          }
          throw error
        }
      },

      updateProduct: async (id, updatedProduct) => {
        try {
          const data = await apiCall('store', {
            method: 'PUT',
            body: JSON.stringify({ type: 'products', id, item: updatedProduct }),
          })
          set({ products: data.data.products })
        } catch (error) {
          console.error('Failed to update product:', error)
          throw error
        }
      },

      deleteProduct: async (id) => {
        try {
          const data = await apiCall('store', {
            method: 'DELETE',
            body: JSON.stringify({ type: 'products', id }),
          })
          set({ 
            products: data.data.products,
            cartItems: get().cartItems.filter((item) => item.id !== id),
          })
        } catch (error) {
          console.error('Failed to delete product:', error)
          throw error
        }
      },

      getProductBySlug: (slug) => {
        const state = get()
        return state.products.find((p) => p.slug === slug)
      },

      // Catalog actions
      addCatalogItem: async (item) => {
        try {
          const data = await apiCall('store', {
            method: 'POST',
            body: JSON.stringify({ type: 'catalogItems', item }),
          })
          set({ catalogItems: data.data.catalogItems })
        } catch (error) {
          console.error('Failed to add catalog item:', error)
          throw error
        }
      },

      updateCatalogItem: async (id, updatedItem) => {
        try {
          const data = await apiCall('store', {
            method: 'PUT',
            body: JSON.stringify({ type: 'catalogItems', id, item: updatedItem }),
          })
          set({ catalogItems: data.data.catalogItems })
        } catch (error) {
          console.error('Failed to update catalog item:', error)
          throw error
        }
      },

      deleteCatalogItem: async (id) => {
        try {
          const data = await apiCall('store', {
            method: 'DELETE',
            body: JSON.stringify({ type: 'catalogItems', id }),
          })
          set({ catalogItems: data.data.catalogItems })
        } catch (error) {
          console.error('Failed to delete catalog item:', error)
          throw error
        }
      },

      // Settings actions
      updateSettings: async (newSettings) => {
        try {
          const data = await apiCall('store', {
            method: 'PUT',
            body: JSON.stringify({ type: 'settings', item: newSettings }),
          })
          set({ settings: data.data.settings })
        } catch (error) {
          console.error('Failed to update settings:', error)
          throw error
        }
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
          const result = await apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'login', username, password }),
          })
          
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
          await apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'logout' }),
          })
          set({ isAuthenticated: false })
        } catch (error) {
          console.error('Logout failed:', error)
        }
      },

      checkAuth: async () => {
        try {
          const result = await apiCall('auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'check' }),
          })
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

