# Guia de Instalação do WordPress - Primeira Fase

## Implementação de Blog em Subdiretório (/blog) - Passo a Passo

### 📋 Visão Geral

Este guia detalha o **PRIMEIRO PASSO** para implementar um blog WordPress em um subdiretório `/blog` no site https://www.saraivavision.com.br/, sem afetar o funcionamento do site principal.

### ⚠️ Pré-requisitos

- Acesso ao servidor via cPanel ou SSH/FTP
- PHP 8.0+ instalado no servidor
- MySQL 5.7+ ou MariaDB 10.3+
- Pelo menos 100MB de espaço disponível
- Credenciais de administrador do servidor

---

## 🔐 FASE 1: BACKUP COMPLETO DO SITE

### 1.1 Backup via cPanel

#### Backup Automático Completo
1. **Acesse o cPanel** do seu provedor de hospedagem
2. Localize a seção **"Arquivos"** → **"Backup"** ou **"Backups"**
3. Clique em **"Baixar um Backup Completo da Conta"**
4. Selecione **"Backup Completo"** → **"Gerar Backup"**
5. Aguarde a criação (pode levar 15-30 minutos)
6. **Baixe o arquivo** `.tar.gz` para seu computador

#### Backup Manual dos Arquivos
1. Acesse **"Gerenciador de Arquivos"** no cPanel
2. Navegue até o diretório `public_html`
3. **Selecione todos os arquivos** (Ctrl+A)
4. Clique em **"Compactar"** → **"Tar GZip"**
5. Nome sugerido: `backup_saraivavision_arquivos_DDMMAAAA.tar.gz`
6. Baixe o arquivo compactado

#### Backup do Banco de Dados
1. Acesse **"phpMyAdmin"** no cPanel
2. Selecione o banco de dados do site principal
3. Clique na aba **"Exportar"**
4. Escolha **"Método rápido"** → **"SQL"**
5. Clique em **"Executar"**
6. Salve o arquivo `.sql` com nome: `backup_db_saraivavision_DDMMAAAA.sql`

### 1.2 Backup via SSH/Terminal

```bash
# 1. Conecte-se ao servidor via SSH
ssh usuario@saraivavision.com.br

# 2. Navegue até o diretório do site
cd /home/usuario/public_html

# 3. Criar backup dos arquivos
tar -czf backup_arquivos_$(date +%d%m%Y).tar.gz *

# 4. Backup do banco de dados (substitua os valores)
mysqldump -u USUARIO_DB -p NOME_DATABASE > backup_db_$(date +%d%m%Y).sql

# 5. Baixar os backups para sua máquina local
# Execute no seu computador local:
scp usuario@saraivavision.com.br:/home/usuario/public_html/backup_*.* ./
```

### 1.3 Verificação dos Backups

| Tipo de Backup | Tamanho Esperado | Localização | Verificação |
|----------------|------------------|-------------|-------------|
| Arquivos Completos | 50-500MB | Local/Servidor | Abrir arquivo .tar.gz |
| Banco de Dados | 5-50MB | Local/Servidor | Abrir arquivo .sql |
| Backup Completo cPanel | 100-1GB | Local | Verificar data de criação |

---

## 📁 FASE 2: CRIAÇÃO DO SUBDIRETÓRIO /blog

### 2.1 Via cPanel - Gerenciador de Arquivos

1. **Acesse o cPanel** → **"Gerenciador de Arquivos"**
2. Navegue até `public_html`
3. Clique em **"+ Nova Pasta"**
4. Nome da pasta: `blog` (em minúsculas)
5. **Confirme a criação**
6. **Defina permissões 755** (clique direito → Permissões)

### 2.2 Via SSH/Terminal

```bash
# 1. Conectar ao servidor
ssh usuario@saraivavision.com.br

# 2. Navegar até public_html
cd /home/usuario/public_html

# 3. Criar o diretório blog
mkdir blog

# 4. Definir permissões adequadas
chmod 755 blog

# 5. Verificar a criação
ls -la | grep blog
# Deve mostrar: drwxr-xr-x ... blog
```

### 2.3 Via FTP (FileZilla)

1. **Conecte-se via FTP** usando suas credenciais
2. Navegue até `/public_html/`
3. **Clique direito** no painel direito (servidor)
4. Selecione **"Criar Diretório"**
5. Nome: `blog`
6. **Confirme a criação**

---

## 📥 FASE 3: DOWNLOAD E UPLOAD DO WORDPRESS

### 3.1 Download do WordPress

#### Via Terminal/SSH (Recomendado)
```bash
# 1. Navegar até o diretório blog
cd /home/usuario/public_html/blog

# 2. Baixar WordPress em português
wget https://br.wordpress.org/latest-pt_BR.tar.gz

# 3. Extrair os arquivos
tar -xzf latest-pt_BR.tar.gz

# 4. Mover arquivos para o diretório correto
mv wordpress/* .
mv wordpress/.* . 2>/dev/null || true

# 5. Remover diretório e arquivo temporários
rm -rf wordpress latest-pt_BR.tar.gz

# 6. Definir permissões corretas
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chmod 600 wp-config-sample.php
```

