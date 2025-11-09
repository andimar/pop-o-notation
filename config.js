/**
 * Configurazione Globale dell'Applicazione
 * 
 * Modifica questo file per configurare l'app secondo il tuo ambiente
 */

const AppConfig = {
    /**
     * Path del progetto sul server
     * 
     * Esempi:
     * - Se il progetto è in: https://www.andimar.net/ 
     *   → projectPath: ''
     * 
     * - Se il progetto è in: https://www.andimar.net/notation/
     *   → projectPath: '/notation'
     * 
     * - Se il progetto è in: https://www.andimar.net/progetti/chordchart/
     *   → projectPath: '/progetti/chordchart'
     * 
     * IMPORTANTE: NON mettere lo slash finale!
     * 
     * Lascia 'auto' per rilevamento automatico
     */
    projectPath: 'auto', // 'auto' oppure '/notation' oppure '' per root
    
    /**
     * URL completo delle API (opzionale)
     * Se vuoi specificare un URL completo invece che relativo
     * 
     * Esempio: 'https://api.tuodominio.com/api'
     * 
     * Se vuoto, usa projectPath + '/api'
     */
    apiBaseURL: '',
    
    /**
     * Modalità debug
     * Se true, mostra informazioni di debug nella console
     */
    debug: false
};

// Export per uso in altri file
window.AppConfig = AppConfig;

