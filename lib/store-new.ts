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
  syncStatus: 'idle' | 'syncing' | 'success' | 'error'
  syncMessage: string

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
      syncStatus: 'idle',
      syncMessage: '',

      // Fetch data from API
      fetchData: async () => {
        const currentState = get()
        
        try {
          set({ isLoading: true, syncStatus: 'syncing', syncMessage: 'Carregando dados...' })
          
          // Add multiple cache-busting parameters for mobile devices
          const timestamp = Date.now()
          const random = Math.random().toString(36).substring(7)
          const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
          
          // Use mobile-specific endpoint for mobile devices to force cache refresh
          const url = isMobile 
            ? `/api/store/mobile-refresh?t=${timestamp}&r=${random}`
            : `/api/store?t=${timestamp}&r=${random}&mobile=0`
          
          console.log('Fetching data from:', url, { isMobile })
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Requested-With': 'XMLHttpRequest',
              'X-Cache-Bust': timestamp.toString(),
              ...(isMobile && {
                'X-Mobile-Request': '1',
                'X-Force-Refresh': '1'
              })
            }
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
          }
          
          const data = await response.json()
          
          // Ensure we have valid data structure
          const validData = {
            products: Array.isArray(data.products) ? data.products : [],
            catalogItems: Array.isArray(data.catalogItems) ? data.catalogItems : [],
            settings: data.settings || currentState.settings,
          }
          
          set({
            ...validData,
            isLoading: false,
            syncStatus: 'success',
            syncMessage: `Dados atualizados! ${validData.products.length} produtos carregados`
          })
          
          console.log('Data fetched successfully:', {
            productsCount: validData.products.length,
            catalogItemsCount: validData.catalogItems.length,
            hasSettings: !!validData.settings,
            version: data.version,
            lastUpdated: data.lastUpdated,
            isMobile,
            timestamp: new Date().toISOString()
          })
          
          // Reset sync status after showing success
          setTimeout(() => {
            set({ syncStatus: 'idle', syncMessage: '' })
          }, 2000)
          
        } catch (error) {
          console.error('Failed to fetch data:', error)
          // Always ensure isLoading is set to false
          set({ 
            isLoading: false,
            syncStatus: 'error',
            syncMessage: 'Erro ao carregar dados'
          })
          
          // Reset sync status after showing error
          setTimeout(() => {
            set({ syncStatus: 'idle', syncMessage: '' })
          }, 3000)
          
          // Don't throw error to prevent initialization from failing
          console.warn('Using existing data due to fetch error')
        }
      },

      // Product actions
      addProduct: async (product) => {
        try {
          console.log('Adding product:', product.name)
          set({ syncStatus: 'syncing', syncMessage: `Adicionando produto "${product.name}"...` })
          
          const response = await fetch('/api/store', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            },
            body: JSON.stringify({ type: 'products', item: product }),
          })
          
          if (!response.ok) {
            if (response.status === 401) {
              set({ isAuthenticated: false, syncStatus: 'error', syncMessage: 'Não autorizado - faça login novamente' })
              throw new Error('Unauthorized - please login again')
            }
            set({ syncStatus: 'error', syncMessage: 'Erro ao adicionar produto' })
            throw new Error(`Failed to add product: ${response.statusText}`)
          }
          
          const data = await response.json()
          
          // Update all data from response
          if (data.data) {
            set({
              products: Array.isArray(data.data.products) ? data.data.products : get().products,
              catalogItems: Array.isArray(data.data.catalogItems) ? data.data.catalogItems : get().catalogItems,
              settings: data.data.settings || get().settings,
              syncStatus: 'success',
              syncMessage: `Produto "${product.name}" adicionado com sucesso!`
            })
            
            console.log('Product added successfully:', {
              productsCount: data.data.products?.length || 0,
              newProduct: product.name,
              timestamp: new Date().toISOString()
            })
            
            // Force a fresh data fetch to ensure synchronization
            setTimeout(() => {
              get().fetchData()
            }, 1000)
            
            // Reset sync status after showing success
            setTimeout(() => {
              set({ syncStatus: 'idle', syncMessage: '' })
            }, 3000)
          }
        } catch (error) {
          console.error('Failed to add product:', error)
          set({ syncStatus: 'error', syncMessage: 'Erro ao adicionar produto' })
          if (error instanceof Error && error.message.includes('Unauthorized')) {
            set({ isAuthenticated: false })
          }
          
          // Reset sync status after showing error
          setTimeout(() => {
            set({ syncStatus: 'idle', syncMessage: '' })
          }, 5000)
          
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
          console.log('Auth check completed:', result.authenticated)
        } catch (error) {
          console.error('Auth check failed:', error)
          set({ isAuthenticated: false })
          // Don't throw - just set to false
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

