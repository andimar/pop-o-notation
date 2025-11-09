# ⚡ Setup Veloce - 3 Passi

## 🎯 Il Tuo Problema

- ✅ Hai un progetto in una **sottocartella** (es. `/notation/`)
- ✅ La registrazione restituiva errore: `Unexpected token '<'...`
- ✅ Il routing Apache non funzionava

## ✅ Soluzione Implementata

Ho creato una **struttura con sottocartelle** che:
- Funziona **sempre**, senza `.htaccess` o `mod_rewrite`
- Rileva **automaticamente** il percorso
- È **facilmente configurabile**

---

## 🚀 Cosa Fare (3 Passi)

### 1️⃣ Carica i file sul server

Carica questi file/cartelle sul server:

```
✅ config.js (NUOVO)
✅ api-client.js (MODIFICATO)
✅ index.html (MODIFICATO)
✅ api/auth/ (NUOVA cartella)
✅ api/charts/ (NUOVA cartella)
✅ api/playlists/ (NUOVA cartella)
✅ api/test.php (NUOVO)
✅ api/test-auth.php (NUOVO)
```

### 2️⃣ Testa che funzioni

Apri nel browser (sostituisci `[path]` con la tua sottocartella):

```
https://www.andimar.net/[path]/api/test.php
```

**Devi vedere JSON con** `"success": true`

### 3️⃣ Usa l'app!

Ricarica l'app e prova a registrarti.

**Dovrebbe funzionare!** ✅

---

## ⚙️ Se Auto-detect Non Funziona

Apri `config.js` e modifica:

```javascript
projectPath: 'auto',  // ← Cambia in '/notation' (il tuo path)
```

Esempio se il progetto è in `https://www.andimar.net/notation/`:

```javascript
projectPath: '/notation',
```

---

## 🧪 Test Rapido

1. **Apri:** `https://www.andimar.net/[tuo-path]/api/test.php`
   → Deve mostrare JSON ✅

2. **Apri:** `https://www.andimar.net/[tuo-path]/api/test-auth.php`
   → Deve mostrare un form ✅

3. **Registrati** dal form
   → Deve funzionare ✅

4. **Usa l'app** normalmente
   → Tutto funziona! ✅

---

## 📚 Documentazione Completa

- **SETUP-FINALE.md** - Guida completa
- **CONFIGURAZIONE-SOTTOCARTELLA.md** - Dettagli configurazione
- **NUOVA-STRUTTURA-API.md** - Struttura API

---

## 🎉 Fatto!

3 passi e funziona! 🚀

**Hai problemi?** Leggi `SETUP-FINALE.md`

