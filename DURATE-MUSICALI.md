# 🎵 Durate Musicali - Documentazione Completa

## ✅ Implementazione Completata!

Ho aggiunto il supporto completo per le **durate musicali** e le **pause** nella tua app ChordChart!

---

## 🎼 Sintassi

### Valori delle Note
Aggiungi una lettera dopo l'accordo per specificare la durata:

| Simbolo | Nome | Durata (battiti) | Simbolo Musicale |
|---------|------|------------------|------------------|
| `w` | Whole (Semibreve) | 4 | 𝅝 |
| `h` | Half (Minima) | 2 | 𝅗𝅥 |
| `q` | Quarter (Semiminima) | 1 | ♩ |
| `e` | Eighth (Croma) | 0.5 | ♪ |
| `s` | Sixteenth (Semicroma) | 0.25 | 𝅘𝅥𝅯 |

### Note Puntate
Aggiungi `.` dopo il simbolo di durata per aumentarla del 50%:

- `h.` = minima puntata (3 battiti) 𝅗𝅥.
- `q.` = semiminima puntata (1.5 battiti) ♩.
- `e.` = croma puntata (0.75 battiti) ♪.

### Pause (Rests)
Usa `-` o `r` seguito dalla durata:

- `-h` = pausa di 2 battiti
- `-q` = pausa di 1 battito
- `rw` = pausa di 4 battiti
- `re` = pausa di 0.5 battiti

---

## 📝 Esempi Pratici

### Esempio 1: Durate Basiche
```
My Song - Artist - 120bpm - 4/4

[Intro]
Cmaj7w | Dm7h G7h | Cmaj7q Am7q Dm7q G7q |
```

**Spiegazione:**
- `Cmaj7w` → Cmaj7 per tutta la battuta (4 battiti)
- `Dm7h G7h` → Dm7 per 2 battiti, poi G7 per 2 battiti
- `Cmaj7q Am7q Dm7q G7q` → Quattro accordi da 1 battito ciascuno

### Esempio 2: Con Pause
```
Ballad - Original - 60bpm

[Verse]
Cmaj7h -h | Dm7q G7q -h | Fmaj7w |
```

**Spiegazione:**
- `Cmaj7h -h` → Cmaj7 per 2 battiti, poi pausa per 2 battiti
- `Dm7q G7q -h` → Dm7 per 1, G7 per 1, pausa per 2
- `Fmaj7w` → Fmaj7 per tutta la battuta

### Esempio 3: Note Puntate
```
Jazz Waltz - Original - 180bpm - 3/4

[A Section]
Cmaj7h. | Dm7q G7h | Em7h. |
```

**Spiegazione (in 3/4):**
- `Cmaj7h.` → Cmaj7 per tutta la battuta (3 battiti)
- `Dm7q G7h` → Dm7 per 1 battito, G7 per 2 battiti

### Esempio 4: Ritmi Sincopati
```
Funk Groove - Original - 110bpm

[Groove]
Am7q -e Dm7e | G7q Cmaj7q. Fmaje | Em7q -q Am7h |
```

**Spiegazione:**
- Crome e pause per creare groove sincopato
- Mix di durate diverse per ritmo interessante

---

## 🎯 Cosa Funziona

### ✅ Parser
- Riconosce tutte le durate (w, h, q, e, s)
- Supporta note puntate (.)
- Gestisce pause (-, r)
- **Retrocompatibilità completa** con sintassi vecchia

### ✅ Preview
- Mostra simboli musicali Unicode accanto agli accordi
- Visualizza pause con simbolo 𝄽
- Colori diversi per accordi e pause
- Layout pulito e leggibile

### ✅ Audio Player
- Suona gli accordi per la durata specificata
- Rispetta le pause (nessun suono)
- Click/metronomo sincronizzato
- Highlighting delle battute durante la riproduzione

### ✅ Player Mode (Vista Performance)
- Mostra durate anche in fullscreen
- Supporto completo per playlist
- Autoscroll sincronizzato

### ✅ Helper Visuale
- Bottoni cliccabili per inserire durate
- Tooltips con spiegazione
- Inserimento rapido nel cursore

---

## 🔄 Retrocompatibilità

**Le tue chart esistenti continuano a funzionare!**

Senza durate specificate, gli accordi si dividono equamente la battuta:

```
Cmaj7 Dm7 | G7
```

