# 🎼 Simboli Accordi - Guida Completa

## 🎯 Simboli Disponibili

### Simboli Principali

| Simbolo | Nome | Significato | Esempio | Note |
|---------|------|-------------|---------|------|
| `△` | Delta/Triangle | Settima Maggiore | `C△` = CMaj7 | Notazione jazz standard |
| `°` | Cerchio | Diminuito | `C°` = Cdim | Triade diminuita |
| `ø` | Cerchio barrato | Semidiminuito | `Cø` = Cm7b5 | Half-diminished |
| `+` | Più | Aumentato | `C+` = Caug | Triade aumentata |
| `♯` | Diesis | Altera nota +1 | `C♯` = C# | Mezzo tono sopra |
| `♭` | Bemolle | Altera nota -1 | `D♭` = Db | Mezzo tono sotto |

---

## 📚 Tipi di Accordi

### Triadi Base

```
C           = Do maggiore (C-E-G)
Cm          = Do minore (C-Eb-G)
C+  o Caug  = Do aumentato (C-E-G#)
C°  o Cdim  = Do diminuito (C-Eb-Gb)
```

### Accordi con Settima

```
C7          = Do settima dominante (C-E-G-Bb)
C△  o CMaj7 = Do settima maggiore (C-E-G-B)
Cm7         = Do minore settima (C-Eb-G-Bb)
Cø  o Cm7b5 = Do semidiminuito (C-Eb-Gb-Bb)
C°7 o Cdim7 = Do diminuito settima (C-Eb-Gb-Bbb)
```

### Accordi Sospesi

```
Csus4       = Do sospeso quarta (C-F-G)
Csus2       = Do sospeso seconda (C-D-G)
C7sus4      = Do settima sospesa (C-F-G-Bb)
```

### Accordi con Sesta

```
C6          = Do con sesta (C-E-G-A)
Cm6         = Do minore con sesta (C-Eb-G-A)
C6/9        = Do con sesta e nona (C-E-G-A-D)
```

### Accordi con None, Undicesime, Tredicesime

```
C9          = Do nona (C-E-G-Bb-D)
CMaj9       = Do maggiore nona (C-E-G-B-D)
Cm9         = Do minore nona (C-Eb-G-Bb-D)
C11         = Do undicesima (C-E-G-Bb-D-F)
C13         = Do tredicesima (C-E-G-Bb-D-F-A)
```

### Alterazioni

```
C7#5        = Do settima quinta aumentata
C7b5        = Do settima quinta bemolle
C7#9        = Do settima nona diesis
C7b9        = Do settima nona bemolle
CMaj7#11    = Do maggiore settima undicesima diesis
```

### Accordi Aggiunti

```
Cadd9       = Do con nona aggiunta (C-E-G-D)
Cadd11      = Do con undicesima aggiunta
Cm(add9)    = Do minore con nona aggiunta
```

### Slash Chords (Bassi Alternativi)

```
C/E         = Do con mi al basso (primo rivolto)
C/G         = Do con sol al basso (secondo rivolto)
Dm7/G       = Re minore settima con sol al basso
G7/B        = Sol settima con si al basso
```

---

## 🎹 Simboli Equivalenti

Alcune notazioni hanno simboli equivalenti:

| Simbolo 1 | Simbolo 2 | Simbolo 3 | Accordo |
|-----------|-----------|-----------|---------|
| `△` | `Maj7` | `maj7` / `Major7` | Settima maggiore |
| `°` | `dim` | `Dim` | Diminuito |
| `ø` | `m7b5` | `M7b5` | Semidiminuito |
| `+` | `aug` | `Aug` | Aumentato |
| `-` | `m` / `min` | `Min` | Minore |

> **📝 Nota Importante:** Il parser è **case-insensitive** per i tipi di accordi!  
> `EbMaj7`, `Ebmaj7`, `EbMAJ7`, `Eb△` sono tutti **equivalenti** e suonano **identici**.  
> Questo vale per tutti i tipi: `M`, `m`, `Min`, `min`, `Maj7`, `maj7`, etc.

---

## 🎼 Esempi con Helper

### Come Usare i Bottoni

1. **Scrivi la nota base**: `C`
2. **Clicca il simbolo**: `△ Maj7`
3. **Risultato**: `C△`

Oppure:

1. **Scrivi**: `D`
2. **Clicca**: `♯ #`
3. **Risultato**: `D♯`

### Esempi Comuni

```
C△          → CMaj7 (settima maggiore)
Dm7b5       → Dø (semidiminuito)
F♯m7        → F#m7 (Fa diesis minore settima)
B♭7         → Bb7 (Si bemolle settima)
G+          → Gaug (Sol aumentato)
```

---

## 🎵 Notazioni Jazz Standard

Nel jazz, è comune usare i simboli invece delle lettere:

**Invece di scrivere:**
```
CMaj7 | Dm7 | G7 | CMaj7
```

**Si scrive spesso:**
```
C△ | Dm7 | G7 | C△
```

### Progressione II-V-I

**Standard:**
```
Dm7 | G7 | CMaj7
```

