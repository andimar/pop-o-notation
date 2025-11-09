<?php
/**
 * Endpoint diretto per login (senza routing)
 * Usa questo se .htaccess non funziona
 */

require_once 'config.php';

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $data = getJsonInput();
    
    if (empty($data['username']) || empty($data['password'])) {
        errorResponse('Username and password are required');
    }
    
    $auth = new Auth();
    $result = $auth->login($data['username'], $data['password']);
    
    successResponse($result, 'Login successful');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

