# 🚀 Guia de Deploy - Studio Marli PWA

## ✅ Build Concluído com Sucesso

O projeto foi compilado com sucesso e está pronto para deploy!

**Estatísticas do Build:**
- Bundle principal: 461.07 kB (142.52 kB gzipped)
- CSS: 20.71 kB (4.48 kB gzipped)
- PWA configurado com Service Worker
- 6 arquivos em cache (472.08 KiB)

---

## 📋 Pré-requisitos

1. **Conta GitHub** - Para hospedar o código
2. **Conta Vercel** - Para deploy e hospedagem
3. **Git configurado** - Para versionamento
4. **Variáveis de Ambiente** configuradas (veja `.env.example`)

---

## 🔧 Environment Variables Setup

Antes de fazer o deploy, configure as variáveis de ambiente:

### Local Development
```bash
# 1. Copie o arquivo de exemplo
cp .env.example .env.local

# 2. Edite .env.local com seus valores reais
# - TURSO_DATABASE_URL: URL do seu banco Turso
# - TURSO_AUTH_TOKEN: Token de autenticação do Turso
# - VITE_APP_URL: URL da sua aplicação
```

### Vercel Environment Variables
No painel da Vercel, configure:
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `VITE_APP_NAME`
- `VITE_APP_VERSION`
- `VITE_APP_URL`
- `NODE_ENV=production`

---

## 🔧 Passo 1: Configurar Git e GitHub

### 1.1 Inicializar repositório Git (se ainda não foi feito)
```bash
git init
git add .
git commit -m "feat: initial commit - Studio Marli PWA"
```

### 1.2 Criar repositório no GitHub
1. Acesse [GitHub](https://github.com)
2. Clique em "New repository"
3. Nome: `studio-marli-pwa`
4. Descrição: `PWA para gerenciamento de salão de beleza`
5. Deixe como **público** (para deploy gratuito)
6. **NÃO** inicialize com README (já temos arquivos)

### 1.3 Conectar repositório local ao GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/studio-marli-pwa.git
git branch -M main
git push -u origin main
```

---

## 🌐 Passo 2: Deploy na Vercel

### 2.1 Conectar GitHub à Vercel
1. Acesse [Vercel](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `studio-marli-pwa`

### 2.2 Configurar o projeto
- **Framework Preset:** Vite
- **Root Directory:** `./` (raiz)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2.3 Variáveis de Ambiente
Adicione as seguintes variáveis no painel da Vercel:

```env
# Database (Turso)
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-auth-token

# App Settings
VITE_APP_NAME=Studio Marli
VITE_APP_VERSION=1.0.0
```

---

## 🗄️ Passo 3: Configurar Banco de Dados Turso

### 3.1 Criar conta Turso
1. Acesse [Turso](https://turso.tech)
2. Faça cadastro/login
3. Instale a CLI: `npm install -g @libsql/client`

### 3.2 Criar banco de dados
```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Fazer login
turso auth login

# Criar banco
turso db create studio-marli

# Obter URL de conexão
turso db show studio-marli

# Criar token de autenticação
turso db tokens create studio-marli
```

### 3.3 Executar migrações
```bash
# Aplicar schema no banco
npm run db:migrate
```

---

## ⚙️ Passo 4: Configurações Finais

### 4.1 Arquivo vercel.json (já configurado)
O projeto já possui configuração para:
- Roteamento SPA
- Headers de segurança
- Cache otimizado
- Suporte a PWA

### 4.2 Testar PWA
Após o deploy:
1. Acesse a URL da Vercel no mobile
2. Teste a instalação do PWA
3. Verifique funcionamento offline
4. Teste todas as funcionalidades

---

## 🧪 Passo 5: Testes Pós-Deploy

### 5.1 Checklist de Testes
- [ ] App carrega corretamente
- [ ] Navegação entre telas funciona
- [ ] PWA pode ser instalado
- [ ] Funciona offline (cache)
- [ ] Formulários validam corretamente
- [ ] Design responsivo no mobile
- [ ] Performance adequada

### 5.2 Ferramentas de Teste
- **Lighthouse** - Performance e PWA
- **Chrome DevTools** - Debug e network
- **Vercel Analytics** - Métricas de uso

---

## 🔄 Passo 6: Workflow de Desenvolvimento

### 6.1 Para futuras atualizações
```bash
# Fazer alterações no código
git add .
git commit -m "feat: nova funcionalidade"
git push origin main
```

### 6.2 Deploy automático
A Vercel fará deploy automático a cada push na branch `main`.

---

## 📱 URLs Importantes

- **Repositório:** `https://github.com/SEU_USUARIO/studio-marli-pwa`
- **App Vercel:** `https://studio-marli-pwa.vercel.app`
- **Dashboard Vercel:** `https://vercel.com/dashboard`
- **Turso Dashboard:** `https://app.turso.tech`

---

## 🆘 Troubleshooting

### Problemas Comuns

**Build falha na Vercel:**
- Verificar se todas as dependências estão no `package.json`
- Conferir se não há erros de TypeScript
- Validar variáveis de ambiente

**PWA não instala:**
- Verificar se está sendo acessado via HTTPS
- Conferir se o manifest está correto
- Testar em diferentes navegadores

**Banco não conecta:**
- Verificar URL e token do Turso
- Confirmar se as migrações foram aplicadas
- Testar conexão local primeiro

---

## 📞 Próximos Passos

1. **Domínio personalizado** - Configurar domínio próprio na Vercel
2. **Analytics** - Implementar Google Analytics ou Vercel Analytics
3. **Monitoramento** - Configurar alertas de erro (Sentry)
4. **Backup** - Configurar backup automático do banco
5. **CI/CD** - Implementar testes automatizados

---

**🎉 Parabéns! Seu PWA Studio Marli está pronto para produção!**