import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  main_image: string
  show_on_home: boolean
  slug: string
  personalization?: string
  production_time?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CatalogItem {
  id: number
  title: string
  description: string
  background_color: string
  text_color: string
  button_color: string
  product_ids: number[]
  slug: string
  image: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Settings {
  id: number
  whatsapp_number: string
  email: string
  facebook_url: string
  instagram_url: string
  whatsapp_url: string
  seo_title: string
  seo_description: string
  seo_keywords: string
  google_analytics_id: string
  google_search_console_id: string
  facebook_pixel_id: string
  updated_at: string
}

export interface SEOData {
  id: number
  page_path: string
  page_title: string
  meta_description: string
  keywords: string
  og_title: string
  og_description: string
  og_image: string
  canonical_url: string
  created_at: string
  updated_at: string
}