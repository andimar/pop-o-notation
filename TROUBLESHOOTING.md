# Troubleshooting - Registrazione Non Funziona

## Problema: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

Questo errore indica che l'API sta restituendo HTML invece di JSON. Significa che il routing Apache non funziona.

## 🔍 Diagnosi Passo-Passo

### Passo 1: Verifica che l'API sia raggiungibile

Apri nel browser:
```
https://www.andimar.net/api/test.php
```

✅ **Se vedi JSON con "success": true** → L'API è raggiungibile, vai al Passo 2
❌ **Se vedi errore 404 o 500** → Il server non trova i file PHP

### Passo 2: Test diretto della registrazione

Apri nel browser:
```
https://www.andimar.net/api/test-auth.php
```

Compila il form e prova a registrarti.

✅ **Se la registrazione funziona** → Il problema è il routing .htaccess
❌ **Se non funziona** → Problema con il database o PHP

### Passo 3: Verifica .htaccess

Il file `.htaccess` deve essere in:
```
/api/.htaccess
```

**Verifica sul server che esista:**
```bash
ls -la api/.htaccess
```

**Se non esiste o non funziona, ricrealo:**
```bash
cd api
nano .htaccess
```

Copia questo contenuto:
```apache
RewriteEngine On
RewriteBase /api/

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

## 🔧 Soluzioni

### Soluzione 1: Abilita mod_rewrite (se hai accesso SSH)

```bash
# Abilita mod_rewrite
sudo a2enmod rewrite

# Riavvia Apache
sudo systemctl restart apache2
```

### Soluzione 2: Configura AllowOverride

Se hai accesso alla configurazione Apache, modifica il VirtualHost:

```apache
<Directory /var/www/html/api>
    AllowOverride All
    Require all granted
</Directory>
```

Poi riavvia Apache:
```bash
sudo systemctl restart apache2
```

### Soluzione 3: Usa un file alternativo senza routing

Se non puoi modificare Apache, usa i file di test diretti:

**Nel file `api-client.js`**, sostituisci i metodi:

```javascript
async register(username, email, password) {
    // Usa test-auth.php invece del routing
    const response = await fetch('https://www.andimar.net/api/test-auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    if (!data.success) {
        throw new Error(data.message || 'Registration failed');
    }
    
    return data.data;
}
```

### Soluzione 4: Crea endpoint diretti per tutte le funzioni

Crea questi file nella cartella `api/`:

- `api/register.php` → gestisce la registrazione
- `api/login.php` → gestisce il login
- `api/charts-list.php` → lista charts
- ecc.

## 📋 Checklist Completa

- [ ] PHP >= 7.4 installato
- [ ] Estensione `pdo_sqlite` abilitata
- [ ] File `api/.htaccess` presente
- [ ] `mod_rewrite` abilitato su Apache
- [ ] `AllowOverride All` nella configurazione Apache
- [ ] Permessi cartella `api/database` → 777
- [ ] File `.htaccess` leggibile (permessi 644)

## 🧪 Test Completo

Esegui questi test in ordine:

1. **Test PHP:**
   ```
   https://www.andimar.net/api/test.php
   ```
   
2. **Test Database:**
   ```
   https://www.andimar.net/api/test-auth.php
   ```
   
3. **Test Routing (dovrebbe funzionare dopo fix):**
   ```
   https://www.andimar.net/api/
   ```
   Dovrebbe mostrare lista endpoint

4. **Test Registrazione con routing:**
   ```bash
   curl -X POST https://www.andimar.net/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@test.com","password":"test123"}'
   ```

## 💡 Alternative Rapide

### Opzione A: Nginx invece di Apache

Se usi Nginx, la configurazione è diversa:

```nginx
location /api {
    try_files $uri $uri/ /api/index.php?$query_string;
}
```

### Opzione B: PHP Built-in Server (solo sviluppo)

```bash
cd /var/www/html
php -S 0.0.0.0:8000
```

Poi usa: `http://tuo-ip:8000/api/`

## 📞 Contatto Hosting

Se niente funziona, contatta il supporto del tuo hosting e chiedi:

1. È abilitato `mod_rewrite`?
2. Posso usare file `.htaccess` con `AllowOverride All`?
3. L'estensione `pdo_sqlite` è disponibile?

## 🎯 Soluzione Temporanea VELOCE

Modifica `api-client.js` per cambiare il baseURL:

```javascript
constructor() {
    // USA I FILE DI TEST FINCHÉ NON SISTEMI IL ROUTING
    this.baseURL = 'https://www.andimar.net/api';
    this.useDirectFiles = true; // Flag per usare file diretti
}
```

Poi crea un endpoint diretto per ogni azione necessaria.

