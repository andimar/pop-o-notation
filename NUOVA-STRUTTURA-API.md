# 🎯 Nuova Struttura API con Sottocartelle

## ✅ Vantaggi

### 1. **Funziona Sempre** 
Nessun bisogno di configurazione Apache speciale:
- ❌ Non serve `mod_rewrite`
- ❌ Non serve `.htaccess`
- ❌ Non serve configurazione speciale
- ✅ Funziona su qualsiasi server web (Apache, Nginx, IIS, PHP Built-in)

### 2. **Più Intuitiva**
La struttura delle URL riflette l'organizzazione dei file:
```
URL: /api/auth/register.php
File: /api/auth/register.php
```

### 3. **RESTful e Pulita**
Le rotte sono organizzate logicamente per risorsa:
```
/api/auth/...      → Autenticazione
/api/charts/...    → Gestione charts
/api/playlists/... → Gestione playlists
```

### 4. **Facile da Mantenere**
Ogni endpoint è un file separato, facile da trovare e modificare.

---

## 📁 Struttura File

```
api/
├── config.php
├── index.php (informazioni API)
├── test.php (test connessione)
├── classes/
│   ├── Auth.php
│   ├── Database.php
│   ├── ChartController.php
│   └── PlaylistController.php
│
├── auth/
│   ├── register.php  → POST /api/auth/register.php
│   ├── login.php     → POST /api/auth/login.php
│   └── me.php        → GET  /api/auth/me.php
│
├── charts/
│   ├── list.php      → GET  /api/charts/list.php
│   ├── create.php    → POST /api/charts/create.php
│   ├── update.php    → POST /api/charts/update.php?id=123
│   └── delete.php    → POST /api/charts/delete.php?id=123
│
└── playlists/
    ├── list.php      → GET  /api/playlists/list.php
    ├── create.php    → POST /api/playlists/create.php
    ├── update.php    → POST /api/playlists/update.php?id=123
    ├── delete.php    → POST /api/playlists/delete.php?id=123
    ├── add-song.php  → POST /api/playlists/add-song.php?id=123
    ├── remove-song.php → POST /api/playlists/remove-song.php?id=123&chart_id=456
    └── reorder.php   → POST /api/playlists/reorder.php?id=123
```

---

## 🔗 Endpoint API

### 🔐 Autenticazione

#### Registrazione
```http
POST /api/auth/register.php
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login.php
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

#### Info Utente Corrente
```http
GET /api/auth/me.php
Authorization: Bearer {token}
```

---

### 🎵 Charts

#### Lista Tutte le Charts
```http
GET /api/charts/list.php
Authorization: Bearer {token}
```

#### Singola Chart
```http
GET /api/charts/list.php?id=123
Authorization: Bearer {token}
```

#### Crea Chart
```http
POST /api/charts/create.php
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Valerie",
  "artist": "Amy Winehouse",
  "tempo": 84,
  "time_signature": "4/4",
  "content": "...",
  "chart_data": { ... }
}
```

#### Aggiorna Chart
```http
POST /api/charts/update.php?id=123
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Nuovo Titolo"
}
```

#### Elimina Chart
```http
POST /api/charts/delete.php?id=123
Authorization: Bearer {token}
```

---

### 📁 Playlists

#### Lista Tutte le Playlists
```http
GET /api/playlists/list.php
Authorization: Bearer {token}
```

#### Singola Playlist
```http
GET /api/playlists/list.php?id=123
Authorization: Bearer {token}
```

#### Crea Playlist
```http
POST /api/playlists/create.php
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jazz Standards",
  "description": "My favorite jazz songs"
}
```

#### Aggiorna Playlist
```http
POST /api/playlists/update.php?id=123
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Nuovo Nome"
}
```

#### Elimina Playlist
```http
POST /api/playlists/delete.php?id=123
Authorization: Bearer {token}
```

#### Aggiungi Canzone
```http
POST /api/playlists/add-song.php?id=123
Authorization: Bearer {token}
Content-Type: application/json

{
  "chart_id": 456
}
```

#### Rimuovi Canzone
```http
POST /api/playlists/remove-song.php?id=123&chart_id=456
Authorization: Bearer {token}
```

#### Riordina Canzoni
```http
POST /api/playlists/reorder.php?id=123
Authorization: Bearer {token}
Content-Type: application/json

{
  "song_ids": [3, 1, 5, 2]
}
```

---

## 🚀 Come Usare

### 1. Carica i file sul server

Carica tutta la cartella `api/` sul tuo server:
```
/var/www/html/api/
```

### 2. Imposta i permessi

```bash
chmod 755 api/
chmod 755 api/auth/
chmod 755 api/charts/
chmod 755 api/playlists/
chmod 644 api/**/*.php
```

### 3. Testa che funzioni

Apri nel browser:
```
https://www.andimar.net/api/test.php
```

Dovresti vedere JSON con `"success": true`

### 4. Prova la registrazione

Apri nel browser:
```
https://www.andimar.net/api/test-auth.php
```

Usa il form per registrarti.

### 5. Usa l'app!

Ricarica la tua applicazione e prova la registrazione.

---

## 🔄 Migrazione dalla Vecchia Struttura

Ho già aggiornato `api-client.js` per usare la nuova struttura:

**Prima:**
```javascript
'/auth/register'  // Richiedeva routing .htaccess
```

**Dopo:**
```javascript
'/auth/register.php'  // Funziona sempre!
```

**Non serve fare nulla!** Basta ricaricare la pagina.

---

## 📝 Note Tecniche

### Perché POST invece di PUT/DELETE?

Ho usato `POST` anche per update e delete perché:
1. Alcuni firewall/proxy bloccano PUT/DELETE
2. È più compatibile con tutti i server
3. I file PHP controllano comunque il metodo se serve

Se preferisci, puoi cambiare nei file:
```php
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    // Accetta sia POST che PUT
}
```

### Perché gli ID sono nei query parameters?

```
/api/charts/update.php?id=123
```

Invece di:
```
/api/charts/123/update.php
```

Perché:
1. Più semplice da implementare
2. Non serve routing complesso
3. Funziona sempre
4. Facile da testare con il browser

---

## 🎉 Risultato

### ✅ PRO
- Funziona su qualsiasi server
- Nessuna configurazione necessaria
- Facile da capire e mantenere
- Struttura pulita e organizzata
- Facile da testare

### ⚠️ CONTRO (minori)
- URL leggermente più lunghe (`.php` alla fine)
- ID nei query parameters invece che nel path

Ma i vantaggi superano di gran lunga gli svantaggi!

---

## 🧪 Test Rapido

```bash
# Test registrazione
curl -X POST https://www.andimar.net/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123456"}'

# Test login
curl -X POST https://www.andimar.net/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123456"}'
```

---

## 📚 Prossimi Passi

1. ✅ Carica i nuovi file sul server
2. ✅ Testa `/api/test.php`
3. ✅ Prova la registrazione
4. ✅ Usa l'app normalmente
5. 🗑️ (Opzionale) Elimina i vecchi file di routing

---

**La nuova struttura è pronta e funzionante! 🎉**

