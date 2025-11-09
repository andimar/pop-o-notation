<?php
/**
 * Script di verifica PHP e estensioni richieste
 */

echo "=== Verifica Configurazione PHP ===\n\n";

// Versione PHP
echo "✓ Versione PHP: " . PHP_VERSION . "\n";

if (version_compare(PHP_VERSION, '7.4.0') < 0) {
    echo "  ⚠️  ATTENZIONE: Richiesta versione PHP >= 7.4\n";
}

echo "\n--- Estensioni Richieste ---\n\n";

$required = [
    'pdo' => 'PDO (PHP Data Objects)',
    'pdo_sqlite' => 'PDO SQLite Driver',
    'json' => 'JSON',
    'mbstring' => 'Multibyte String',
    'openssl' => 'OpenSSL (per JWT)'
];

$missing = [];
$ok = true;

foreach ($required as $ext => $description) {
    if (extension_loaded($ext)) {
        echo "✅ $description ($ext)\n";
    } else {
        echo "❌ $description ($ext) - MANCANTE!\n";
        $missing[] = $ext;
        $ok = false;
    }
}

echo "\n--- Configurazione ---\n\n";

echo "display_errors: " . ini_get('display_errors') . "\n";
echo "error_reporting: " . ini_get('error_reporting') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "s\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";

if (!$ok) {
    echo "\n=== ❌ ESTENSIONI MANCANTI ===\n\n";
    
    if (PHP_OS_FAMILY === 'Windows') {
        echo "WINDOWS - Modifica php.ini:\n\n";
        echo "1. Trova il file php.ini:\n";
        echo "   php --ini\n\n";
        echo "2. Apri php.ini e rimuovi il ';' da queste righe:\n";
        foreach ($missing as $ext) {
            echo "   ;extension=$ext  ->  extension=$ext\n";
        }
        echo "\n3. Riavvia il server PHP\n";
    } else {
        echo "LINUX/MAC - Installa le estensioni:\n\n";
        echo "Ubuntu/Debian:\n";
        echo "  sudo apt install php-sqlite3 php-mbstring php-json\n\n";
        echo "macOS (Homebrew):\n";
        echo "  brew install php\n";
        echo "  # Le estensioni sono già incluse\n";
    }
} else {
    echo "\n=== ✅ TUTTO OK! ===\n";
    echo "\nIl tuo PHP è configurato correttamente.\n";
    echo "Puoi avviare il server con:\n";
    if (PHP_OS_FAMILY === 'Windows') {
        echo "  start-server.bat\n";
    } else {
        echo "  ./start-server.sh\n";
    }
}

echo "\n";

