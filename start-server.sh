#!/bin/bash

echo "====================================="
echo "   ChordChart - Avvio Server"
echo "====================================="
echo ""

# Verifica PHP installato
if ! command -v php &> /dev/null; then
    echo "❌ ERRORE: PHP non trovato!"
    echo ""
    echo "Installa PHP:"
    echo "  Ubuntu/Debian: sudo apt install php php-sqlite3"
    echo "  macOS: brew install php"
    exit 1
fi

echo "✅ PHP trovato: $(php -r 'echo PHP_VERSION;')"
echo ""

# Setup database
echo "Inizializzazione database..."
cd api
php setup.php
cd ..
echo ""

# Avvia server
echo "Avvio server su http://localhost:8000"
echo ""
echo "Premi Ctrl+C per fermare il server"
echo ""

php -S localhost:8000