**Con simboli:**
```
Dm7 | G7 | C△
```

### Progressione con Semidiminuiti

**Standard:**
```
Bm7b5 | E7 | Am7
```

**Con simboli:**
```
Bø | E7 | Am7
```

---

## 🔠 Alterazioni: # vs ♯ e b vs ♭

Entrambe le notazioni funzionano:

### Diesis
- `C#` o `C♯` → Do diesis
- `F#m7` o `F♯m7` → Fa diesis minore settima

### Bemolle
- `Bb` o `B♭` → Si bemolle
- `Ebmaj7` o `E♭maj7` → Mi bemolle maggiore settima

**I simboli musicali (`♯` `♭`) sono più eleganti ma opzionali!**

---

## 📊 Tabella Completa Intervalli

### Triadi
| Nome | Formula | Esempio (C) |
|------|---------|-------------|
| Maggiore | 1-3-5 | C-E-G |
| Minore | 1-♭3-5 | C-E♭-G |
| Aumentato | 1-3-♯5 | C-E-G♯ |
| Diminuito | 1-♭3-♭5 | C-E♭-G♭ |
| Sospeso 4 | 1-4-5 | C-F-G |
| Sospeso 2 | 1-2-5 | C-D-G |

### Accordi a Quattro Note
| Nome | Formula | Esempio (C) |
|------|---------|-------------|
| Settima Dom. | 1-3-5-♭7 | C-E-G-B♭ |
| Settima Magg. | 1-3-5-7 | C-E-G-B |
| Minore Sett. | 1-♭3-5-♭7 | C-E♭-G-B♭ |
| Semidiminuito | 1-♭3-♭5-♭7 | C-E♭-G♭-B♭ |
| Diminuito Sett. | 1-♭3-♭5-♭♭7 | C-E♭-G♭-B♭♭ |
| Min. Magg. Sett. | 1-♭3-5-7 | C-E♭-G-B |

---

## 💡 Tips & Tricks

### 1. Usa Simboli Unicode per Eleganza

**Prima:**
```
CMAj7 Dm7b5 G7 CMaj7
```

**Dopo:**
```
C△ Dø G7 C△
```

### 2. Slash Chords per Bassi Walking

```
[Walking Bass]
C/E | Dm7/F | G7/B | C/E
```

### 3. Accordi Polychord

```
Dm7/G = Polychord (G con Dm7 sopra)
```

### 4. Alterazioni Multiple

```
C7#5#9  = Do settima quinta aumentata nona diesis
C7b5b9  = Do settima quinta bemolle nona bemolle
```

---

## 🎯 Scorciatoie Tastiera

I bottoni helper sono comodi, ma puoi anche:

1. **Copia-Incolla** dai simboli qui sotto:
   ```
   △ ° ø + ♯ ♭
   ```

2. **Windows**: Mappa caratteri (charmap)
3. **Mac**: ⌥⌘T per caratteri speciali
4. **Linux**: Character Map

---

## 📖 Riferimenti Teorici

### Gradi della Scala

In tonalità di Do maggiore:

```
I    = C     (tonica)
ii   = Dm    (sopratonica)
iii  = Em    (mediante)
IV   = F     (sottodominante)
V    = G     (dominante)
vi   = Am    (sopradominante/relativa minore)
vii° = Bdim  (sensibile)
```

### Tensioni Disponibili

| Accordo | Tensioni Disponibili | Evita |
|---------|---------------------|-------|
| Maj7 | 9, #11, 13 | nessuna |
| m7 | 9, 11 | 13 |
| 7 | 9, 13 | 11 |
| m7b5 | 11, b13 | 9 |
| dim7 | - | tutte |

---

## 🎵 Esempi di Chart con Simboli

### Jazz Standard
```
Autumn Leaves - Joseph Kosma - 140bpm

[A Section]
Cm7 | F7 | B♭△ | E♭△
Am7♭5 | D7 | Gm | Gm

[B Section]  
Am7♭5 | D7 | Gm | Gm
Cm7 | F7 | B♭△ | E♭△
```

### Bossa Nova
```
Girl from Ipanema - Jobim - 140bpm

[A Section]
F△ | F△ | G7 | G7
Gm7 | G♭7 | F△ | F△

[B Section]
F♯△ | F♯△ | B7 | B7
F♯m7 | B7 | Em7 | A7
```

---

## 🎓 Quiz Veloce

### Cosa significano?

1. `C△` = ?
2. `Dø` = ?
3. `E♭m7` = ?
4. `F+` = ?
5. `G°7` = ?

**Risposte:**
1. CMaj7 (Do settima maggiore)
2. Dm7b5 (Re semidiminuito)
3. Ebm7 (Mi bemolle minore settima)
4. Faug (Fa aumentato)
5. Gdim7 (Sol diminuito settima)

---

## 🚀 Prossimi Passi

1. **Prova i bottoni** nell'editor
2. **Copia esempi** da questa guida
3. **Sperimenta** con simboli diversi
4. **Ascolta** come suonano gli accordi
5. **Condividi** le tue progressioni!

---

**Simboli = Leggibilità + Eleganza! 🎼✨**

