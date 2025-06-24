# 🚀 Guia Completo de Deploy no Vercel com Domínio Personalizado e SEO

## 📋 Pré-requisitos
- Conta no Vercel (vercel.com)
- Domínio próprio registrado
- Conta no Google (para Analytics e Search Console)

## 🔧 1. Deploy no Vercel

### Passo 1: Conectar Repositório
1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Conecte seu repositório GitHub/GitLab
4. Selecione o repositório do PrintsBrindes

### Passo 2: Configurar Deploy
1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `out`
4. **Install Command**: `npm install`

### Passo 3: Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Seu site estará disponível em: `https://seu-projeto.vercel.app`

## 🌐 2. Configurar Domínio Personalizado

### Passo 1: Adicionar Domínio no Vercel
1. No dashboard do projeto, vá em "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio: `printsbrindes.com.br`
4. Clique em "Add"

### Passo 2: Configurar DNS
No seu provedor de domínio (Registro.br, GoDaddy, etc.), adicione os registros:

**Para domínio raiz (printsbrindes.com.br):**
\`\`\`
Tipo: A
Nome: @
Valor: 76.76.19.61
\`\`\`

**Para subdomínio www:**
\`\`\`
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
\`\`\`

### Passo 3: Verificar Configuração
1. Aguarde propagação DNS (até 48h)
2. No Vercel, clique em "Refresh" ao lado do domínio
3. Status deve aparecer como "Valid Configuration"

## 🔍 3. Configurar Google Analytics

### Passo 1: Criar Conta Google Analytics
1. Acesse [analytics.google.com](https://analytics.google.com)
2. Clique em "Começar"
3. Configure sua conta e propriedade
4. Copie o ID de medição (GA_MEASUREMENT_ID)

### Passo 2: Configurar no Site
1. Acesse o Painel Administrativo → SEO → Configurações
2. Cole o ID do Google Analytics
3. Salve as configurações

### Passo 3: Verificar Funcionamento
1. Acesse seu site
2. No Google Analytics, vá em "Relatórios" → "Tempo real"
3. Deve aparecer sua visita

## 🔎 4. Configurar Google Search Console

### Passo 1: Adicionar Propriedade
1. Acesse [search.google.com/search-console](https://search.google.com/search-console)
2. Clique em "Adicionar propriedade"
3. Escolha "Prefixo do URL"
4. Digite: `https://printsbrindes.com.br`

### Passo 2: Verificar Propriedade
**Método 1 - Meta Tag:**
1. Copie a meta tag fornecida
2. No painel SEO, cole no campo "Google Search Console"
3. Salve e faça deploy

**Método 2 - Arquivo HTML:**
1. Baixe o arquivo de verificação
2. Coloque na pasta `public/`
3. Faça deploy

### Passo 3: Enviar Sitemap
1. Após verificação, vá em "Sitemaps"
2. Adicione: `https://printsbrindes.com.br/sitemap.xml`
3. Clique em "Enviar"

## 📊 5. Configurar Facebook Pixel (Opcional)

### Passo 1: Criar Pixel
1. Acesse [business.facebook.com](https://business.facebook.com)
2. Vá em "Gerenciador de Eventos"
3. Clique em "Conectar fonte de dados" → "Web"
4. Copie o ID do Pixel

### Passo 2: Configurar no Site
1. No painel SEO, cole o Facebook Pixel ID
2. Salve as configurações

## 🎯 6. Otimização SEO

### Palavras-chave Principais
- presentes personalizados
- brindes personalizados
- lembrancinhas de festa
- canecas personalizadas
- bolos personalizados
- guaratiba rio de janeiro

### Conteúdo para Blog (Sugestão)
1. "Como escolher o presente personalizado perfeito"
2. "Ideias criativas para lembrancinhas de festa infantil"
3. "Tendências em personalização para 2024"
4. "Guia completo para organizar festas temáticas"

### Otimizações Técnicas
- ✅ Sitemap.xml configurado
- ✅ Robots.txt otimizado
- ✅ Meta tags completas
- ✅ Structured data (Schema.org)
- ✅ Imagens otimizadas
- ✅ Performance otimizada

## 📈 7. Monitoramento e Métricas

### KPIs Importantes
- **Tráfego orgânico**: Visitantes vindos do Google
- **Taxa de conversão**: Visitantes que fazem pedidos
- **Palavras-chave**: Posicionamento no Google
- **Tempo na página**: Engajamento dos usuários
- **Taxa de rejeição**: Qualidade do tráfego

### Ferramentas Recomendadas
1. **Google Analytics**: Tráfego e comportamento
2. **Google Search Console**: Performance de busca
3. **PageSpeed Insights**: Performance do site
4. **GTmetrix**: Análise de velocidade
5. **Ubersuggest**: Pesquisa de palavras-chave

## 🛠️ 8. Comandos Úteis

### Deploy Manual
\`\`\`bash
# Build local
npm run build

# Deploy via CLI
npx vercel --prod
\`\`\`

### Verificar SEO
\`\`\`bash
# Testar sitemap
curl https://printsbrindes.com.br/sitemap.xml

# Testar robots.txt
curl https://printsbrindes.com.br/robots.txt
\`\`\`

## 🚨 9. Troubleshooting

### Problemas Comuns

**Domínio não funciona:**
- Verifique configuração DNS
- Aguarde propagação (até 48h)
- Teste com: `nslookup printsbrindes.com.br`

**Google Analytics não funciona:**
- Verifique se o ID está correto
- Teste em modo incógnito
- Aguarde até 24h para dados aparecerem

**Site não aparece no Google:**
- Verifique se o sitemap foi enviado
- Confirme que robots.txt permite indexação
- Use "Solicitar indexação" no Search Console

### Contatos de Suporte
- **Vercel**: support@vercel.com
- **Google**: Fórum de ajuda do Search Console
- **Registro.br**: registro@registro.br

## ✅ 10. Checklist Final

### Antes do Lançamento
- [ ] Site funcionando no domínio personalizado
- [ ] Google Analytics configurado
- [ ] Google Search Console verificado
- [ ] Sitemap enviado
- [ ] Todas as páginas indexáveis
- [ ] Meta tags otimizadas
- [ ] Imagens com alt text
- [ ] Performance > 90 no PageSpeed

### Após o Lançamento
- [ ] Monitorar tráfego diariamente
- [ ] Verificar posicionamento das palavras-chave
- [ ] Analisar comportamento dos usuários
- [ ] Otimizar páginas com alta taxa de rejeição
- [ ] Criar conteúdo regular para blog
- [ ] Monitorar concorrência

---

## 📞 Suporte

Para dúvidas sobre este guia, consulte:
- Documentação do Vercel: [vercel.com/docs](https://vercel.com/docs)
- Guia do Google Search Console: [developers.google.com](https://developers.google.com/search)
- Central de Ajuda do Google Analytics: [support.google.com](https://support.google.com/analytics)

**PrintsBrindes** - Seu sucesso online começa aqui! 🚀
