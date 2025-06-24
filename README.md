# PrintsBrindes Website

Um site completo para loja de presentes e artigos personalizados, desenvolvido com Next.js e otimizado para Firebase Hosting.

## 🚀 Deploy no Firebase

### Pré-requisitos
- Node.js 18+ instalado
- Firebase CLI instalado globalmente: `npm install -g firebase-tools`
- Conta no Firebase

### Passos para Deploy

1. **Clone e instale dependências:**
\`\`\`bash
git clone <repository-url>
cd printsbrindes-website
npm install
\`\`\`

2. **Faça login no Firebase:**
\`\`\`bash
firebase login
\`\`\`

3. **Inicialize o projeto Firebase:**
\`\`\`bash
firebase init hosting
\`\`\`
- Selecione "Use an existing project" ou "Create a new project"
- Escolha `out` como public directory
- Configure como Single Page App (SPA): Yes
- Não sobrescreva o index.html: No

4. **Build e deploy:**
\`\`\`bash
npm run build
firebase deploy
\`\`\`

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build otimizado para produção
- `npm start` - Executa build de produção localmente
- `npm run lint` - Executa linting do código

## 🏗️ Arquitetura

### Tecnologias Utilizadas
- **Next.js 14** - Framework React com SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Zustand** - Gerenciamento de estado
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

### Estrutura do Projeto
\`\`\`
├── app/                    # App Router do Next.js
│   ├── page.tsx           # Página inicial
│   ├── produtos/          # Página de produtos
│   ├── produto/[slug]/    # Páginas dinâmicas de produtos
│   ├── sobre-nos/         # Página sobre nós
│   ├── contato/           # Página de contato
│   ├── localizacao/       # Página de localização
│   ├── carrinho/          # Página do carrinho
│   ├── categoria/[slug]/  # Páginas de categorias
│   ├── area-administrativa/ # Login admin
│   └── painel-administrativo/ # Painel admin
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e store
└── public/               # Arquivos estáticos
\`\`\`

## 🎯 Funcionalidades

### Para Usuários
- **Catálogo de produtos** com imagens e descrições
- **Personalização de produtos** (texto e tema)
- **Carrinho de compras** com persistência
- **Finalização via WhatsApp**
- **Páginas de produto individuais** com galeria
- **Design responsivo** para mobile e desktop

### Para Administradores
- **Painel administrativo** completo
- **Gerenciamento de produtos** (CRUD)
- **Upload de imagens** com preview
- **Gerenciamento do catálogo** da página inicial
- **Configurações do site** (contatos, redes sociais)
- **Autenticação segura**

## 🔧 Configuração

### Variáveis de Ambiente
O projeto não requer variáveis de ambiente externas. Todas as configurações são gerenciadas através do painel administrativo.

### Credenciais de Admin
- **Usuário:** admin
- **Senha:** printsbrindes2024

### Personalização
1. **Logo:** Substitua `/public/logo.png` e `/public/logo-simple.png`
2. **Favicon:** Substitua `/public/favicon.ico`
3. **Cores:** Modifique as classes Tailwind no código
4. **Conteúdo:** Use o painel administrativo para gerenciar produtos e configurações

## 📱 Recursos Mobile

- Design totalmente responsivo
- Navegação otimizada para touch
- Imagens otimizadas para diferentes tamanhos de tela
- Performance otimizada para conexões lentas

## 🔒 Segurança

- Autenticação local para área administrativa
- Validação de dados no frontend
- Sanitização de inputs
- Proteção contra XSS

## 📈 Performance

- **Static Site Generation (SSG)** para máxima performance
- **Imagens otimizadas** com Next.js Image
- **Code splitting** automático
- **Caching** otimizado para Firebase Hosting
- **Bundle size** otimizado

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de build:**
   - Verifique se todas as dependências estão instaladas
   - Execute `npm run lint` para verificar erros de código

2. **Problemas de deploy:**
   - Verifique se está logado no Firebase: `firebase login`
   - Confirme se o projeto Firebase está configurado corretamente

3. **Imagens não carregam:**
   - Verifique se as imagens estão na pasta `/public/`
   - Confirme se os caminhos estão corretos

### Logs e Debug
- Use `firebase serve` para testar localmente antes do deploy
- Verifique os logs do Firebase Console para erros de produção

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através dos canais disponíveis no site.

---

**PrintsBrindes** - Transformando ideias em produtos únicos! ❤️
# Website
# Website
