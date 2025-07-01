# Configuração MongoDB para Persistência de Dados

## 🎯 Objetivo
Configurar um banco de dados MongoDB na nuvem para garantir que os produtos não sejam perdidos a cada deploy e tenham persistência completa.

## 📋 Opções de Banco de Dados

### 1. MongoDB Atlas (Recomendado - Gratuito)
**Vantagens:**
- ✅ Gratuito até 512MB
- ✅ Hospedado na nuvem
- ✅ Backup automático
- ✅ Fácil configuração
- ✅ Não perde dados no deploy

### 2. Railway MongoDB
**Vantagens:**
- ✅ Fácil integração
- ✅ $5/mês
- ✅ Boa performance

### 3. PlanetScale (MySQL alternativo)
**Vantagens:**
- ✅ Gratuito
- ✅ Serverless
- ✅ Boa para aplicações Next.js

## 🚀 Configuração MongoDB Atlas (Recomendado)

### Passo 1: Criar Conta
1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Clique em "Try Free"
3. Crie sua conta gratuita

### Passo 2: Criar Cluster
1. Escolha "M0 Sandbox" (gratuito)
2. Selecione uma região próxima (ex: São Paulo)
3. Nomeie seu cluster como "printsbrindes"

### Passo 3: Configurar Acesso
1. **Database Access:**
   - Clique em "Database Access"
   - Clique em "Add New Database User"
   - Username: `printsbrindes`
   - Password: Gere uma senha segura
   - Database User Privileges: "Read and write to any database"

2. **Network Access:**
   - Clique em "Network Access"
   - Clique em "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)

### Passo 4: Obter String de Conexão
1. Clique em "Connect" no seu cluster
2. Escolha "Connect your application"
3. Selecione "Node.js" e versão "4.1 or later"
4. Copie a string de conexão

Exemplo:
```
mongodb+srv://printsbrindes:<password>@printsbrindes.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Passo 5: Configurar no Projeto

Atualize o arquivo `.env.local`:
```env
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://printsbrindes:SUA_SENHA_AQUI@printsbrindes.xxxxx.mongodb.net/printsbrindes?retryWrites=true&w=majority

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🔧 Configuração para Produção (Vercel)

### No Vercel Dashboard:
1. Acesse seu projeto no Vercel
2. Vá em "Settings" > "Environment Variables"
3. Adicione as variáveis:

```
MONGODB_URI = mongodb+srv://printsbrindes:SUA_SENHA@printsbrindes.xxxxx.mongodb.net/printsbrindes?retryWrites=true&w=majority
ADMIN_USERNAME = admin
ADMIN_PASSWORD = sua_senha_segura_aqui
NEXT_PUBLIC_SITE_URL = https://printsbrindes.com.br
```

## 🧪 Testando a Conexão

Execute este comando para testar:
```bash
npm run dev
```

Verifique no console se aparece:
```
✅ MongoDB connection successful
✅ Database initialization completed
✅ Default products inserted
```

## 📊 Estrutura do Banco de Dados

### Collections Criadas:
- **products** - Produtos do site
- **catalogItems** - Itens do catálogo
- **settings** - Configurações do site
- **analytics** - Dados de analytics (opcional)
- **seoData** - Dados de SEO (opcional)

### Exemplo de Produto:
```json
{
  "_id": "ObjectId",
  "id": 1,
  "name": "Relógio Personalizado",
  "description": "Relógios personalizados para festas...",
  "price": 9.9,
  "category": "relógios",
  "images": ["/placeholder.svg"],
  "mainImage": "/placeholder.svg",
  "showOnHome": true,
  "slug": "relogio-personalizado",
  "personalization": "Nome, idade e tema personalizados",
  "productionTime": "3-5 dias úteis",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Sistema de Fallback

O sistema atual já tem fallback configurado:
- **MongoDB disponível**: Usa MongoDB Atlas
- **MongoDB indisponível**: Usa dados locais temporários

## ✅ Vantagens da Configuração

1. **Persistência Total**: Dados nunca são perdidos
2. **Backup Automático**: MongoDB Atlas faz backup automático
3. **Escalabilidade**: Pode crescer conforme necessário
4. **Performance**: Otimizado para aplicações web
5. **Segurança**: Conexão criptografada
6. **Monitoramento**: Dashboard completo no Atlas

## 🚨 Importante para Deploy

### Variáveis de Ambiente Necessárias:
```env
MONGODB_URI=sua_string_de_conexao_aqui
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha_segura
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

### Checklist de Deploy:
- [ ] MongoDB Atlas configurado
- [ ] String de conexão copiada
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] IP liberado para acesso (0.0.0.0/0)
- [ ] Usuário do banco criado
- [ ] Teste de conexão realizado

## 🔧 Comandos Úteis

### Testar conexão local:
```bash
npm run dev
```

### Fazer deploy:
```bash
vercel --prod
```

### Ver logs do Vercel:
```bash
vercel logs
```

## 📞 Suporte

Se tiver problemas:
1. Verifique se a string de conexão está correta
2. Confirme se o IP está liberado
3. Teste a conexão localmente primeiro
4. Verifique os logs do Vercel

Com essa configuração, seus produtos serão persistidos permanentemente e nunca serão perdidos em deploys! 🎉