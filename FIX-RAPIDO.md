# 🚨 FIX RAPIDO - Registrazione Non Funziona

## Problema
Errore: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

## Soluzione Immediata (5 minuti)

### Passo 1: Testa se l'API funziona

Apri nel browser:
```
https://www.andimar.net/api/test.php
```

**Cosa dovresti vedere:**
```json
{
  "success": true,
  "message": "API è raggiungibile!",
  ...
}
```

### Passo 2: Attiva la modalità file diretti

Apri il file `api-client.js` e cerca questa riga (circa linea 11):

```javascript
this.useDirectFiles = false;
```

Cambiala in:

```javascript
this.useDirectFiles = true;  // ← Cambia false in true
```

### Passo 3: Ricarica la pagina

Premi `Ctrl+F5` (o `Cmd+Shift+R` su Mac) per svuotare la cache.

### Passo 4: Prova la registrazione

Ora la registrazione dovrebbe funzionare! 

---

## Come Funziona

Quando `useDirectFiles = true`, l'app usa:
- ❌ Non più: `https://www.andimar.net/api/auth/register` (che non funziona)
- ✅ Invece: `https://www.andimar.net/api/register.php` (che funziona)

---

## Risoluzione Definitiva (quando hai tempo)

Il problema è che Apache non processa il file `.htaccess` correttamente.

### Se hai accesso SSH al server:

```bash
# 1. Verifica che mod_rewrite sia abilitato
sudo a2enmod rewrite

# 2. Riavvia Apache
sudo systemctl restart apache2

# 3. Verifica che .htaccess esista
ls -la /percorso/al/tuo/sito/api/.htaccess

# 4. Verifica i permessi
chmod 644 /percorso/al/tuo/sito/api/.htaccess
```

### Se usi un hosting condiviso:

Contatta il supporto e chiedi:
1. "Potete abilitare mod_rewrite per la mia cartella /api ?"
2. "Potete impostare AllowOverride All per /api ?"

---

## Test Completo

Una volta sistemato, testa con:

1. **Vai su:** https://www.andimar.net/api/
   
   Dovresti vedere la lista degli endpoint API

2. **Cambia di nuovo in `api-client.js`:**
   ```javascript
   this.useDirectFiles = false;  // Torna alla modalità normale
   ```

3. **Ricarica e prova la registrazione**

Se funziona, è tutto a posto! ✅

---

## Alternativa: Configurazione Nginx

Se il tuo server usa Nginx invece di Apache, devi aggiungere questa configurazione:

```nginx
location /api {
    try_files $uri $uri/ /api/index.php?$query_string;
}
```

---

## File Creati per il Fix

Ho creato questi file nella cartella `api/`:

- ✅ `test.php` - verifica che PHP funzioni
- ✅ `register.php` - registrazione diretta
- ✅ `login.php` - login diretto
- ✅ `test-auth.php` - form di test per registrazione

Tutti questi file funzionano senza bisogno di `.htaccess`!

---

## Riassunto

**SOLUZIONE VELOCE:**
1. Cambia `useDirectFiles = true` in `api-client.js`
2. Ricarica la pagina
3. Prova la registrazione

**SOLUZIONE DEFINITIVA:**
- Abilita `mod_rewrite` su Apache
- O contatta il supporto hosting

---

## Hai ancora problemi?

Prova ad aprire:
- https://www.andimar.net/api/test.php
- https://www.andimar.net/api/test-auth.php

E dimmi cosa vedi!

