import { getCollection } from './mongodb'
import { 
  Product, 
  CatalogItem, 
  Settings, 
  Analytics, 
  SEOData,
  defaultProducts,
  defaultCatalogItems,
  defaultSettings
} from './models'

export class DatabaseService {
  // Products CRUD
  static async getProducts(): Promise<Product[]> {
    try {
      const collection = await getCollection('products')
      const products = await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      return products as Product[]
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  static async getProductById(id: number): Promise<Product | null> {
    try {
      const collection = await getCollection('products')
      const product = await collection.findOne({ id, isActive: true })
      return product as Product | null
    } catch (error) {
      console.error('Error fetching product by id:', error)
      return null
    }
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const collection = await getCollection('products')
      const product = await collection.findOne({ slug, isActive: true })
      return product as Product | null
    } catch (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }
  }

  static async createProduct(productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const collection = await getCollection('products')
      
      // Generate new ID
      const lastProduct = await collection.findOne({}, { sort: { id: -1 } })
      const newId = (lastProduct?.id || 0) + 1
      
      const product: Omit<Product, '_id'> = {
        ...productData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
      
      const result = await collection.insertOne(product)
      return { ...product, _id: result.insertedId } as Product
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    try {
      const collection = await getCollection('products')
      const result = await collection.updateOne(
        { id },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating product:', error)
      return false
    }
  }

  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const collection = await getCollection('products')
      const result = await collection.updateOne(
        { id },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date() 
          } 
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  // Catalog Items CRUD
  static async getCatalogItems(): Promise<CatalogItem[]> {
    try {
      const collection = await getCollection('catalogItems')
      const items = await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
      return items as CatalogItem[]
    } catch (error) {
      console.error('Error fetching catalog items:', error)
      return []
    }
  }

  static async createCatalogItem(itemData: Omit<CatalogItem, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<CatalogItem> {
    try {
      const collection = await getCollection('catalogItems')
      
      // Generate new ID
      const lastItem = await collection.findOne({}, { sort: { id: -1 } })
      const newId = (lastItem?.id || 0) + 1
      
      const item: Omit<CatalogItem, '_id'> = {
        ...itemData,
        id: newId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }
      
      const result = await collection.insertOne(item)
      return { ...item, _id: result.insertedId } as CatalogItem
    } catch (error) {
      console.error('Error creating catalog item:', error)
      throw error
    }
  }

  static async updateCatalogItem(id: number, updates: Partial<CatalogItem>): Promise<boolean> {
    try {
      const collection = await getCollection('catalogItems')
      const result = await collection.updateOne(
        { id },
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error updating catalog item:', error)
      return false
    }
  }

  static async deleteCatalogItem(id: number): Promise<boolean> {
    try {
      const collection = await getCollection('catalogItems')
      const result = await collection.updateOne(
        { id },
        { 
          $set: { 
            isActive: false,
            updatedAt: new Date() 
          } 
        }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('Error deleting catalog item:', error)
      return false
    }
  }

  // Settings CRUD
  static async getSettings(): Promise<Settings> {
    try {
      const collection = await getCollection('settings')
      const settings = await collection.findOne({})
      return settings as Settings || { ...defaultSettings, updatedAt: new Date() }
    } catch (error) {
      console.error('Error fetching settings:', error)
      return { ...defaultSettings, updatedAt: new Date() }
    }
  }

  static async updateSettings(updates: Partial<Settings>): Promise<boolean> {
    try {
      const collection = await getCollection('settings')
      const result = await collection.updateOne(
        {},
        { 
          $set: { 
            ...updates, 
            updatedAt: new Date() 
          } 
        },
        { upsert: true }
      )
      return result.modifiedCount > 0 || result.upsertedCount > 0
    } catch (error) {
      console.error('Error updating settings:', error)
      return false
    }
  }

  // Analytics CRUD
  static async saveAnalytics(data: Omit<Analytics, '_id'>): Promise<boolean> {
    try {
      const collection = await getCollection('analytics')
      await collection.insertOne(data)
      return true
    } catch (error) {
      console.error('Error saving analytics:', error)
      return false
    }
  }

  static async getAnalytics(days: number = 30): Promise<Analytics[]> {
    try {
      const collection = await getCollection('analytics')
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const analytics = await collection
        .find({ date: { $gte: startDate } })
        .sort({ date: -1 })
        .toArray()
      
      return analytics as Analytics[]
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return []
    }
  }

  // SEO Data CRUD
  static async saveSEOData(data: Omit<SEOData, '_id'>): Promise<boolean> {
    try {
      const collection = await getCollection('seoData')
      await collection.insertOne(data)
      return true
    } catch (error) {
      console.error('Error saving SEO data:', error)
      return false
    }
  }

  static async getSEOData(days: number = 30): Promise<SEOData[]> {
    try {
      const collection = await getCollection('seoData')
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
      
      const seoData = await collection
        .find({ date: { $gte: startDate } })
        .sort({ date: -1 })
        .toArray()
      
      return seoData as SEOData[]
    } catch (error) {
      console.error('Error fetching SEO data:', error)
      return []
    }
  }

  // Initialize database with default data
  static async initializeDatabase(): Promise<void> {
    try {
      console.log('Initializing database with default data...')
      
      // Initialize products
      const productsCollection = await getCollection('products')
      const existingProducts = await productsCollection.countDocuments()
      
      if (existingProducts === 0) {
        const productsToInsert = defaultProducts.map(product => ({
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        await productsCollection.insertMany(productsToInsert)
        console.log('✅ Default products inserted')
      }

      // Initialize catalog items
      const catalogCollection = await getCollection('catalogItems')
      const existingCatalogItems = await catalogCollection.countDocuments()
      
      if (existingCatalogItems === 0) {
        const catalogItemsToInsert = defaultCatalogItems.map(item => ({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        await catalogCollection.insertMany(catalogItemsToInsert)
        console.log('✅ Default catalog items inserted')
      }

      // Initialize settings
      const settingsCollection = await getCollection('settings')
      const existingSettings = await settingsCollection.countDocuments()
      
      if (existingSettings === 0) {
        await settingsCollection.insertOne({
          ...defaultSettings,
          updatedAt: new Date(),
        })
        console.log('✅ Default settings inserted')
      }

      console.log('✅ Database initialization completed')
    } catch (error) {
      console.error('❌ Error initializing database:', error)
      throw error
    }
  }

  // Get all data (for compatibility with existing frontend)
  static async getAllData() {
    try {
      const [products, catalogItems, settings] = await Promise.all([
        this.getProducts(),
        this.getCatalogItems(),
        this.getSettings(),
      ])

      return {
        products,
        catalogItems,
        settings,
        version: Date.now(),
        lastUpdated: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching all data:', error)
      throw error
    }
  }
}