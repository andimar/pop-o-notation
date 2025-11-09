# 🔧 FIX - Problema Registrazione

## 🚨 Problema
**Errore:** `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**Causa:** Il server Apache non sta processando il file `.htaccess` correttamente, quindi le rotte API non funzionano.

---

## ✅ SOLUZIONE RAPIDA (2 minuti)

### 1️⃣ Apri il file `api-client.js`

Cerca questa riga (circa linea 13):

```javascript
this.useDirectFiles = false;
```

### 2️⃣ Cambiala in:

```javascript
this.useDirectFiles = true;
```

### 3️⃣ Salva e ricarica la pagina

Premi `Ctrl+F5` per svuotare la cache del browser.

### 4️⃣ Prova la registrazione

Ora dovrebbe funzionare! ✅

---

## 🔍 Come Testare

### Test 1: Verifica che l'API sia raggiungibile

Apri nel browser:
```
https://www.andimar.net/api/test.php
```

Dovresti vedere:
```json
{
  "success": true,
  "message": "API è raggiungibile!",
  "php_version": "...",
  "extensions": {
    "pdo": true,
    "pdo_sqlite": true,
    "json": true
  }
}
```

### Test 2: Prova il form di registrazione diretto

Apri nel browser:
```
https://www.andimar.net/api/test-auth.php
```

Compila il form e prova a registrarti.

---

## 📁 File Creati

Ho creato questi file nella cartella `api/` per bypassare il problema del routing:

### File di Test
- ✅ `test.php` - Verifica che PHP funzioni
- ✅ `test-auth.php` - Form di test per registrazione

### Endpoint Diretti (per quando useDirectFiles = true)
- ✅ `register.php` - Registrazione utente
- ✅ `login.php` - Login utente
- ✅ `charts-list.php` - Lista charts
- ✅ `chart-create.php` - Crea chart
- ✅ `chart-update.php` - Aggiorna chart
- ✅ `chart-delete.php` - Elimina chart

Questi file funzionano **SENZA bisogno di `.htaccess`**!

---

## 🎯 Cosa Ho Modificato

### In `api-client.js`:

1. **Aggiunto flag `useDirectFiles`:**
   ```javascript
   this.useDirectFiles = false; // Cambia in true per usare file diretti
   ```

2. **Aggiornati tutti i metodi per supportare entrambe le modalità:**
   ```javascript
   // PRIMA (con routing):
   '/auth/register'
   
   // DOPO (senza routing se useDirectFiles = true):
   this.useDirectFiles ? '/register.php' : '/auth/register'
   ```

3. **Migliorata gestione errori:**
   - Controlla se la risposta è JSON
   - Mostra messaggio di errore più chiaro

---

## 🔧 Soluzione Definitiva (per sistemare il routing)

### Se hai accesso SSH al server:

```bash
# 1. Abilita mod_rewrite
sudo a2enmod rewrite

# 2. Verifica che .htaccess esista
ls -la /var/www/html/api/.htaccess

# 3. Se non esiste, crealo:
cd /var/www/html/api
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

```bash
# 4. Imposta permessi corretti
chmod 644 .htaccess

# 5. Riavvia Apache
sudo systemctl restart apache2
```

### Se usi hosting condiviso (tipo Aruba, Netsons, ecc.):

Contatta il supporto e chiedi:
1. "Potete abilitare `mod_rewrite` per la cartella `/api`?"
2. "Potete impostare `AllowOverride All` nella configurazione?"

---

## 📊 Modalità di Funzionamento

### Modalità Normal (useDirectFiles = false)
```
https://www.andimar.net/api/auth/register
                           ↓
                      index.php (routing)
                           ↓
                  endpoints/auth.php
```

**Richiede:** Apache con mod_rewrite + .htaccess

### Modalità Direct Files (useDirectFiles = true)
```
https://www.andimar.net/api/register.php
                           ↓
                      register.php (diretto)
```

**Funziona sempre!** Non serve configurazione speciale.

---

## ❓ Domande Frequenti

### Q: Perché non funziona il routing?
**A:** Probabilmente `mod_rewrite` non è abilitato o il file `.htaccess` non viene letto.

### Q: useDirectFiles = true è permanente?
**A:** No! Una volta sistemato Apache, puoi rimetterlo a `false`.

### Q: Ci sono differenze di funzionalità?
**A:** No, l'app funziona identicamente in entrambe le modalità.

### Q: Posso cancellare i file diretti dopo?
**A:** Sì, una volta che il routing funziona, puoi eliminarli.

---

## 📝 Checklist Completa

Prima di testare, verifica:

- [ ] PHP >= 7.4 installato
- [ ] Estensione `pdo_sqlite` abilitata
- [ ] File caricati nella cartella `/api/` sul server
- [ ] Permessi cartella API (755)
- [ ] File `api-client.js` modificato con `useDirectFiles = true`
- [ ] Cache del browser svuotata (Ctrl+F5)

---

## 🎉 Tutto Fatto!

Dopo aver impostato `useDirectFiles = true`, la tua app dovrebbe funzionare perfettamente!

Se hai ancora problemi, apri:
- https://www.andimar.net/api/test.php
- https://www.andimar.net/api/test-auth.php

E verifica che vedi JSON, non HTML.

---

## 📚 File di Documentazione

- **FIX-RAPIDO.md** - Guida veloce (questo file)
- **TROUBLESHOOTING.md** - Guida completa al troubleshooting
- **api/README.md** - Documentazione API completa

