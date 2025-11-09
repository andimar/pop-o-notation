<?php
/**
 * GET /api/charts/list.php
 * GET /api/charts/list.php?id=123 (singola chart)
 * Lista tutte le charts o una specifica
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $controller = new ChartController();
    
    // Se c'è ID, ritorna singola chart
    if (!empty($_GET['id'])) {
        $chart = $controller->getChart($_GET['id'], $user['id']);
        successResponse($chart);
    } else {
        // Altrimenti lista tutte
        $charts = $controller->getCharts($user['id']);
        successResponse($charts);
    }
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 401);
}

