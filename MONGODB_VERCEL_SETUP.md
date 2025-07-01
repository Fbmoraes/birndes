# Configuração do MongoDB Atlas para Vercel

Este guia explica como configurar o MongoDB Atlas para funcionar com seu site no Vercel, garantindo persistência permanente dos dados.

## 1. Criar Conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Clique em "Try Free" e crie sua conta
3. Escolha o plano gratuito (M0 Sandbox) - suficiente para começar

## 2. Criar um Cluster

1. Após fazer login, clique em "Build a Database"
2. Escolha "M0 FREE" (plano gratuito)
3. Selecione uma região próxima (ex: São Paulo - sa-east-1)
4. Dê um nome ao cluster (ex: "printsbrindes-cluster")
5. Clique em "Create"

## 3. Configurar Acesso ao Banco

### 3.1 Criar Usuário do Banco
1. No painel do Atlas, vá em "Database Access"
2. Clique em "Add New Database User"
3. Escolha "Password" como método de autenticação
4. Crie um usuário (ex: "printsbrindes-user")
5. Gere uma senha forte (ANOTE ESTA SENHA!)
6. Em "Database User Privileges", selecione "Read and write to any database"
7. Clique em "Add User"

### 3.2 Configurar IP Whitelist
1. Vá em "Network Access"
2. Clique em "Add IP Address"
3. Clique em "Allow Access from Anywhere" (0.0.0.0/0)
4. Adicione um comentário: "Vercel deployment"
5. Clique em "Confirm"

## 4. Obter String de Conexão

1. Volte para "Database" no menu lateral
2. Clique em "Connect" no seu cluster
3. Escolha "Connect your application"
4. Selecione "Node.js" como driver
5. Copie a string de conexão (será algo como):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 5. Configurar no Vercel

### 5.1 Adicionar Variável de Ambiente
1. Acesse seu projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em "Settings" > "Environment Variables"
3. Adicione uma nova variável:
   - **Name**: `MONGODB_URI`
   - **Value**: Sua string de conexão completa (substitua `<username>` e `<password>` pelos valores reais)
   - **Environment**: Selecione "Production", "Preview" e "Development"

### 5.2 Exemplo da String de Conexão
```
mongodb+srv://printsbrindes-user:SuaSenhaAqui@printsbrindes-cluster.abc123.mongodb.net/printsbrindes?retryWrites=true&w=majority
```

**Importante**: 
- Substitua `printsbrindes-user` pelo seu usuário
- Substitua `SuaSenhaAqui` pela senha que você criou
- Substitua `abc123` pelo ID do seu cluster
- O nome do banco `printsbrindes` será criado automaticamente

## 6. Testar a Conexão

1. Faça o deploy no Vercel
2. Acesse a área administrativa do seu site
3. Tente criar um produto novo
4. Verifique se os dados persistem após recarregar a página

## 7. Monitorar o Banco

1. No MongoDB Atlas, vá em "Database" > "Browse Collections"
2. Você verá as coleções criadas automaticamente:
   - `products` - Produtos do site
   - `catalogItems` - Itens do catálogo
   - `settings` - Configurações do site
   - `analytics` - Dados de analytics
   - `seoData` - Dados de SEO

## 8. Backup e Segurança

### Backup Automático
- O MongoDB Atlas faz backup automático dos seus dados
- No plano gratuito, você tem 2 dias de retenção

### Segurança
- Mantenha sua senha segura
- Monitore o acesso através do painel do Atlas
- Considere criar usuários específicos para diferentes ambientes

## 9. Limites do Plano Gratuito

- **Armazenamento**: 512 MB
- **RAM**: 512 MB compartilhada
- **Conexões**: 500 conexões simultâneas
- **Backup**: 2 dias de retenção

Para um site de brindes, estes limites são mais que suficientes para começar.

## 10. Troubleshooting

### Erro de Conexão
- Verifique se a string de conexão está correta
- Confirme que o IP está liberado (0.0.0.0/0)
- Verifique se o usuário tem as permissões corretas

### Dados não Persistem
- Verifique se a variável `MONGODB_URI` está configurada no Vercel
- Confirme que o deploy foi feito após adicionar a variável
- Verifique os logs do Vercel para erros de conexão

### Performance Lenta
- O plano gratuito tem limitações de performance
- Considere upgrade se necessário
- Monitore o uso através do painel do Atlas

## Conclusão

Com esta configuração, seus dados estarão permanentemente armazenados no MongoDB Atlas e não serão perdidos. O sistema é robusto e escalável, permitindo que seu site cresça conforme necessário.

Para suporte adicional, consulte a [documentação oficial do MongoDB Atlas](https://docs.atlas.mongodb.com/).