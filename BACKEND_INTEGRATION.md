# 🔗 Backend Integration - Guida Completa

Integrazione frontend/backend per ChordChart con autenticazione e sincronizzazione dati.

## 📋 Panoramica

L'applicazione ora supporta **due modalità**:
1. **Offline Mode** (localStorage) - Funziona senza server
2. **Online Mode** (API + SQLite) - Con backend PHP, autenticazione e sync

## 🚀 Setup Backend

### 1. Configurazione Server

Modifica `api/config.php` per il tuo ambiente:

```php
define('DB_PATH', __DIR__ . '/database/chordchart.db');
define('JWT_SECRET', 'CAMBIA_QUESTA_CHIAVE_IN_PRODUZIONE');
define('CORS_ORIGIN', '*'); // o 'https://tuosito.com'
```

### 2. Deploy

```bash
# Copia la cartella api sul server
cp -r api /var/www/html/chordchart/

# Imposta permessi
chmod 755 api
chmod 777 api/database

# Testa l'API
curl http://localhost/chordchart/api/
```

### 3. Configura Frontend

Modifica `api-client.js`:

```javascript
this.baseURL = '/api'; // Locale
// o
this.baseURL = 'https://tuosito.com/api'; // Produzione
```

## 🔐 Autenticazione

### Flow Utente

1. **Apri l'app** → Click su "🔐 Login"
2. **Registrati** (prima volta)
   - Username
   - Email
   - Password (min 6 caratteri)
3. **Login** 
   - Username/Email
   - Password
4. **Auto-sync** al login (opzionale)

### Token JWT

- Salvato in `localStorage` come `auth_token`
- Inviato automaticamente con ogni richiesta API
- Durata: 7 giorni (configurabile in `api/classes/Auth.php`)

## 🔄 Sincronizzazione

### Modalità Sync

#### 1. Manual Sync (click bottone 🔄)
```javascript
// Scarica dal server + Upload modifiche locali
await apiClient.fullSync();
```

#### 2. Auto Sync (al login)
```javascript
authManager.handleLogin(); // sync automatico dopo login
```

#### 3. Save to Server (singola chart)
```javascript
// Quando salvi una chart, viene salvata su server se sei loggato
app.saveChart(); // controlla se apiClient.isAuthenticated()
```

### Strategia Offline-First

L'app **funziona sempre**, anche offline:

1. **Dati sempre salvati in localStorage** (instant save)
2. **Sync con server quando disponibile** (background)
3. **Fallback automatico** se API non risponde

```javascript
async saveChart() {
    // Save to localStorage (always)
    this.charts = [...];
    localStorage.setItem('chordcharts', JSON.stringify(this.charts));
    
    // Try to sync to server (if logged in)
    if (this.apiClient.isAuthenticated()) {
        try {
            await this.apiClient.createChart(chartData);
        } catch (error) {
            console.log('Offline - saved locally only');
        }
    }
}
```

## 📊 Struttura Dati

### LocalStorage Format

```javascript
{
  id: 1234567890,           // local ID (timestamp)
  server_id: 42,            // server ID (after sync)
  text: "VALERIE - Amy...", // raw input
  chart: {                  // parsed data
    title: "Valerie",
    artist: "Amy Winehouse",
    tempo: 84,
    timeSignature: "4/4",
    sections: [...]
  },
  createdAt: 1234567890,
  updatedAt: 1234567890
}
```

### API Response Format

```json
{
  "success": true,
  "data": {
    "id": 42,
    "user_id": 1,
    "title": "Valerie",
    "artist": "Amy Winehouse",
    "tempo": 84,
    "time_signature": "4/4",
    "content": "VALERIE - Amy...",
    "chart_data": { ... },
    "created_at": "2024-01-01 12:00:00",
    "updated_at": "2024-01-01 12:00:00"
  }
}
```

## 🎯 API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Registra nuovo utente |
| `/auth/login` | POST | Login e ottieni JWT |
| `/auth/me` | GET | Info utente corrente |

### Charts

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/charts` | GET | ✅ | Lista tutte le chart |
| `/charts/:id` | GET | ✅ | Dettaglio singola chart |
| `/charts` | POST | ✅ | Crea nuova chart |
| `/charts/:id` | PUT | ✅ | Aggiorna chart |
| `/charts/:id` | DELETE | ✅ | Elimina chart |

### Playlists

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/playlists` | GET | ✅ | Lista playlist |
| `/playlists/:id` | GET | ✅ | Dettaglio playlist |
| `/playlists` | POST | ✅ | Crea playlist |
| `/playlists/:id` | PUT | ✅ | Aggiorna playlist |
| `/playlists/:id` | DELETE | ✅ | Elimina playlist |
| `/playlists/:id/songs` | POST | ✅ | Aggiungi canzone |
| `/playlists/:id/songs/:chartId` | DELETE | ✅ | Rimuovi canzone |
| `/playlists/:id/reorder` | PUT | ✅ | Riordina canzoni |

## 🔒 Sicurezza

### Backend
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ Prepared statements (SQL injection protection)
- ✅ CORS configurabile
- ✅ User isolation (ogni user vede solo i propri dati)

### Frontend
- ✅ Token in localStorage (auto-expire)
- ✅ Logout automatico su token invalido
- ✅ Input validation
- ✅ HTTPS recommended in produzione

## 🐛 Debugging

### Verifica Connessione

```javascript
// Console del browser
const api = new APIClient();
await api.request('/');
// Dovrebbe ritornare: { success: true, data: { name: "ChordChart API", ... } }
```

### Problemi Comuni

#### 1. CORS Error
```
Access to fetch at '...' from origin '...' has been blocked by CORS
```

**Fix:** Modifica `CORS_ORIGIN` in `api/config.php`

#### 2. 401 Unauthorized
```
Token expired or invalid
```

**Fix:** Logout e re-login

#### 3. Database Locked
```
SQLSTATE[HY000]: General error: 5 database is locked
```

**Fix:** 
```bash
chmod 777 api/database
```

#### 4. .htaccess non funziona
```
404 Not Found su /api/charts
```

**Fix:**
```bash
sudo a2enmod rewrite
sudo service apache2 restart
```

## 📱 Multi-Device

Con il backend puoi:
1. **Registrare account**
2. **Login da più dispositivi**
3. **Sync automatico** tra tutti i tuoi device
4. **Backup automatico** dei dati

### Workflow Multi-Device

**Device 1 (Desktop):**
1. Crea charts e playlist
2. Click "🔄 Sync"

**Device 2 (Tablet):**
1. Login con stesso account
2. Click "🔄 Sync"
3. ✅ Vedi tutte le tue chart!

## 🚀 Roadmap

Prossime funzionalità:
- [ ] Condivisione chart pubbliche
- [ ] Collaborazione real-time
- [ ] Versioning e cronologia modifiche
- [ ] Import da URL/file esterni
- [ ] Export PDF/PNG

---

**Buon divertimento con ChordChart! 🎵**

