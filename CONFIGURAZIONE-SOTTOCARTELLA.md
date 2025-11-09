# 📁 Configurazione per Progetto in Sottocartella

## Problema Risolto

Se il tuo progetto NON è nella root del dominio, ma in una sottocartella, le API devono essere configurate correttamente.

### Esempi:

#### ❌ Root del dominio:
```
https://www.andimar.net/
https://www.andimar.net/index.html
https://www.andimar.net/api/auth/register.php
```

#### ✅ Sottocartella:
```
https://www.andimar.net/notation/
https://www.andimar.net/notation/index.html
https://www.andimar.net/notation/api/auth/register.php
                        ^^^^^^^^^ ← questa è la sottocartella
```

---

## 🔧 Come Configurare

### Metodo 1: Auto-detect (Consigliato)

**Non fare nulla!** 

Il sistema rileva automaticamente il percorso dal browser.

Se il tuo `index.html` è in `/notation/`, le API saranno automaticamente chiamate a `/notation/api/...`

---

### Metodo 2: Configurazione Manuale

Se l'auto-detect non funziona, configura manualmente:

#### 1. Apri `config.js`

#### 2. Modifica `projectPath`:

```javascript
const AppConfig = {
    projectPath: '/notation',  // ← Cambia 'auto' con il tuo path
    // ...
};
```

**Esempi:**

```javascript
// Progetto nella root
projectPath: ''

// Progetto in /notation/
projectPath: '/notation'

// Progetto in /progetti/chordchart/
projectPath: '/progetti/chordchart'
```

**IMPORTANTE:** 
- ✅ Inizia con `/`
- ❌ NON mettere `/` alla fine
- ✅ Rispetta maiuscole/minuscole

---

### Metodo 3: URL Completo (per API su dominio diverso)

Se le tue API sono su un dominio/server diverso:

```javascript
const AppConfig = {
    apiBaseURL: 'https://api.tuodominio.com/api',
    // ...
};
```

---

## 🧪 Test della Configurazione

### 1. Abilita il Debug

In `config.js`:

```javascript
const AppConfig = {
    projectPath: 'auto',
    debug: true  // ← Abilita debug
};
```

### 2. Apri la Console del Browser

Premi `F12` e vai nella tab "Console"

### 3. Ricarica la pagina

Dovresti vedere:

```
🔧 API Client initialized
📍 Base URL: /notation/api
```

Verifica che il Base URL sia corretto!

---

## ✅ Verifica che Funzioni

### Test 1: Verifica il path

Apri la console del browser e scrivi:

```javascript
console.log(window.AppConfig.projectPath);
```

Dovrebbe mostrare il tuo path.

### Test 2: Testa l'API

Apri nel browser (sostituisci `notation` con la tua sottocartella):

```
https://www.andimar.net/notation/api/test.php
```

Dovresti vedere JSON con `"success": true`.

### Test 3: Prova la registrazione

Apri:

```
https://www.andimar.net/notation/api/test-auth.php
```

Usa il form per registrarti.

---

## 🐛 Troubleshooting

### Problema: "API not found" o 404

**Causa:** Il path non è configurato correttamente.

**Soluzione:**

1. Verifica il path reale del progetto sul server
2. Imposta manualmente in `config.js`:
   ```javascript
   projectPath: '/tua-sottocartella'
   ```
3. Ricarica la pagina con `Ctrl+F5`

---

### Problema: Le API chiamano la root invece della sottocartella

**Causa:** Il file `config.js` non è caricato per primo.

**Soluzione:**

Verifica in `index.html` che `config.js` sia il PRIMO script:

```html
<script src="config.js"></script>  <!-- ← Deve essere PRIMO -->
<script src="audio-player.js"></script>
<script src="playlist-manager.js"></script>
<script src="api-client.js"></script>
...
```

---

### Problema: Auto-detect non funziona

**Causa:** Stai aprendo il file direttamente (`file://`) invece che tramite server web.

**Soluzione:**

1. Usa un server web (anche locale)
2. Oppure imposta manualmente il path:
   ```javascript
   projectPath: '/notation'
   ```

---

## 📝 Esempi Completi

### Esempio 1: Progetto in `/notation/` (Auto-detect)

`config.js`:
```javascript
const AppConfig = {
    projectPath: 'auto',  // Auto-detect
    apiBaseURL: '',
    debug: false
};
```

Risultato:
- Index: `https://www.andimar.net/notation/index.html`
- API: `https://www.andimar.net/notation/api/auth/register.php` ✅

---

### Esempio 2: Progetto in `/chordchart/` (Manuale)

`config.js`:
```javascript
const AppConfig = {
    projectPath: '/chordchart',
    apiBaseURL: '',
    debug: true
};
```

Risultato:
- Index: `https://www.andimar.net/chordchart/index.html`
- API: `https://www.andimar.net/chordchart/api/auth/register.php` ✅

---

### Esempio 3: Root del dominio

`config.js`:
```javascript
const AppConfig = {
    projectPath: '',  // Stringa vuota per root
    apiBaseURL: '',
    debug: false
};
```

Risultato:
- Index: `https://www.andimar.net/index.html`
- API: `https://www.andimar.net/api/auth/register.php` ✅

---

### Esempio 4: API su dominio diverso

`config.js`:
```javascript
const AppConfig = {
    projectPath: '',
    apiBaseURL: 'https://api.andimar.net',  // Dominio diverso
    debug: false
};
```

Risultato:
- Index: `https://www.andimar.net/notation/index.html`
- API: `https://api.andimar.net/auth/register.php` ✅

---

## 🎯 Checklist Finale

Prima di andare in produzione:

- [ ] Il progetto è nella sottocartella corretta sul server
- [ ] Ho configurato `projectPath` in `config.js` (oppure 'auto')
- [ ] Ho testato `/tua-sottocartella/api/test.php` nel browser
- [ ] Il test restituisce JSON con `"success": true`
- [ ] Ho provato la registrazione da `/tua-sottocartella/api/test-auth.php`
- [ ] Ho disabilitato il debug: `debug: false`
- [ ] Ho testato la registrazione dall'app

---

## 📚 File Coinvolti

- `config.js` - Configurazione globale (NUOVO)
- `api-client.js` - Client API (modificato per usare config.js)
- `index.html` - Carica config.js per primo
- `api/test.php` - Per testare che PHP funzioni
- `api/test-auth.php` - Per testare la registrazione

---

## 🎉 Fatto!

Ora il progetto funziona correttamente anche se è in una sottocartella! 🚀

