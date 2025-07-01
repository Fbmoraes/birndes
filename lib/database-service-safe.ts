import { getCollection, isMongoDBAvailable } from './mongodb-safe'
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

// Fallback to old database system if MongoDB is not available
import { Database as FallbackDatabase } from './database'

export class DatabaseService {
  // Check if MongoDB is available, otherwise use fallback
  private static async useMongoOrFallback<T>(
    mongoOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>
  ): Promise<T> {
    if (isMongoDBAvailable()) {
      try {
        return await mongoOperation()
      } catch (error) {
        console.warn('MongoDB operation failed, using fallback:', error)
        return await fallbackOperation()
      }
    } else {
      return await fallbackOperation()
    }
  }

  // Products CRUD
  static async getProducts(): Promise<Product[]> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
        const products = await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
        return products as Product[]
      },
      async () => {
        const data = await FallbackDatabase.read()
        return data.products || []
      }
    )
  }

  static async getProductById(id: number): Promise<Product | null> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
        const product = await collection.findOne({ id, isActive: true })
        return product as Product | null
      },
      async () => {
        const data = await FallbackDatabase.read()
        return data.products.find((p: any) => p.id === id) || null
      }
    )
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
        const product = await collection.findOne({ slug, isActive: true })
        return product as Product | null
      },
      async () => {
        const data = await FallbackDatabase.read()
        return data.products.find((p: any) => p.slug === slug) || null
      }
    )
  }

  static async createProduct(productData: Omit<Product, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
        
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        const newId = Math.max(...data.products.map((p: any) => p.id), 0) + 1
        const newProduct = {
          ...productData,
          id: newId,
          slug: productData.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")
            .trim() || `produto-${newId}`,
        }
        data.products.push(newProduct)
        await FallbackDatabase.write(data)
        return newProduct as Product
      }
    )
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        const index = data.products.findIndex((p: any) => p.id === id)
        if (index !== -1) {
          data.products[index] = { ...data.products[index], ...updates }
          await FallbackDatabase.write(data)
          return true
        }
        return false
      }
    )
  }

  static async deleteProduct(id: number): Promise<boolean> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('products')
        if (!collection) throw new Error('Collection not available')
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        data.products = data.products.filter((p: any) => p.id !== id)
        await FallbackDatabase.write(data)
        return true
      }
    )
  }

  // Catalog Items CRUD
  static async getCatalogItems(): Promise<CatalogItem[]> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('catalogItems')
        if (!collection) throw new Error('Collection not available')
        const items = await collection.find({ isActive: true }).sort({ createdAt: -1 }).toArray()
        return items as CatalogItem[]
      },
      async () => {
        const data = await FallbackDatabase.read()
        return data.catalogItems || []
      }
    )
  }

  static async createCatalogItem(itemData: Omit<CatalogItem, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<CatalogItem> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('catalogItems')
        if (!collection) throw new Error('Collection not available')
        
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        const newId = Math.max(...data.catalogItems.map((c: any) => c.id), 0) + 1
        const newItem = {
          ...itemData,
          id: newId,
        }
        data.catalogItems.push(newItem)
        await FallbackDatabase.write(data)
        return newItem as CatalogItem
      }
    )
  }

  static async updateCatalogItem(id: number, updates: Partial<CatalogItem>): Promise<boolean> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('catalogItems')
        if (!collection) throw new Error('Collection not available')
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        const index = data.catalogItems.findIndex((c: any) => c.id === id)
        if (index !== -1) {
          data.catalogItems[index] = { ...data.catalogItems[index], ...updates }
          await FallbackDatabase.write(data)
          return true
        }
        return false
      }
    )
  }

  static async deleteCatalogItem(id: number): Promise<boolean> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('catalogItems')
        if (!collection) throw new Error('Collection not available')
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        data.catalogItems = data.catalogItems.filter((c: any) => c.id !== id)
        await FallbackDatabase.write(data)
        return true
      }
    )
  }

  // Settings CRUD
  static async getSettings(): Promise<Settings> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('settings')
        if (!collection) throw new Error('Collection not available')
        const settings = await collection.findOne({})
        return settings as Settings || { ...defaultSettings, updatedAt: new Date() }
      },
      async () => {
        const data = await FallbackDatabase.read()
        return data.settings || { ...defaultSettings, updatedAt: new Date() }
      }
    )
  }

  static async updateSettings(updates: Partial<Settings>): Promise<boolean> {
    return this.useMongoOrFallback(
      async () => {
        const collection = await getCollection('settings')
        if (!collection) throw new Error('Collection not available')
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
      },
      async () => {
        const data = await FallbackDatabase.read()
        data.settings = { ...data.settings, ...updates }
        await FallbackDatabase.write(data)
        return true
      }
    )
  }

  // Analytics CRUD (MongoDB only, fallback to mock data)
  static async saveAnalytics(data: Omit<Analytics, '_id'>): Promise<boolean> {
    if (!isMongoDBAvailable()) {
      console.log('Analytics saved (mock)')
      return true
    }
    
    try {
      const collection = await getCollection('analytics')
      if (!collection) return false
      await collection.insertOne(data)
      return true
    } catch (error) {
      console.error('Error saving analytics:', error)
      return false
    }
  }

  static async getAnalytics(days: number = 30): Promise<Analytics[]> {
    if (!isMongoDBAvailable()) {
      return []
    }
    
    try {
      const collection = await getCollection('analytics')
      if (!collection) return []
      
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

  // SEO Data CRUD (MongoDB only, fallback to mock data)
  static async saveSEOData(data: Omit<SEOData, '_id'>): Promise<boolean> {
    if (!isMongoDBAvailable()) {
      console.log('SEO data saved (mock)')
      return true
    }
    
    try {
      const collection = await getCollection('seoData')
      if (!collection) return false
      await collection.insertOne(data)
      return true
    } catch (error) {
      console.error('Error saving SEO data:', error)
      return false
    }
  }

  static async getSEOData(days: number = 30): Promise<SEOData[]> {
    if (!isMongoDBAvailable()) {
      return []
    }
    
    try {
      const collection = await getCollection('seoData')
      if (!collection) return []
      
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
    if (!isMongoDBAvailable()) {
      console.log('MongoDB not available, skipping initialization')
      return
    }
    
    try {
      console.log('Initializing database with default data...')
      
      // Initialize products
      const productsCollection = await getCollection('products')
      if (!productsCollection) return
      
      const existingProducts = await productsCollection.countDocuments()
      
      if (existingProducts === 0) {
        const productsToInsert = defaultProducts.map(product => ({
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        await productsCollection.insertMany(productsToInsert)
        console.log('✅ Default products inserted')
        
        // Create indexes for products
        try {
          await productsCollection.createIndex({ id: 1 }, { unique: true })
          await productsCollection.createIndex({ slug: 1 }, { unique: true })
          await productsCollection.createIndex({ isActive: 1 })
          console.log('✅ Product indexes created')
        } catch (indexError) {
          console.warn('⚠️ Product indexes may already exist:', indexError.message)
        }
      }

      // Initialize catalog items
      const catalogCollection = await getCollection('catalogItems')
      if (!catalogCollection) return
      
      const existingCatalogItems = await catalogCollection.countDocuments()
      
      if (existingCatalogItems === 0) {
        const catalogItemsToInsert = defaultCatalogItems.map(item => ({
          ...item,
          createdAt: new Date(),
          updatedAt: new Date(),
        }))
        await catalogCollection.insertMany(catalogItemsToInsert)
        console.log('✅ Default catalog items inserted')
        
        // Create indexes for catalog items
        try {
          await catalogCollection.createIndex({ id: 1 }, { unique: true })
          await catalogCollection.createIndex({ slug: 1 }, { unique: true })
          await catalogCollection.createIndex({ isActive: 1 })
          console.log('✅ Catalog indexes created')
        } catch (indexError) {
          console.warn('⚠️ Catalog indexes may already exist:', indexError.message)
        }
      }

      // Initialize settings
      const settingsCollection = await getCollection('settings')
      if (!settingsCollection) return
      
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
      // Don't throw error to prevent app from crashing
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