#### Via Download Manual + cPanel
1. **Baixe o WordPress** de: https://br.wordpress.org/download/
2. **Extraia o arquivo** `.zip` no seu computador
3. **Acesse o Gerenciador de Arquivos** no cPanel
4. **Navegue até** `public_html/blog/`
5. **Upload todos os arquivos** da pasta `wordpress/`
6. **Aguarde o upload** (pode levar 10-15 minutos)

#### Via FTP (FileZilla)
1. **Baixe o WordPress** de: https://br.wordpress.org/download/
2. **Extraia o arquivo** no seu computador
3. **Conecte-se via FTP**
4. **Navegue até** `/public_html/blog/`
5. **Selecione todos os arquivos** da pasta `wordpress/`
6. **Arraste para o servidor** (painel direito)
7. **Aguarde a transferência**

### 3.2 Verificação da Instalação dos Arquivos

```bash
# Via SSH - Verificar arquivos principais
cd /home/usuario/public_html/blog
ls -la

# Devem estar presentes:
# - wp-config-sample.php
# - wp-admin/ (diretório)
# - wp-content/ (diretório)
# - wp-includes/ (diretório)
# - index.php
# - .htaccess (pode não existir ainda)
```

**Checklist de Arquivos Essenciais:**
- [ ] `index.php` (página principal)
- [ ] `wp-config-sample.php` (configuração)
- [ ] `wp-admin/` (painel administrativo)
- [ ] `wp-content/` (conteúdo e plugins)
- [ ] `wp-includes/` (núcleo do WordPress)

---

## 🗄️ FASE 4: CRIAÇÃO DO BANCO DE DADOS

### 4.1 Via cPanel - MySQL Databases

1. **Acesse o cPanel** → **"Bancos de Dados MySQL"**
2. **Criar Novo Banco de Dados:**
   - Nome: `saraiva_blog` ou `usuario_blog`
   - Clique em **"Criar Banco de Dados"**
3. **Criar Usuário do Banco:**
   - Nome de usuário: `blog_admin`
   - Senha forte: Use gerador de senhas do cPanel
   - **Anote as credenciais em local seguro**
   - Clique em **"Criar Usuário"**
4. **Associar Usuário ao Banco:**
   - Selecione o usuário criado
   - Selecione o banco criado
   - Marque **"TODOS OS PRIVILÉGIOS"**
   - Clique em **"Fazer Alterações"**

### 4.2 Via SSH/Terminal - MySQL

```bash
# 1. Conectar ao MySQL
mysql -u root -p

# 2. Criar o banco de dados
CREATE DATABASE saraiva_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 3. Criar usuário específico para o blog
CREATE USER 'blog_admin'@'localhost' IDENTIFIED BY 'SENHA_FORTE_AQUI';

# 4. Conceder privilégios
GRANT ALL PRIVILEGES ON saraiva_blog.* TO 'blog_admin'@'localhost';

# 5. Aplicar alterações
FLUSH PRIVILEGES;

# 6. Verificar criação
SHOW DATABASES LIKE 'saraiva_blog';
SELECT User FROM mysql.user WHERE User = 'blog_admin';

# 7. Sair do MySQL
EXIT;
```

### 4.3 Informações do Banco para Anotação

**📝 Anote essas informações (necessárias para wp-config.php):**

| Campo | Valor | Exemplo |
|-------|-------|---------|
| Nome do Banco | `saraiva_blog` | `usuario_blog` |
| Usuário do Banco | `blog_admin` | `usuario_blog_admin` |
| Senha do Banco | `[SENHA_GERADA]` | `Xy9#mK2$pL8@` |
| Host do Banco | `localhost` | `localhost` |
| Prefixo das Tabelas | `wp_` | `wp_` |

---

## 🔒 MEDIDAS DE SEGURANÇA

### 5.1 Ambiente de Staging (ALTAMENTE RECOMENDADO)

#### Criar Subdomínio de Teste
```bash
# 1. Criar subdiretório para staging
mkdir /home/usuario/public_html/staging
cd /home/usuario/public_html/staging

# 2. Copiar site principal para staging
cp -r /home/usuario/public_html/* . 
rm -rf staging  # Remove recursão

# 3. Testar o blog no staging primeiro
mkdir blog
# Repetir processo de instalação no staging
```

#### Via cPanel - Subdomínio
1. **cPanel** → **"Subdomínios"**
2. **Criar subdomínio:** `teste.saraivavision.com.br`
3. **Apontar para:** `/public_html/staging/`
4. **Testar a instalação** em `teste.saraivavision.com.br/blog`

