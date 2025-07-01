import { MongoClient, Db, Collection } from 'mongodb'

// Check if MongoDB URI is available
const uri = process.env.MONGODB_URI

if (!uri) {
  console.warn('⚠️ MONGODB_URI not found, MongoDB features will be disabled')
}

const options = {}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

// Only initialize MongoDB if URI is available
if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

// Database helper functions
export async function getDatabase(): Promise<Db | null> {
  if (!clientPromise) {
    console.warn('MongoDB not available')
    return null
  }
  try {
    const client = await clientPromise
    return client.db('printsbrindes')
  } catch (error) {
    console.error('Failed to get database:', error)
    return null
  }
}

export async function getCollection(name: string): Promise<Collection | null> {
  const db = await getDatabase()
  if (!db) return null
  return db.collection(name)
}

// Connection test function
export async function testConnection(): Promise<boolean> {
  if (!clientPromise) {
    console.warn('MongoDB not configured')
    return false
  }
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    console.log('✅ MongoDB connection successful')
    return true
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    return false
  }
}

// Check if MongoDB is available
export function isMongoDBAvailable(): boolean {
  return !!uri && !!clientPromise
}