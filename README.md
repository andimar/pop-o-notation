# 🎵 ChordChart - Creatore Veloce di Spartiti (Band-in-a-Box Style)

Applicazione web professionale per creare, salvare, organizzare e suonare chord charts con playback audio e playlist. Perfetto per musicisti e band!

## 🚀 Come Usare

### Avvio Rapido
1. Apri `index.html` nel browser
2. Inizia a scrivere nell'editor con sintassi Band-in-a-Box
3. Vedi l'anteprima in tempo reale in formato griglia
4. Salva le tue charts

### Sintassi Band-in-a-Box

#### Intestazione (prima riga)
```
TITOLO - Artista - 120bpm - 4/4
```
- **Titolo**: Nome della canzone
- **Artista**: Autore/Interprete
- **Tempo**: BPM (battute per minuto)
- **Time Signature**: 3/4, 4/4, 5/4, 6/8, 7/8, etc. (opzionale, default 4/4)

#### Sezioni
Usa le parentesi quadre per definire le sezioni:
```
[Intro]
[Verse]
[Chorus]
[Bridge]
[Solo]
[Outro]
```

#### Battute
Ogni battuta è separata da `|`:
```
Cm7 | Fm7 | Bb7 | Eb
```
- Una battuta può contenere più accordi separati da spazi
- `Cm7 Fm7` = due accordi nella stessa battuta
- Ogni `|` crea una nuova battuta

#### Layout Griglia
- Le battute sono visualizzate in una griglia 4x4 (4 battute per riga)
- Ogni battuta è numerata automaticamente
- Le sezioni sono evidenziate con intestazioni
- Su mobile: 2 battute per riga

### Esempi Completi

#### Esempio 1: Valerie (Band-in-a-Box Style)
```
VALERIE - Amy Winehouse - 84bpm - 4/4

[Intro]
Eb△ | Eb△ | Fm7 | Fm7
Eb△ | Eb△ | Fm7 | Fm7

[Verse]
Ab△ | Bbm | Ab△ | Bbm
Ab△ | Bbm | Bb7 | Eb△

[Chorus]
Eb△ | Eb△ | Fm7 | Fm7
Ab△ | Bbm | Ab△ | Bbm
```

#### Esempio 2: Autumn Leaves
```
Autumn Leaves - Jazz Standard - 120bpm - 4/4

[A Section]
Cm7 | F7 | BbMaj7 | EbMaj7
Am7b5 | D7 | Gm | Gm

[B Section]
Am7b5 | D7 | Gm | Gm
Cm7 | F7 | BbMaj7 | EbMaj7
```

#### Esempio 3: 12 Bar Blues
```
Blues in C - Traditional - 120bpm - 4/4

[Chorus]
C7 | C7 | C7 | C7
F7 | F7 | C7 | C7
G7 | F7 | C7 | G7
```

## 🎼 Autoscroll Durante Playback

Una delle funzionalità più innovative dell'app:

### Caratteristiche Autoscroll
- **Scroll automatico** durante il playback
- Gli accordi scorrono **dall'alto verso il basso**
- **Sincronizzazione perfetta** con il BPM della canzone
- La battuta corrente è sempre **centrata** nella vista
- **Smooth scrolling** per un'esperienza fluida

### Come Funziona
1. Premi Play per avviare il playback
2. La chart scorre automaticamente seguendo il tempo
3. La battuta corrente è evidenziata in blu
4. Lo scroll mantiene sempre visibile dove sei nella canzone

Ideale per suonare leggendo dallo smartphone o tablet!

## 📋 Sistema Playlist

Organizza le tue canzoni in playlist per concerti, session o pratica:

### Funzionalità Playlist
- ✅ **Crea playlist** tematiche (Jazz Standards, Rock Classics, Mie Composizioni, etc.)
- ✅ **Aggiungi canzoni** a multiple playlist
- ✅ **Riordina** le canzoni drag & drop (coming soon)
- ✅ **Play All** - suona tutte le canzoni in sequenza
- ✅ **Export/Import** playlist per condividerle o backup
- ✅ **Gestione visuale** con statistiche e date

### Come Usare le Playlist
1. Vai alla sezione **Playlist** (📋)
2. Clicca **Nuova Playlist** e dai un nome
3. Aggiungi canzoni dalla libreria (➕ Aggiungi a Playlist)
4. Usa **Play All** per suonare l'intera playlist
5. **Esporta** per salvare o condividere

