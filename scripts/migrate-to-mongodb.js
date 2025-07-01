// Script para migrar dados existentes para MongoDB
const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente do .env.local
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        process.env[key.trim()] = value
      }
    })
  } catch (error) {
    console.warn('Não foi possível carregar .env.local:', error.message)
  }
}

loadEnvLocal()

// Dados padrão que serão migrados
const defaultData = {
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  catalogItems: [
    {
      id: 1,
      title: "Relógios Personalizados",
      description: "Relógios digitais personalizados com nome, letra ou frase especial. Perfeitos para lembrancinhas de festas, presentes criativos...",
      backgroundColor: "bg-pink-200",
      textColor: "text-pink-700",
      buttonColor: "border-pink-500 text-pink-500 hover:bg-pink-50",
      productIds: [1],
      slug: "relogios",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Bolos Personalizados",
      description: "Celebre momentos especiais com bolos deliciosos e personalizados com o tema da sua festa. Um toque doce e único!",
      backgroundColor: "bg-yellow-200",
      textColor: "text-yellow-700",
      buttonColor: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
      productIds: [3],
      slug: "bolos",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "Cadernos de Colorir Personalizados",
      description: "Cadernos de colorir personalizados com nome e tema à sua escolha. Ideais para festas, lembrancinhas e para estimular a...",
      backgroundColor: "bg-purple-200",
      textColor: "text-purple-700",
      buttonColor: "border-purple-500 text-purple-500 hover:bg-purple-50",
      productIds: [2],
      slug: "cadernos",
      image: "/placeholder.svg?height=200&width=300",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  settings: {
    whatsappNumber: "(21) 99930-0409",
    email: "contato@printsbrindes.com",
    socialMedia: {
      facebook: "https://facebook.com/printsbrindes",
      instagram: "https://instagram.com/printsbrindes",
      whatsapp: "https://wa.me/5521999300409",
    },
    seo: {
      title: "PrintsBrindes - Presentes e Artigos Personalizados",
      description: "Presentes e artigos para festas personalizados! Canecas, cadernos, bolos e muito mais, tudo personalizado do seu jeito!",
      keywords: "presentes personalizados, brindes, festas, canecas, cadernos, bolos",
      googleAnalyticsId: "G-PS2KYDM9N0",
      googleSearchConsoleId: "",
      facebookPixelId: "",
    },
    analytics: {
      googleAnalytics: "G-PS2KYDM9N0",
      searchConsole: "",
      facebookPixel: "",
    },
    updatedAt: new Date(),
  }
}

async function migrateToMongoDB() {
  console.log('🚀 Iniciando migração para MongoDB...\n')
  
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    console.error('❌ MONGODB_URI não encontrada no .env.local')
    console.log('📝 Configure o MongoDB primeiro seguindo o guia CONFIGURACAO_MONGODB.md')
    return
  }
  
  let client
  try {
    console.log('⏳ Conectando ao MongoDB...')
    client = new MongoClient(uri)
    await client.connect()
    console.log('✅ Conectado ao MongoDB!')
    
    const db = client.db('printsbrindes')
    
    // Migrar produtos
    console.log('\n📦 Migrando produtos...')
    const productsCollection = db.collection('products')
    
    // Verificar se já existem produtos
    const existingProducts = await productsCollection.countDocuments()
    if (existingProducts > 0) {
      console.log(`⚠️  Já existem ${existingProducts} produtos no banco.`)
      console.log('🔄 Removendo produtos existentes para migração limpa...')
      await productsCollection.deleteMany({})
    }
    
    // Inserir produtos
    const productResult = await productsCollection.insertMany(defaultData.products)
    console.log(`✅ ${productResult.insertedCount} produtos migrados!`)
    
    // Migrar itens do catálogo
    console.log('\n📋 Migrando itens do catálogo...')
    const catalogCollection = db.collection('catalogItems')
    
    const existingCatalog = await catalogCollection.countDocuments()
    if (existingCatalog > 0) {
      console.log(`⚠️  Já existem ${existingCatalog} itens do catálogo no banco.`)
      console.log('🔄 Removendo itens existentes para migração limpa...')
      await catalogCollection.deleteMany({})
    }
    
    const catalogResult = await catalogCollection.insertMany(defaultData.catalogItems)
    console.log(`✅ ${catalogResult.insertedCount} itens do catálogo migrados!`)
    
    // Migrar configurações
    console.log('\n⚙️  Migrando configurações...')
    const settingsCollection = db.collection('settings')
    
    // Usar upsert para configurações (substituir se existir)
    await settingsCollection.replaceOne(
      {},
      defaultData.settings,
      { upsert: true }
    )
    console.log('✅ Configurações migradas!')
    
    // Criar índices para performance
    console.log('\n🔍 Criando índices...')
    await productsCollection.createIndex({ id: 1 }, { unique: true })
    await productsCollection.createIndex({ slug: 1 }, { unique: true })
    await productsCollection.createIndex({ isActive: 1 })
    await catalogCollection.createIndex({ id: 1 }, { unique: true })
    await catalogCollection.createIndex({ slug: 1 }, { unique: true })
    console.log('✅ Índices criados!')
    
    // Verificar migração
    console.log('\n🔍 Verificando migração...')
    const finalProductCount = await productsCollection.countDocuments()
    const finalCatalogCount = await catalogCollection.countDocuments()
    const settingsCount = await settingsCollection.countDocuments()
    
    console.log(`📦 Produtos no banco: ${finalProductCount}`)
    console.log(`📋 Itens do catálogo: ${finalCatalogCount}`)
    console.log(`⚙️  Configurações: ${settingsCount}`)
    
    // Mostrar alguns produtos
    console.log('\n📋 Produtos migrados:')
    const products = await productsCollection.find({}).toArray()
    products.forEach(p => {
      console.log(`  - ${p.name} (R$ ${p.price}) - ${p.slug}`)
    })
    
    console.log('\n🎉 Migração concluída com sucesso!')
    console.log('✅ Todos os dados foram transferidos para o MongoDB')
    console.log('✅ O sistema agora usará o MongoDB como fonte principal')
    console.log('✅ Os dados serão persistidos entre deploys')
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message)
    
    if (error.code === 11000) {
      console.log('\n🔧 Erro de duplicação detectado.')
      console.log('Isso pode acontecer se você executar a migração múltiplas vezes.')
      console.log('Os dados já estão no banco e funcionando corretamente.')
    }
    
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 Conexão fechada.')
    }
  }
}

// Executar migração
migrateToMongoDB().catch(console.error)