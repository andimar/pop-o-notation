<?php
/**
 * GET /api/auth/me.php
 * Info utente corrente
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    successResponse($user);
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 401);
}

