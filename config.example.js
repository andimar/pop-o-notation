/**
 * Esempi di Configurazione per Diversi Scenari
 * 
 * Copia config.js e modifica secondo il tuo scenario
 */

// ============================================
// SCENARIO 1: Auto-detect (Consigliato)
// ============================================
// L'app rileva automaticamente dove si trova
const AppConfig = {
    projectPath: 'auto',
    apiBaseURL: '',
    debug: false
};

// ============================================
// SCENARIO 2: Progetto in sottocartella
// ============================================
// Se il tuo progetto è in https://www.andimar.net/notation/
/*
const AppConfig = {
    projectPath: '/notation',  // ← Il tuo path
    apiBaseURL: '',
    debug: true  // Abilita per vedere info in console
};
*/

// ============================================
// SCENARIO 3: Progetto nella root
// ============================================
// Se il tuo progetto è in https://www.andimar.net/
/*
const AppConfig = {
    projectPath: '',  // Stringa vuota per root
    apiBaseURL: '',
    debug: false
};
*/

// ============================================
// SCENARIO 4: API su dominio/server diverso
// ============================================
// Se le API sono su un altro server
/*
const AppConfig = {
    projectPath: '',
    apiBaseURL: 'https://api.tuodominio.com/api',  // URL completo
    debug: false
};
*/

// ============================================
// SCENARIO 5: Debug - per capire problemi
// ============================================
// Usa questo per vedere cosa sta succedendo
/*
const AppConfig = {
    projectPath: 'auto',
    apiBaseURL: '',
    debug: true  // Vedi messaggi in console (F12)
};
*/

// ============================================
// SCENARIO 6: Percorso complesso
// ============================================
// Progetto in: https://www.andimar.net/progetti/chord/app/
/*
const AppConfig = {
    projectPath: '/progetti/chord/app',
    apiBaseURL: '',
    debug: true
};
*/

// Export
window.AppConfig = AppConfig;

