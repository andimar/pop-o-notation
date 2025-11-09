<?php
/**
 * Endpoint diretto per eliminare chart (senza routing)
 * Usa: chart-delete.php?id=123
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $user = (new Auth())->getCurrentUser();
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

