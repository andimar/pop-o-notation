<?php
/**
 * Setup Script - Inizializza il database e verifica la configurazione
 */

require_once 'config.php';

echo "=== ChordChart API Setup ===\n\n";

try {
    // Test database connection
    echo "1. Connessione al database...\n";
    $db = Database::getInstance();
    echo "   ✅ Database connesso e tabelle create!\n\n";
    
    // Check database file
    echo "2. Verifica file database...\n";
    if (file_exists(DB_PATH)) {
        echo "   ✅ Database file: " . DB_PATH . "\n";
        echo "   📊 Dimensione: " . filesize(DB_PATH) . " bytes\n\n";
    }
    
    // Test Auth class
    echo "3. Test classe Auth...\n";
    $auth = new Auth();
    echo "   ✅ Classe Auth caricata correttamente\n\n";
    
    echo "=== Setup completato con successo! ===\n\n";
    echo "Per avviare il server di sviluppo:\n";
    echo "  php -S localhost:8000\n\n";
    echo "Poi apri il browser su: http://localhost:8000\n\n";
    
} catch (Exception $e) {
    echo "❌ ERRORE: " . $e->getMessage() . "\n";
    exit(1);
}

