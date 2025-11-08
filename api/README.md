# ChordChart API - PHP Backend

Backend RESTful API per l'applicazione ChordChart con autenticazione JWT e database SQLite.

## 🚀 Installazione

### Requisiti
- PHP 7.4 o superiore
- PDO SQLite extension
- Apache con mod_rewrite (o Nginx)

### Setup

1. **Copia i file nella cartella del tuo server web**
```bash
# Esempio con Apache
cp -r api /var/www/html/chordchart/
```

2. **Imposta i permessi**
```bash
chmod 755 api
chmod 777 api/database  # Permetti scrittura per SQLite
```

3. **Verifica che funzioni**
Visita: `http://localhost/chordchart/api/`

Dovresti vedere:
```json
{
  "success": true,
  "data": {
    "name": "ChordChart API",
    "version": "1.0",
    "status": "running"
  }
}
```

## 📚 Endpoints API

### Autenticazione

#### Registrazione
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "johndoe", "email": "john@example.com" },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {token}
```

### Charts

#### Get All Charts
```
GET /api/charts
Authorization: Bearer {token}
```

#### Get Single Chart
```
GET /api/charts/{id}
Authorization: Bearer {token}
```

#### Create Chart
```
POST /api/charts
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Valerie",
  "artist": "Amy Winehouse",
  "tempo": 84,
  "time_signature": "4/4",
  "content": "VALERIE - Amy Winehouse...",
  "chart_data": { ... }
}
```

#### Update Chart
```
PUT /api/charts/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title"
}
```

#### Delete Chart
```
DELETE /api/charts/{id}
Authorization: Bearer {token}
```

### Playlists

#### Get All Playlists
```
GET /api/playlists
Authorization: Bearer {token}
```

#### Get Single Playlist
```
GET /api/playlists/{id}
Authorization: Bearer {token}
```

#### Create Playlist
```
POST /api/playlists
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jazz Standards",
  "description": "My favorite jazz songs"
}
```

#### Update Playlist
```
PUT /api/playlists/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Playlist
```
DELETE /api/playlists/{id}
Authorization: Bearer {token}
```

#### Add Song to Playlist
```
POST /api/playlists/{id}/songs
Authorization: Bearer {token}
Content-Type: application/json

{
  "chart_id": 5
}
```

#### Remove Song from Playlist
```
DELETE /api/playlists/{id}/songs/{chartId}
Authorization: Bearer {token}
```

#### Reorder Playlist Songs
```
PUT /api/playlists/{id}/reorder
Authorization: Bearer {token}
Content-Type: application/json

{
  "song_ids": [3, 1, 5, 2]
}
```

## 🔒 Sicurezza

- **JWT Authentication**: Tutte le richieste (tranne login/register) richiedono token Bearer
- **Password Hashing**: Bcrypt per le password
- **CORS**: Configurabile in `config.php`
- **SQL Injection Protection**: Prepared statements
- **Input Validation**: Tutti gli input sono validati

## 🗄️ Database

Il database SQLite viene creato automaticamente in `api/database/chordchart.db`

### Tabelle
- `users` - Utenti registrati
- `charts` - Spartiti/chord charts
- `playlists` - Playlist utente
- `playlist_items` - Relazione playlist-charts

## 🐛 Troubleshooting

### Errore: Database write permission
```bash
chmod 777 api/database
```

### Errore: .htaccess non funziona
Verifica che `mod_rewrite` sia abilitato:
```bash
sudo a2enmod rewrite
sudo service apache2 restart
```

### Errore: 404 su tutti gli endpoint
Controlla che `.htaccess` sia nella cartella `api/` e che `AllowOverride All` sia impostato nella configurazione Apache.

## 🚀 Deploy Production

1. **Cambia JWT_SECRET** in `config.php`
2. **Disabilita display_errors** in `config.php`
3. **Abilita HTTPS**
4. **Imposta CORS_ORIGIN** corretto
5. **Backup regolare del database**

```bash
# Backup database
cp api/database/chordchart.db backups/chordchart_$(date +%Y%m%d).db
```

## 📝 Licenza

MIT

