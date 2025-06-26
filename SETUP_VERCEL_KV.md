# Configuração do Vercel KV para Persistência de Dados

## Problema Resolvido

✅ **Persistência de dados**: Produtos criados agora são salvos permanentemente
✅ **Sincronização entre dispositivos**: Dados acessíveis de qualquer lugar
✅ **Backup automático**: Dados seguros no Vercel KV (Redis)

## Configuração no Vercel

### 1. Criar Banco KV no Vercel

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá para seu projeto PrintsBrindes
3. Clique na aba **"Storage"**
4. Clique em **"Create Database"**
5. Selecione **"KV (Redis)"**
6. Nome: `printsbrindes-db`
7. Clique em **"Create"**

### 2. Conectar ao Projeto

1. Na página do KV criado, clique em **"Connect Project"**
2. Selecione seu projeto PrintsBrindes
3. Clique em **"Connect"**

### 3. Verificar Variáveis de Ambiente

As seguintes variáveis serão criadas automaticamente:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_URL`

### 4. Fazer Redeploy

Após conectar o KV, faça um novo deploy:
```bash
vercel --prod
```

## Como Funciona

### Antes (Problema)
```
Usuário A cria produto → Salvo apenas na memória do servidor
Usuário B acessa → Não vê o produto (memória diferente)
Servidor reinicia → Todos os dados perdidos
```

### Depois (Solução)
```
Usuário A cria produto → Salvo no Vercel KV (Redis)
Usuário B acessa → Vê o produto (mesmo banco de dados)
Servidor reinicia → Dados permanecem no KV
```

## Funcionalidades Implementadas

✅ **Produtos persistem** entre sessões
✅ **Dados sincronizados** entre dispositivos
✅ **Backup automático** no Vercel KV
✅ **Fallback local** para desenvolvimento
✅ **Performance otimizada** com Redis

## Testando a Solução

### 1. Criar Produto
1. Acesse `/painel-administrativo`
2. Faça login (admin / printsbrindes2024)
3. Crie um novo produto
4. Verifique se aparece em `/produtos`

### 2. Testar Persistência
1. Acesse de outro dispositivo/navegador
2. Vá para `/produtos`
3. O produto deve aparecer
4. Reinicie o servidor (novo deploy)
5. Produto deve continuar lá

## Estrutura de Dados no KV

```json
{
  "products": [
    {
      "id": 123,
      "name": "Produto Teste",
      "description": "...",
      "price": 10.0,
      "category": "categoria",
      "images": ["..."],
      "slug": "produto-teste"
    }
  ],
  "catalogItems": [...],
  "settings": {...}
}
```

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Testar localmente (sem KV)
npm run dev

# Build para produção
npm run build

# Deploy com KV
vercel --prod
```

## Troubleshooting

### Se os dados não persistem:

1. **Verificar KV conectado**:
   - Vá para Vercel Dashboard > Projeto > Storage
   - Confirme que o KV está conectado

2. **Verificar variáveis de ambiente**:
   - Vá para Settings > Environment Variables
   - Confirme que `KV_REST_API_URL` e `KV_REST_API_TOKEN` existem

3. **Verificar logs**:
   - Vá para Functions > Logs
   - Procure por mensagens "Data saved to Vercel KV"

4. **Fazer redeploy**:
   ```bash
   vercel --prod
   ```

### Logs esperados:
```
✅ "Data loaded from Vercel KV" - Dados carregados
✅ "Data saved to Vercel KV" - Dados salvos
❌ "Using default data" - KV não configurado
❌ "Failed to write to KV" - Erro de conexão
```

## Status

🟢 **Implementado e pronto para uso!**
- Código atualizado com Vercel KV
- Fallback para desenvolvimento local
- Instruções completas de configuração