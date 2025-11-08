# 🚀 ChordChart - Setup e Installazione

Guida completa per mettere in funzione ChordChart con backend PHP + SQLite.

## 📦 Requisiti

### Minimi (Offline Mode)
- ✅ Browser moderno (Chrome, Firefox, Safari, Edge)
- ✅ Nessun server richiesto!

### Completi (Online Mode con Backend)
- ✅ PHP 7.4+ con estensioni:
  - PDO
  - SQLite3
- ✅ Apache/Nginx con mod_rewrite
- ✅ Permessi scrittura filesystem

## 🎯 Installazione Rapida (Offline)

### Opzione 1: Locale

```bash
# 1. Clona o scarica il progetto
git clone https://github.com/yourusername/chordchart.git
cd chordchart

# 2. Apri nel browser
open index.html
# oppure
firefox index.html
```

### Opzione 2: Web Server Semplice

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Poi apri: http://localhost:8000
```

**✅ Funziona subito!** Tutti i dati salvati in localStorage.

---

## 🌐 Installazione Completa (Backend)

### 1. Setup Apache/Nginx

#### Apache (Linux/Mac)

```bash
# Installa Apache e PHP
sudo apt update
sudo apt install apache2 php libapache2-mod-php php-sqlite3

# Abilita mod_rewrite
sudo a2enmod rewrite

# Riavvia Apache
sudo systemctl restart apache2
```

#### Nginx + PHP-FPM

```bash
# Installa Nginx e PHP
sudo apt install nginx php-fpm php-sqlite3

# Configura Nginx (vedi nginx.conf sotto)
sudo systemctl restart nginx
sudo systemctl restart php-fpm
```

### 2. Deploy Applicazione

```bash
# Copia i file nella document root
sudo cp -r chordchart /var/www/html/

# Imposta permessi
cd /var/www/html/chordchart
sudo chown -R www-data:www-data .
sudo chmod 755 api
sudo chmod 777 api/database  # SQLite ha bisogno di scrivere
```

### 3. Configurazione Backend

Modifica `api/config.php`:

```php
<?php
// Database
define('DB_PATH', __DIR__ . '/database/chordchart.db');

// JWT Secret - CAMBIA IN PRODUZIONE!
define('JWT_SECRET', 'tua-chiave-segreta-molto-lunga-e-casuale');
define('JWT_EXPIRE', 60 * 60 * 24 * 7); // 7 giorni

// CORS - Imposta il tuo dominio
define('CORS_ORIGIN', 'https://tuosito.com'); // o '*' per sviluppo

// Error Display (false in produzione)
define('DISPLAY_ERRORS', false);
```

### 4. Verifica Installazione

```bash
# Testa l'API
curl http://localhost/chordchart/api/

# Dovrebbe ritornare:
# {"success":true,"data":{"name":"ChordChart API","version":"1.0","status":"running"}}
```

### 5. Configurazione Frontend

Modifica `api-client.js`:

```javascript
constructor() {
    // Sviluppo locale
    this.baseURL = '/api';
    
    // Produzione
    // this.baseURL = 'https://tuosito.com/api';
    
    this.token = localStorage.getItem('auth_token');
    this.user = JSON.parse(localStorage.getItem('auth_user') || 'null');
}
```

---

## 🐛 Troubleshooting

### Problema 1: 404 Not Found sugli endpoint API

**Sintomo:**
```
GET /api/charts → 404 Not Found
```

**Fix Apache:**

Verifica che `.htaccess` sia attivo. In `/etc/apache2/apache2.conf`:

```apache
<Directory /var/www/html>
    Options Indexes FollowSymLinks
    AllowOverride All  # ← Deve essere "All"
    Require all granted
</Directory>
```

Poi:
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

**Fix Nginx:**

File `/etc/nginx/sites-available/default`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/chordchart;
    index index.html;

    # API routes
    location /api {
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        }
    }

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Problema 2: Database Locked

**Sintomo:**
```
SQLSTATE[HY000]: General error: 5 database is locked
```

**Fix:**
```bash
# Permessi corretti
sudo chmod 777 api/database
sudo chmod 666 api/database/chordchart.db

# Se il database non esiste, verrà creato automaticamente
```

### Problema 3: CORS Error

**Sintomo:**
```
Access to fetch at 'http://api.example.com' from origin 'http://example.com'
has been blocked by CORS policy
```

**Fix:**

In `api/config.php`:
```php
define('CORS_ORIGIN', '*'); // Dev
// o
define('CORS_ORIGIN', 'https://tuosito.com'); // Prod
```

### Problema 4: JWT Token non valido

**Sintomo:**
```
401 Unauthorized: Token expired or invalid
```

**Fix:**

Nel browser (Console):
```javascript
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
location.reload();
```

Poi ri-fai login.

### Problema 5: PHP errors not showing

**Fix:**

In `api/config.php`:
```php
define('DISPLAY_ERRORS', true);
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

(Solo per debug! Disabilita in produzione)

---

## 🔒 Sicurezza (Produzione)

### Checklist Pre-Deploy

- [ ] Cambia `JWT_SECRET` in `api/config.php`
- [ ] Imposta `DISPLAY_ERRORS` su `false`
- [ ] Configura `CORS_ORIGIN` corretto (non `*`)
- [ ] Abilita HTTPS (Let's Encrypt)
- [ ] Backup automatico del database
- [ ] Limita accessi alla cartella `/api/database/`
- [ ] Aggiorna regolarmente PHP

### HTTPS con Let's Encrypt

```bash
# Installa Certbot
sudo apt install certbot python3-certbot-apache

# Ottieni certificato
sudo certbot --apache -d tuosito.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Backup Database

```bash
# Script di backup (backup.sh)
#!/bin/bash
BACKUP_DIR="/var/backups/chordchart"
DB_FILE="/var/www/html/chordchart/api/database/chordchart.db"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cp $DB_FILE "$BACKUP_DIR/chordchart_$DATE.db"

# Mantieni solo ultimi 30 backup
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
```

Cron (ogni notte alle 3am):
```bash
0 3 * * * /path/to/backup.sh
```

---

## 📊 Monitoring

### Log Apache

```bash
# Error log
tail -f /var/log/apache2/error.log

# Access log
tail -f /var/log/apache2/access.log
```

### Log Nginx

```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### PHP Errors

In `api/config.php` (solo dev):
```php
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/php-errors.log');
```

---

## 🎯 Testing

### Test API

```bash
# Test registrazione
curl -X POST http://localhost/chordchart/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Test login
curl -X POST http://localhost/chordchart/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Salva il token dalla risposta
TOKEN="eyJ0eXAiOiJKV1QiLCJhbGc..."

# Test get charts
curl http://localhost/chordchart/api/charts \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Verifica Finale

Checklist:
- [ ] `http://localhost/chordchart/` → App funziona
- [ ] `http://localhost/chordchart/api/` → API risponde
- [ ] Click "🔐 Login" → Modal si apre
- [ ] Registrazione funziona
- [ ] Login funziona
- [ ] Click "🔄 Sync" → Sincronizzazione OK
- [ ] Player Mode funziona (`player.html?chart=1`)

**🎉 Tutto OK? Sei pronto!**

---

## 📚 Risorse

- [PHP Documentation](https://www.php.net/docs.php)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Apache mod_rewrite](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)
- [JWT.io](https://jwt.io/)

**Problemi? Apri una issue su GitHub!**

