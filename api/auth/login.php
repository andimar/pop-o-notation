<?php
/**
 * POST /api/auth/login.php
 * Login utente
 */

require_once '../config.php';

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

