# Checklist de Segurança - WordPress Blog

## 🔐 Medidas de Segurança Essenciais

### Antes da Instalação

- [ ] **Backup completo realizado** e testado
- [ ] **Ambiente de staging configurado** (teste.saraivavision.com.br)
- [ ] **Senhas fortes geradas** para usuário do banco
- [ ] **Credenciais armazenadas** em local seguro (LastPass, 1Password, etc.)

### Durante a Instalação

- [ ] **Instalação realizada no staging primeiro**
- [ ] **Testes funcionais** no ambiente de teste
- [ ] **Verificação de compatibilidade** PHP/MySQL
- [ ] **Site principal monitorado** durante o processo

### Configurações de Segurança Imediatas

#### 1. Proteção do wp-config.php
```bash
# Definir permissões restritivas
chmod 600 wp-config.php
```

#### 2. Proteção do diretório wp-admin
```apache
# Adicionar ao .htaccess do /blog
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /blog/
    
    # Bloquear acesso direto a arquivos PHP
    RewriteCond %{THE_REQUEST} /wp-admin/.*\.php[?\s] [NC]
    RewriteRule ^wp-admin/.*\.php$ - [F,L]
</IfModule>
```

#### 3. Remover informações desnecessárias
```php
// Adicionar ao wp-config.php
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);

// Ocultar versão do WordPress
remove_action('wp_head', 'wp_generator');
```

### Monitoramento Contínuo

- [ ] **Logs de acesso** configurados
- [ ] **Alertas de tentativas de login** configurados
- [ ] **Monitoramento de recursos** ativado
- [ ] **Backup automático diário** configurado

### Planos de Contingência

#### Cenário 1: Site principal comprometido
1. Isolar o diretório /blog imediatamente
2. Restaurar backup do site principal
3. Investigar origem do problema
4. Reforçar medidas de segurança

#### Cenário 2: Blog WordPress comprometido
1. Desativar acesso ao /blog (403 via .htaccess)
2. Fazer backup do estado atual para análise
3. Remover diretório /blog completamente
4. Reinstalar do zero com senhas novas

#### Cenário 3: Banco de dados comprometido
1. Alterar senhas do banco imediatamente
2. Exportar dados limpos se possível
3. Recriar banco do zero
4. Restaurar apenas dados verificados

### Contatos de Emergência

| Situação | Contato | Telefone/Email |
|----------|---------|----------------|
| Suporte Hospedagem | [Provedor] | [Telefone/Email] |
| Desenvolvedor Responsável | [Nome] | [Contato] |
| Backup/Restore | [Responsável] | [Contato] |

### Ferramentas Recomendadas

- **Plugin de Segurança:** Wordfence ou Sucuri
- **Backup:** UpdraftPlus ou BackupBuddy
- **Monitoramento:** UptimeRobot
- **SSL:** Let's Encrypt (via cPanel/Hospedagem)

---

**⚠️ IMPORTANTE:** Este checklist deve ser seguido rigorosamente para garantir que a implementação do blog não comprometa a segurança do site principal.