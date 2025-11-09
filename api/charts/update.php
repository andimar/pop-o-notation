<?php
/**
 * POST /api/charts/update.php?id=123
 * Aggiorna chart esistente
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $chartId = $_GET['id'] ?? null;
    
    if (!$chartId) {
        errorResponse('Chart ID required');
    }
    
    $data = getJsonInput();
    
    $controller = new ChartController();
    $chart = $controller->updateChart($chartId, $user['id'], $data);
    
    successResponse($chart, 'Chart updated successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

