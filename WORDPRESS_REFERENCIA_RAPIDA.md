# WordPress Blog - Referência Rápida

## 📖 Documentação Disponível

### 📋 Guias de Implementação
- **[WORDPRESS_INSTALACAO_PASSO_1.md](./WORDPRESS_INSTALACAO_PASSO_1.md)** - Guia detalhado para a primeira fase
- **[WORDPRESS_SEGURANCA_CHECKLIST.md](./WORDPRESS_SEGURANCA_CHECKLIST.md)** - Checklist de segurança
- **[BLOG_IMPLEMENTATION_PLAN.md](./BLOG_IMPLEMENTATION_PLAN.md)** - Plano técnico completo
- **[BLOG_DOCUMENTATION.md](./BLOG_DOCUMENTATION.md)** - Requisitos funcionais

## 🚀 Primeira Fase - Checklist Rápido

### ✅ Pré-requisitos
- [ ] Acesso ao servidor (cPanel/SSH/FTP)
- [ ] PHP 8.0+ confirmado
- [ ] MySQL 5.7+ disponível
- [ ] Pelo menos 100MB de espaço livre

### 📦 Backup e Preparação
- [ ] Backup completo realizado (arquivos + banco)
- [ ] Backup testado e funcionando
- [ ] Ambiente de staging configurado (recomendado)

### 📁 Instalação WordPress
- [ ] Diretório `/blog` criado com permissões 755
- [ ] WordPress baixado e extraído no diretório
- [ ] Arquivos essenciais verificados (index.php, wp-admin/, etc.)

### 🗄️ Banco de Dados
- [ ] Banco de dados criado (`saraiva_blog`)
- [ ] Usuário do banco criado (`blog_admin`)
- [ ] Privilégios concedidos corretamente
- [ ] Credenciais anotadas em local seguro

### 🔒 Segurança
- [ ] Permissões de arquivos configuradas
- [ ] Proteção do wp-config.php aplicada
- [ ] Plano de rollback definido

### ✅ Verificação Final
- [ ] Site principal funcionando normalmente
- [ ] `/blog` acessível (mostra instalação WordPress)
- [ ] Todas as verificações técnicas aprovadas

## 🛠️ Comandos Úteis

### SSH/Terminal
```bash
# Navegar para o diretório do site
cd /home/usuario/public_html

# Criar backup rápido
tar -czf backup_$(date +%Y%m%d).tar.gz *

# Baixar WordPress
cd blog
wget https://br.wordpress.org/latest-pt_BR.tar.gz
tar -xzf latest-pt_BR.tar.gz && mv wordpress/* . && rm -rf wordpress latest-pt_BR.tar.gz

# Verificar arquivos
ls -la | grep -E "(index.php|wp-config|wp-admin)"

# Verificar banco de dados
mysql -h localhost -u blog_admin -p saraiva_blog
```

### MySQL
```sql
-- Criar banco e usuário
CREATE DATABASE saraiva_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'blog_admin'@'localhost' IDENTIFIED BY 'SENHA_FORTE';
GRANT ALL PRIVILEGES ON saraiva_blog.* TO 'blog_admin'@'localhost';
FLUSH PRIVILEGES;
```

## 🆘 Troubleshooting Rápido

| Problema | Causa Provável | Solução Rápida |
|----------|----------------|----------------|
| 403 Forbidden | Permissões incorretas | `chmod 755 blog/` |
| 500 Error | .htaccess problemático | Renomear .htaccess |
| Site principal lento | Recursos insuficientes | Monitorar CPU/RAM |
| Upload falha | Limite de arquivo | Verificar php.ini |

## ⚠️ Avisos Importantes

- **NÃO prossiga** se o site principal apresentar problemas
- **SEMPRE teste** no ambiente de staging primeiro
- **MANTENHA backups** atualizados e acessíveis
- **DOCUMENTE** todas as alterações realizadas

## 📞 Próximos Passos

Após concluir a Primeira Fase com sucesso:

1. **Configurar wp-config.php** com credenciais do banco
2. **Executar instalação** via navegador
3. **Configurar WordPress** (usuário admin, plugins básicos)
4. **Integrar com frontend React** conforme plano técnico

---

**⏰ Tempo estimado para Primeira Fase:** 1-2 horas
**👥 Pessoas necessárias:** 1 desenvolvedor com acesso ao servidor
**🔄 Frequência de backup:** Antes, durante e após cada etapa