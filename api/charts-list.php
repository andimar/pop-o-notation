<?php
/**
 * Endpoint diretto per lista charts (senza routing)
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    $user = (new Auth())->getCurrentUser();
    $controller = new ChartController();
    $charts = $controller->getCharts($user['id']);
    
    successResponse($charts);
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 401);
}

