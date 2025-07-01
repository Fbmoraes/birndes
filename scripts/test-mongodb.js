// Script para testar conexão MongoDB
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

async function testMongoDB() {
  console.log('🔍 Testando conexão MongoDB...\n')
  
  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    console.error('❌ MONGODB_URI não encontrada no .env.local')
    console.log('📝 Adicione a variável MONGODB_URI no arquivo .env.local')
    console.log('Exemplo: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/printsbrindes')
    return
  }
  
  console.log('🔗 URI encontrada:', uri.replace(/\/\/.*@/, '//***:***@'))
  
  let client
  try {
    console.log('⏳ Conectando ao MongoDB...')
    client = new MongoClient(uri)
    await client.connect()
    
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Testar ping
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Ping bem-sucedido!')
    
    // Testar database
    const db = client.db('printsbrindes')
    console.log('✅ Database "printsbrindes" acessível!')
    
    // Listar collections
    const collections = await db.listCollections().toArray()
    console.log('📋 Collections existentes:', collections.map(c => c.name))
    
    // Testar inserção
    const testCollection = db.collection('test')
    const testDoc = { test: true, timestamp: new Date() }
    await testCollection.insertOne(testDoc)
    console.log('✅ Teste de inserção bem-sucedido!')
    
    // Testar leitura
    const found = await testCollection.findOne({ test: true })
    console.log('✅ Teste de leitura bem-sucedido!')
    
    // Limpar teste
    await testCollection.deleteOne({ test: true })
    console.log('✅ Teste de remoção bem-sucedido!')
    
    // Verificar produtos existentes
    const productsCollection = db.collection('products')
    const productCount = await productsCollection.countDocuments()
    console.log(`📦 Produtos no banco: ${productCount}`)
    
    if (productCount > 0) {
      const products = await productsCollection.find({}).limit(3).toArray()
      console.log('📋 Primeiros produtos:')
      products.forEach(p => console.log(`  - ${p.name} (R$ ${p.price})`))
    }
    
    console.log('\n🎉 Todos os testes passaram! MongoDB está funcionando perfeitamente.')
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    
    if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Possíveis soluções:')
      console.log('1. Verifique se o usuário e senha estão corretos')
      console.log('2. Confirme se o usuário tem permissões de leitura/escrita')
      console.log('3. Verifique se o cluster está ativo')
    }
    
    if (error.message.includes('connection')) {
      console.log('\n🔧 Possíveis soluções:')
      console.log('1. Verifique sua conexão com a internet')
      console.log('2. Confirme se o IP está liberado no MongoDB Atlas')
      console.log('3. Verifique se a string de conexão está correta')
    }
    
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Conexão fechada.')
    }
  }
}

// Executar teste
testMongoDB().catch(console.error)