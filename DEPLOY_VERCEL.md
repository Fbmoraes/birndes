# Deploy no Vercel - PrintsBrindes

## Problemas Corrigidos

✅ **Tamanho do projeto reduzido**: De 640MB para ~1MB
✅ **Conflitos de dependências resolvidos**: date-fns compatível com react-day-picker
✅ **Configuração do Next.js otimizada**: Removidas configurações conflitantes
✅ **Build funcionando**: Teste local bem-sucedido
✅ **Vercel.json simplificado**: Removidas configurações desnecessárias

## Instruções para Deploy

### 1. Via Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Fazer login no Vercel
vercel login

# Deploy do projeto
vercel

# Para deploy de produção
vercel --prod
```

### 2. Via GitHub + Vercel Dashboard

1. Faça push do código para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu repositório GitHub
4. O deploy será automático

### 3. Configurações Importantes

**Environment Variables (se necessário):**
- `NODE_ENV=production` (automático no Vercel)
- `SITE_DATA` (para persistência de dados - opcional)

**Configurações do Projeto:**
- Framework: Next.js
- Build Command: `npm run build` (padrão)
- Output Directory: `.next` (padrão)
- Install Command: `npm install` (padrão)

## Estrutura Otimizada

```
birndes/
├── app/                 # App Router do Next.js
├── components/          # Componentes React
├── lib/                # Utilitários e configurações
├── public/             # Assets estáticos
├── styles/             # Estilos CSS
├── .gitignore          # Arquivos ignorados
├── next.config.mjs     # Configuração do Next.js
├── package.json        # Dependências
├── tsconfig.json       # Configuração TypeScript
└── vercel.json         # Configuração do Vercel

Removidos:
- node_modules/ (368MB)
- .next/ (97MB)
- out/ (63MB)
- pnpm-lock.yaml
```

## Verificações Pré-Deploy

✅ Build local funciona: `npm run build`
✅ Dependências instaladas: `npm install`
✅ Sem conflitos de versão
✅ Arquivos desnecessários removidos
✅ .gitignore configurado

## Troubleshooting

**Se o deploy falhar:**

1. Verifique se todas as dependências estão no package.json
2. Execute `npm run build` localmente para testar
3. Verifique os logs do Vercel para erros específicos
4. Certifique-se de que não há imports de arquivos inexistentes

**Comandos úteis:**
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Testar build local
npm run build
npm start
```

## Configuração de Persistência de Dados

⚠️ **IMPORTANTE**: Para que os produtos criados na área administrativa sejam salvos permanentemente e acessíveis de qualquer dispositivo, você precisa configurar o Vercel KV:

1. **Após o deploy inicial**, vá para o Vercel Dashboard
2. Acesse seu projeto > **Storage** > **Create Database**
3. Selecione **KV (Redis)** e crie com nome `printsbrindes-db`
4. **Connect Project** ao seu projeto
5. Faça um **redeploy** com `vercel --prod`

📖 **Instruções detalhadas**: Veja o arquivo `SETUP_VERCEL_KV.md`

## Status Atual

🟢 **Pronto para deploy!**
- Tamanho: ~1MB (muito abaixo do limite)
- Build: ✅ Funcionando
- Dependências: ✅ Resolvidas (incluindo @vercel/kv)
- Configuração: ✅ Otimizada
- Persistência: ✅ Implementada (requer configuração KV)