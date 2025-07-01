import { supabase, type Product, type CatalogItem, type Settings, type SEOData } from './supabase'

export class DatabaseService {
  // Products
  static async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching products:', error)
      return this.getDefaultProducts()
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product by id:', error)
      return null
    }
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  }

  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating product:', error)
      return null
    }
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  }

  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  // Catalog Items
  static async getCatalogItems(): Promise<CatalogItem[]> {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching catalog items:', error)
      return this.getDefaultCatalogItems()
    }
  }

  static async createCatalogItem(itemData: Omit<CatalogItem, 'id' | 'created_at' | 'updated_at'>): Promise<CatalogItem | null> {
    try {
      const { data, error } = await supabase
        .from('catalog_items')
        .insert([itemData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating catalog item:', error)
      return null
    }
  }

  static async updateCatalogItem(id: number, updates: Partial<CatalogItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('catalog_items')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating catalog item:', error)
      return false
    }
  }

  static async deleteCatalogItem(id: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('catalog_items')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting catalog item:', error)
      return false
    }
  }

  // Settings
  static async getSettings(): Promise<Settings | null> {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching settings:', error)
      return this.getDefaultSettings()
    }
  }

  static async updateSettings(updates: Partial<Settings>): Promise<boolean> {
    try {
      // First check if settings exist
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .limit(1)
        .single()

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('settings')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('settings')
          .insert([{ ...updates, updated_at: new Date().toISOString() }])

        if (error) throw error
      }

      return true
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    }
  }

  // SEO Data
  static async getSEOData(pagePath: string): Promise<SEOData | null> {
    try {
      const { data, error } = await supabase
        .from('seo_data')
        .select('*')
        .eq('page_path', pagePath)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching SEO data:', error)
      return null
    }
  }

  static async upsertSEOData(seoData: Omit<SEOData, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('seo_data')
        .upsert([{ ...seoData, updated_at: new Date().toISOString() }], {
          onConflict: 'page_path'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error upserting SEO data:', error)
      return false
    }
  }

  // Default data fallbacks
  static getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Relógio Personalizado",
        description: "Relógios personalizados para festas e lembrancinhas, com tema, nome e idade à sua escolha!",
        price: 9.9,
        category: "relógios",
        images: ["/placeholder.svg?height=400&width=400"],
        main_image: "/placeholder.svg?height=400&width=400",
        show_on_home: true,
        slug: "relogio-personalizado",
        personalization: "Nome, idade e tema personalizados",
        production_time: "3-5 dias úteis",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Caderno de Colorir",
        description: "Caderno de colorir personalizado para festas, lembrancinhas e diversão criativa!",
        price: 7.9,
        category: "cadernos",
        images: ["/placeholder.svg?height=400&width=400"],
        main_image: "/placeholder.svg?height=400&width=400",
        show_on_home: true,
        slug: "caderno-colorir",
        personalization: "Nome e tema personalizados",
        production_time: "2-4 dias úteis",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        name: "Bolos Personalizados",
        description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa.",
        price: 25.0,
        category: "bolos",
        images: ["/placeholder.svg?height=400&width=400"],
        main_image: "/placeholder.svg?height=400&width=400",
        show_on_home: true,
        slug: "bolos-personalizados",
        personalization: "Tema, cores e decoração personalizados",
        production_time: "5-7 dias úteis",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  static getDefaultCatalogItems(): CatalogItem[] {
    return [
      {
        id: 1,
        title: "Relógios Personalizados",
        description: "Relógios digitais personalizados com nome, letra ou frase especial. Perfeitos para lembrancinhas de festas, presentes criativos...",
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
        description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa. Um toque doce e único!",
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
        description: "Cadernos de colorir personalizados com nome e tema à sua escolha. Ideais para festas, lembrancinhas e para estimular a...",
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
  }

  static getDefaultSettings(): Settings {
    return {
      id: 1,
      whatsapp_number: "(21) 99930-0409",
      email: "contato@printsbrindes.com",
      facebook_url: "https://facebook.com/printsbrindes",
      instagram_url: "https://instagram.com/printsbrindes",
      whatsapp_url: "https://wa.me/5521999300409",
      seo_title: "PrintsBrindes - Presentes e Artigos Personalizados",
      seo_description: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
      seo_keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
      google_analytics_id: "G-PS2KYDM9N0",
      google_search_console_id: "",
      facebook_pixel_id: "",
      updated_at: new Date().toISOString(),
    }
  }
}