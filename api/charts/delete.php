<?php
/**
 * POST /api/charts/delete.php?id=123
 * Elimina chart
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $chartId = $_GET['id'] ?? null;
    
    if (!$chartId) {
        errorResponse('Chart ID required');
    }
    
    $controller = new ChartController();
    $controller->deleteChart($chartId, $user['id']);
    
    successResponse(['deleted' => true], 'Chart deleted successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

