<?php
/**
 * Endpoint diretto per registrazione (senza routing)
 * Usa questo se .htaccess non funziona
 */

require_once 'config.php';

// Solo POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $data = getJsonInput();
    
    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        errorResponse('Username, email and password are required');
    }
    
    $auth = new Auth();
    $result = $auth->register($data['username'], $data['email'], $data['password']);
    
    successResponse($result, 'User registered successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

