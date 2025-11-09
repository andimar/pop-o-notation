<?php
/**
 * Test diretto dell'API - bypassa .htaccess
 */

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'API è raggiungibile!',
    'php_version' => PHP_VERSION,
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_sqlite' => extension_loaded('pdo_sqlite'),
        'json' => extension_loaded('json'),
    ]
], JSON_PRETTY_PRINT);

