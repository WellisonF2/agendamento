# 🚀 Instruções de Deploy - Studio Marli PWA

## ✅ Status Atual
- ✅ Projeto buildado com sucesso
- ✅ Arquivo .env.local criado
- ✅ Git inicializado e commit feito
- ⏳ Aguardando criação do repositório GitHub
- ⏳ Aguardando deploy na Vercel

---

## 📋 Passo 1: Criar Repositório no GitHub

### 1.1 Acesse o GitHub
```
https://github.com/new
```

### 1.2 Configurações do Repositório
- **Nome**: `studio-marli-pwa`
- **Descrição**: `Studio Marli - PWA para agendamento de serviços de beleza. React + TypeScript + TailwindCSS + Turso`
- **Visibilidade**: Público
- **⚠️ IMPORTANTE**: NÃO marque "Add a README file"
- **⚠️ IMPORTANTE**: NÃO adicione .gitignore ou license

### 1.3 Clique em "Create repository"

---

## 📋 Passo 2: Conectar e Fazer Push

### 2.1 Adicionar Remote (substitua SEU_USUARIO)
```bash
git remote add origin https://github.com/SEU_USUARIO/studio-marli-pwa.git
```

### 2.2 Configurar Branch Principal
```bash
git branch -M main
```

### 2.3 Fazer Push
```bash
git push -u origin main
```

---

## 📋 Passo 3: Deploy na Vercel

### 3.1 Acesse a Vercel
```
https://vercel.com/new
```

### 3.2 Importar Repositório
1. Clique em "Import Git Repository"
2. Selecione o repositório `studio-marli-pwa`
3. Clique em "Import"

### 3.3 Configurações do Projeto
- **Project Name**: `studio-marli-pwa`
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (padrão)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `dist` (padrão)
- **Install Command**: `npm install` (padrão)

### 3.4 Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

```
TURSO_DATABASE_URL=libsql://teste-wellisonf2.aws-us-west-2.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NTcyODc1OTAsImlkIjoiYjk1YzI2ZWEtZTE4Yy00ZTBhLTkyNjQtNzk1ZGQ5YzNkNmMwIiwicmlkIjoiMmI2MzExYjQtMmI0Ny00NzYyLWIwN2ItYTUzYTZjZDI5NjU1In0.g5F61f_u6vZn1srgGKltFILxmQhdnzG48TqDZpZciYIwoM9zhhhLa5nQckaY-Y9qW9SUZlOF6rJ-Ah2LCBDXCw
VITE_APP_NAME=Studio Marli
VITE_APP_VERSION=1.0.0
NODE_ENV=production
```

**⚠️ IMPORTANTE**: A `VITE_APP_URL` será configurada automaticamente pela Vercel

### 3.5 Deploy
1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. ✅ Deploy concluído!

---

## 📋 Passo 4: Configurações Pós-Deploy

### 4.1 Atualizar VITE_APP_URL
1. Após o deploy, copie a URL da Vercel (ex: `https://studio-marli-pwa.vercel.app`)
2. Vá em "Settings" > "Environment Variables"
3. Adicione: `VITE_APP_URL=https://sua-url.vercel.app`
4. Faça um redeploy

### 4.2 Configurar Domínio Personalizado (Opcional)
1. Vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

---

## 🧪 Testes Pós-Deploy

### ✅ Checklist de Testes
- [ ] Site carrega corretamente
- [ ] PWA pode ser instalada
- [ ] Navegação entre telas funciona
- [ ] Formulários validam corretamente
- [ ] API endpoints respondem
- [ ] Database conecta (teste criar agendamento)
- [ ] Responsividade mobile
- [ ] Service Worker ativo
- [ ] Manifest.json válido

### 🔧 URLs Importantes
- **Site**: `https://sua-url.vercel.app`
- **Manifest**: `https://sua-url.vercel.app/manifest.webmanifest`
- **Service Worker**: `https://sua-url.vercel.app/sw.js`
- **API Test**: `https://sua-url.vercel.app/api/agenda`

---

## 🚨 Troubleshooting

### Build Errors
- Verifique se todas as dependências estão no package.json
- Confirme que não há erros TypeScript
- Teste `npm run build` localmente

### Database Errors
- Verifique se TURSO_DATABASE_URL está correto
- Confirme se TURSO_AUTH_TOKEN é válido
- Teste conexão local primeiro

### PWA Issues
- Verifique se manifest.webmanifest é acessível
- Confirme se service worker está registrado
- Teste em HTTPS (Vercel fornece automaticamente)

---

## 🎉 Próximos Passos

1. **Monitoramento**: Configure Vercel Analytics
2. **Performance**: Otimize imagens e assets
3. **SEO**: Adicione meta tags e sitemap
4. **Backup**: Configure backup automático do Turso
5. **CI/CD**: Configure GitHub Actions para testes

---

**🚀 Projeto pronto para produção!**