## 📱 Utilizzo Mobile

L'interfaccia è ottimizzata per dispositivi mobili:
- Touch friendly
- Layout verticale su smartphone
- Testo ingrandito per leggibilità
- Salvataggio locale (funziona offline)
- **Autoscroll perfetto** per suonare dal telefono

## 💾 Gestione Dati

### Salvataggio
- Le charts vengono salvate automaticamente nel browser
- I dati persistono anche chiudendo la pagina
- Nessun server necessario

### Backup
- **Esporta Tutto**: scarica un file JSON con tutte le charts
- **Importa**: carica charts da file JSON precedenti
- Consiglio: fai backup regolari!

### Privacy
- Tutti i dati rimangono sul tuo dispositivo
- Nessuna connessione internet necessaria dopo il primo caricamento
- Nessun tracking o analytics

## 🎨 Personalizzazione

### Modifica Stili
Modifica `styles.css` per cambiare:
- Colori (variabili CSS in `:root`)
- Font
- Dimensioni
- Layout

### Estendi Parser
Modifica `app.js` per aggiungere:
- Nuovi simboli musicali
- Annotazioni personalizzate
- Metadati aggiuntivi

## 🔧 Tecnologie

- **HTML5** - Struttura
- **CSS3** - Styling responsive con variabili CSS
- **JavaScript (Vanilla)** - Nessuna dipendenza esterne!
- **Web Audio API** - Playback audio e metronomo
- **LocalStorage API** - Persistenza dati offline
- **Modular Architecture** - Codice organizzato e estendibile

## 🥁 Metronomo / Click

L'app include un metronomo integrato con accenti dinamici:

### Caratteristiche
- **Click automatico** sincronizzato con il tempo (BPM)
- **Accenti**: il primo beat di ogni battuta è più forte
- **Time Signatures**: supporta 3/4, 4/4, 5/4, 6/8, 7/8, etc.
- **Toggle on/off**: attiva/disattiva il click durante il playback

### Esempi Time Signature
- **4/4** (standard): 4 battiti per battuta - **forte**, debole, medio, debole
- **3/4** (valzer): 3 battiti per battuta - **forte**, debole, debole
- **6/8**: 6 battiti per battuta - **forte**, debole, debole, medio, debole, debole
- **5/4** (Take Five): 5 battiti per battuta - **forte**, debole, debole, medio, debole
- **7/8**: 7 battiti per battuta - **forte**, debole, debole, debole, medio, debole, debole

## 📖 Guida Rapida Simboli Musicali

### Triadi
- `C` - Maggiore
- `Cm` - Minore
- `C+` o `Caug` - Aumentato
- `C°` o `Cdim` - Diminuito

### Settime
- `C7` - Settima di dominante
- `Cmaj7` o `C△` - Settima maggiore
- `Cm7` - Settima minore
- `C7sus4` - Settima sospesa

### Alterazioni
- `C#m` - Do diesis minore
- `Bb7` - Si bemolle settima
- `F#m7b5` - Fa diesis minore settima con quinta bemolle

## 🎯 Best Practices

1. **Nomenclatura chiara**: Usa nomi descrittivi per i titoli
2. **Coerenza**: Mantieni lo stesso stile di notazione
3. **Struttura**: Dividi strofe, ritornelli, bridge con sezioni [Intro] [Verse] [Chorus]
4. **Playlist**: Organizza le canzoni per set/concerti
5. **Backup**: Esporta regolarmente charts e playlist
6. **Mobile**: Usa l'app sul tablet durante le prove con autoscroll!
7. **Playback**: Usa il metronomo per esercitarti a tempo
8. **Condivisione**: Esporta playlist per condividerle con la band

## 🐛 Troubleshooting

### Le charts non si salvano
- Controlla che il browser abbia localStorage abilitato
- Prova a pulire la cache
- Verifica lo spazio disponibile nel browser

### Anteprima non si aggiorna
- Ricarica la pagina (F5)
- Controlla la console per errori JavaScript

### Export non funziona
- Alcuni browser bloccano download automatici
- Controlla i permessi del browser
- Prova con un browser diverso

## 📄 Licenza

Questo progetto è open source e libero da usare come preferisci!

## 🤝 Contributi

Sentiti libero di:
- Migliorare il parser
- Aggiungere nuove funzionalità
- Ottimizzare il design
- Correggere bug

---

**Buona musica! 🎸🎹🎵**