### 5.2 Proteção do wp-admin

#### Via .htaccess (Criar no diretório /blog/)
```apache
# Proteção básica do wp-admin
<Files wp-config.php>
    Require all denied
</Files>

# Limitar tentativas de login
<IfModule mod_evasive.c>
    DOSHashTableSize 4096
    DOSPageCount 3
    DOSPageInterval 1
    DOSSiteCount 50
    DOSSiteInterval 1
    DOSBlockingPeriod 600
</IfModule>

# Bloquear acesso a arquivos sensíveis
<FilesMatch "^.*(error_log|wp-config\.php|php.ini|\.[hH][tT][aApP].*)$">
    Require all denied
</FilesMatch>
```

### 5.3 Plano de Rollback

| Cenário | Ação de Rollback | Comando/Método |
|---------|------------------|----------------|
| Site principal quebrou | Restaurar backup completo | Upload do backup via cPanel |
| Problemas no /blog | Deletar diretório blog | `rm -rf /public_html/blog` |
| Banco corrompido | Restaurar backup do DB | Import via phpMyAdmin |
| Configuração errada | Reverter wp-config.php | Upload do wp-config-sample.php |

---

## ✅ VERIFICAÇÕES E TESTES

### 6.1 Verificação do Site Principal

**Antes de continuar, confirme que o site principal está funcionando:**

1. **Acesse:** https://www.saraivavision.com.br/
2. **Verifique:**
   - [ ] Página carrega normalmente
   - [ ] Navegação funciona
   - [ ] Formulários funcionam
   - [ ] Imagens carregam
   - [ ] Não há erros no console do navegador

### 6.2 Verificação do Subdiretório /blog

#### Via Navegador
1. **Acesse:** https://www.saraivavision.com.br/blog/
2. **Resultado esperado:** Página de instalação do WordPress
3. **Não deve afetar:** O site principal em nenhum aspecto

#### Via Terminal
```bash
# Verificar se o diretório existe e tem os arquivos
cd /home/usuario/public_html/blog
ls -la

# Verificar permissões
ls -la wp-config-sample.php
# Deve mostrar: -rw------- (600)

# Testar conectividade com banco
mysql -h localhost -u blog_admin -p saraiva_blog
# Deve conectar sem erros
```

### 6.3 Verificação de PHP

```bash
# Verificar versão do PHP
php -v

# Deve mostrar PHP 8.0+ 

# Verificar extensões necessárias
php -m | grep -E "(mysql|mysqli|gd|curl|zip|mbstring)"

# Todas devem estar presentes
```

### 6.4 Checklist Final da Primeira Fase

- [ ] **Backup completo realizado** (arquivos + banco)
- [ ] **Backup testado** (arquivo abre corretamente)
- [ ] **Diretório /blog criado** com permissões 755
- [ ] **WordPress baixado e extraído** no /blog
- [ ] **Arquivos principais presentes** (index.php, wp-admin, etc.)
- [ ] **Banco de dados criado** e funcionando
- [ ] **Usuário do banco criado** com privilégios corretos
- [ ] **Credenciais anotadas** em local seguro
- [ ] **Site principal funcionando** normalmente
- [ ] **Subdiretório /blog acessível** (mostra instalação WP)

---

## 📞 PRÓXIMOS PASSOS

**🚫 NÃO CONTINUE** até que todas as verificações acima estejam ✅

**Próxima fase (NÃO incluída neste guia):**
- Configuração do wp-config.php
- Instalação via navegador
- Configuração inicial do WordPress
- Integração com o frontend React

---

## ⚠️ IMPORTANTE - TROUBLESHOOTING

### Problemas Comuns

| Problema | Possível Causa | Solução |
|----------|----------------|---------|
| "403 Forbidden" no /blog | Permissões incorretas | `chmod 755 blog/` |
| "500 Internal Server Error" | Arquivo .htaccess problemático | Renomear .htaccess temporariamente |
| "Can't connect to database" | Credenciais erradas | Verificar usuário/senha do banco |
| Site principal lento | Recursos do servidor | Monitorar uso de CPU/RAM |
| Upload falha | Limite de arquivo | Aumentar `upload_max_filesize` |

### Em Caso de Emergência

1. **Site principal fora do ar:**
   ```bash
   # Rollback imediato
   rm -rf /home/usuario/public_html/blog
   # Restaurar backup completo se necessário
   ```

2. **Erro no banco de dados:**
   ```bash
   # Remover banco criado
   mysql -u root -p
   DROP DATABASE saraiva_blog;
   DROP USER 'blog_admin'@'localhost';
   ```

3. **Contato de emergência:**
   - Suporte da hospedagem
   - Backup dos backups em local seguro
   - Documentar todos os passos realizados

---

**📝 Documento criado em:** [Data]
**👤 Responsável técnico:** [Nome]
**🔄 Próxima revisão:** Após conclusão da Fase 1
