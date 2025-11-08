# 🚀 ChordChart - Quick Start Guide

Inizia subito con ChordChart in 5 minuti!

## ⚡ Avvio Rapido (Zero Config)

### Metodo 1: Apri nel Browser
```bash
# Scarica o clona il progetto
cd chordchart

# Apri index.html nel browser
open index.html
```

**✅ Fatto! L'app funziona offline immediatamente.**

### Metodo 2: Server Locale Semplice
```bash
# Con Python
python -m http.server 8000

# oppure con PHP
php -S localhost:8000

# Apri: http://localhost:8000
```

---

## 🎵 Primo Uso

### 1. Crea la Tua Prima Chart

Click su **"📝 Editor"** e digita:

```
Valerie - Amy Winehouse - 84bpm - 4/4

[Intro]
| Dm7 | Dm7 | Dm7 | Dm7 |

[Verse]
| Dm7 | Dm7 | Am7 | Am7 |
| Bb | C | Dm7 | Dm7 |

[Chorus]
| F | C | Dm7 | Dm7 |
| F | C | Am7 | Bb C |
```

Click **"💾 Salva"**

✅ Chart salvata!

### 2. Ascolta con Playback

- Vai in **"📚 Libreria"**
- Click su **"Valerie"**
- Click **"▶️ Play"** in alto a destra

✅ Si apre il Player Mode fullscreen!

### 3. Crea una Playlist

- Click **"📋 Playlist"** in alto
- Click **"➕ Nuova Playlist"**
- Nome: "Jazz Standards"
- Click **"Crea"**
- Click **"➕ Aggiungi"** → Seleziona charts
- Click **"▶️ Play All"**

✅ Playlist pronta!

---

## 🔐 Con Backend (Opzionale)

### Setup Veloce

1. **Deploy API**
```bash
# Copia api sul server
cp -r api /var/www/html/chordchart/

# Permessi
chmod 777 api/database
```

2. **Configura** `api/config.php`:
```php
define('JWT_SECRET', 'tua-chiave-segreta-qui');
define('CORS_ORIGIN', '*'); // o il tuo dominio
```

3. **Testa**
```bash
curl http://localhost/chordchart/api/
```

4. **Login nell'App**
- Click **"🔐 Login"**
- **Registrati**
- **Login**
- Click **"🔄 Sync"**

✅ Dati sincronizzati sul server!

---

## 🎸 Sintassi Veloce

### Struttura Base
```
TITOLO - Artista - TEMPObpm - TIME_SIGNATURE

[Sezione]
| Accordo1 Accordo2 | Accordo3 | Accordo4 |
```

### Esempi

#### Jazz Standard (4/4)
```
Autumn Leaves - 120bpm

[A]
| Cm7 | F7 | BbMaj7 | EbMaj7 |
| Am7b5 | D7 | Gm7 | Gm7 |

[B]
| Am7b5 | D7 | Gm7 | Gm7 |
| Cm7 | F7 | BbMaj7 | BbMaj7 |
```

#### Bossa (4/4)
```
Girl From Ipanema - 140bpm

[Verse]
| FMaj7 | FMaj7 | G7 | G7 |
| Gm7 | Gb7 | FMaj7 | Gb7 |
```

#### Waltz (3/4)
```
Norwegian Wood - The Beatles - 80bpm - 3/4

[Verse]
| D | D | D | D |
| Em7 A | Em7 A | D | D |
```

#### 5/4
```
Take Five - Dave Brubeck - 180bpm - 5/4

[Theme]
| Ebm7 | Bbm7 | Ebm7 | Bbm7 |
```

---

## ⌨️ Shortcuts

### Editor
- `Ctrl+S` → Salva
- `Ctrl+Enter` → Preview

### Player Mode
- `Space` → Play/Pause
- `Esc` → Stop
- `F` → Fullscreen
- `←` → Canzone Precedente
- `→` → Canzone Successiva

---

## 📱 Mobile

### Installa come PWA (Progressive Web App)
1. Apri l'app nel browser mobile
2. Menu → "Aggiungi a Home Screen"
3. ✅ Icona nell'home!

### Tablet per Live Performance
1. Crea playlist con il tuo setlist
2. Apri in Player Mode
3. Metti tablet sul leggio
4. ✅ Pronto per suonare!

---

## 🎯 Use Cases

### 🎹 Musicista Solo
- Scrivi charts velocemente
- Pratica con metronome
- Autoscroll mentre suoni

### 🎸 Band
- Condividi charts con i membri
- Proietta su schermo durante prove
- Player Mode sincronizzato

### 🎓 Insegnante
- Crea libreria di exercises
- Playlist per livelli
- Condividi con studenti

### 🎤 Live Performance
- Setlist organizzato in playlist
- Player Mode fullscreen
- Autoscroll per seguire

---

## 💡 Tips & Tricks

### 1. Nomenclatura Accordi
```
Maggiori:     C, D, E, F, G, A, B
Minori:       Cm, Dm, Em, Am, Bm
Settima:      C7, Dm7, Cmaj7
Alterati:     C#, Bb, F#m7b5
Slash:        C/E, Dm7/G
```

### 2. Organizzazione
- Usa nomi descrittivi per chart
- Crea playlist per genere/occasione
- Tag nelle description

### 3. Performance
- Test playback prima del live
- Regola tempo al tuo livello
- Usa autoscroll per evitare di girare pagine

### 4. Backup
- Export regolarmente (📥 Export All)
- Se usi backend: sync frequente
- Salva JSON in cloud

---

## ❓ FAQ

**Q: Dove sono salvati i dati?**
A: Nel browser (localStorage) + opzionalmente su server PHP.

**Q: Funziona offline?**
A: Sì! Completamente offline, sempre.

**Q: Posso condividere charts?**
A: Con backend: sì. Altrimenti: export/import JSON.

**Q: Funziona su mobile?**
A: Sì! Responsive e touch-friendly.

**Q: Posso cambiare tonalità?**
A: Non automaticamente (in roadmap), per ora manualmente.

**Q: Supporta tablature/spartiti?**
A: No, solo chord charts (accordi).

---

## 🆘 Problemi?

### Chart non si salva
- Controlla di aver inserito almeno un accordo
- Verifica sintassi (usa |pipe| per separare battute)

### Player non funziona
- Verifica che il browser supporti Web Audio API
- Controlla che tempo e time signature siano corretti

### Sync non funziona
- Verifica di essere loggato
- Controlla che l'API sia raggiungibile
- Guarda console browser per errori

### Autoscroll non funziona
- Verifica che "📜 Auto-scroll" sia attivo
- Ricarica la pagina

---

## 📚 Documentazione Completa

- **README.md** - Panoramica generale
- **SETUP.md** - Installazione dettagliata
- **BACKEND_INTEGRATION.md** - Guida API
- **PLAYER_MODE.md** - Modalità Performance
- **api/README.md** - API Reference

---

## 🎉 Enjoy!

**Ora sei pronto!** Inizia a creare le tue chord charts! 🎵

**Buona musica! 🎸**