È equivalente a (in 4/4):
```
Cmaj7h Dm7h | G7w
```

---

## 🎹 Come Usare

### Metodo 1: Scrivi Manualmente
```
Cmaj7h Dm7q G7q
```

### Metodo 2: Usa i Bottoni Helper
1. Scrivi l'accordo: `Cmaj7`
2. Clicca sul bottone durata: `𝅗𝅥 h`
3. Risultato: `Cmaj7h`

### Metodo 3: Copia dagli Esempi
Vedi `examples.md` per tantissimi esempi pronti!

---

## 📊 File Modificati

### JavaScript
- ✅ `app.js` - Parser con durate, rendering, helper visuale
- ✅ `audio-player.js` - Playback con durate corrette
- ✅ `player.js` - Vista performance con durate

### CSS
- ✅ `styles.css` - Stili per durate, pause, bottoni helper

### HTML
- ✅ `index.html` - Helper visuale con bottoni

### Documentazione
- ✅ `examples.md` - Esempi con durate
- ✅ `DURATE-MUSICALI.md` - Questa guida

---

## 💡 Tips & Tricks

### 1. Misura Tempi Complessi
```
Take Five - Dave Brubeck - 176bpm - 5/4

[Head]
Emq -q Emq -q -q | Emq -q Emq -q -q |
```

In 5/4, usa durate per gestire i 5 battiti.

### 2. Ballad con Respiro
```
Slow Ballad - Original - 50bpm

[Intro]
Cmaj7w | -w | Dm7w | -w |
```

Pause intere tra accordi per effetto drammatico.

### 3. Anticipazioni Jazz
```
Bebop - Original - 220bpm

[Changes]
Dm7q. G7e Cmaj7h | Am7e D7e Dm7h |
```

Note puntate e crome per anticipazioni.

### 4. Stop Time
```
Blues Stop - Original - 120bpm

[Stop Time]
C7q -q -h | C7q -q -h | F7q -q -h | C7q -q -h |
```

Un accordo e poi pausa = stop time classico.

---

## 🎓 Teoria Musicale

### In 4/4 (Common Time)
- 1 battuta = 4 semiminime (♩)
- `w` = 1 semibreve = 4 semiminime
- `h` = 1 minima = 2 semiminime
- `q` = 1 semiminima
- `e` = 1 croma = 0.5 semiminime
- `s` = 1 semicroma = 0.25 semiminime

### In 3/4 (Waltz Time)
- 1 battuta = 3 semiminime
- `h.` = minima puntata = 3 semiminime (tutta la battuta)
- `h` = minima = 2 semiminime
- `q` = semiminima = 1 semiminima

### Note Puntate
Una nota puntata dura il 150% della nota normale:
- `h.` = 3 battiti (2 × 1.5)
- `q.` = 1.5 battiti (1 × 1.5)
- `e.` = 0.75 battiti (0.5 × 1.5)

---

## 🐛 Troubleshooting

### Q: Gli accordi senza durata non suonano?
**A:** Gli accordi senza durata funzionano normalmente! Si dividono equamente la battuta.

### Q: Come faccio pause di durate strane?
**A:** Usa combinazioni: `-q -q` = 2 semiminime di pausa

### Q: Le mie vecchie chart sono rotte?
**A:** No! La retrocompatibilità è completa. Le vecchie chart funzionano esattamente come prima.

### Q: Posso mixare durate e non-durate?
**A:** Sì! `Cmaj7h Dm7 G7` è valido. Gli accordi senza durata si adattano.

---

## 🎉 Risultato

Ora hai un controllo totale sulla ritmica delle tue chord chart!

**Puoi:**
- ✅ Specificare durate precise per ogni accordo
- ✅ Aggiungere pause dove vuoi
- ✅ Creare ritmi sincopati e complessi
- ✅ Usare note puntate per feel swing
- ✅ Scrivere in qualsiasi time signature
- ✅ Ascoltare esattamente quello che hai scritto

**Tutto questo mantenendo:**
- ✅ Compatibilità con le chart esistenti
- ✅ Semplicità d'uso
- ✅ Visualizzazione chiara e professionale

---

## 📚 Prossimi Passi

1. **Prova gli esempi** in `examples.md`
2. **Sperimenta** con le durate nelle tue chart
3. **Ascolta** il playback per verificare il risultato
4. **Condividi** le tue creazioni!

---

Buon divertimento con le durate musicali! 🎵✨

