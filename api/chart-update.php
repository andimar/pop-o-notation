<?php
/**
 * Endpoint diretto per aggiornare chart (senza routing)
 * Usa: chart-update.php?id=123
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $user = (new Auth())->getCurrentUser();
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

