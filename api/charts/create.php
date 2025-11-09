<?php
/**
 * POST /api/charts/create.php
 * Crea nuova chart
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $data = getJsonInput();
    
    $controller = new ChartController();
    $chart = $controller->createChart($user['id'], $data);
    
    successResponse($chart, 'Chart created successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

