<?php
/**
 * Charts Endpoints
 */

$controller = new ChartController();
$chartId = $segments[1] ?? null;

switch ($requestMethod) {
    case 'GET':
        if ($chartId) {
            // Get single chart
            $chart = $controller->getById($chartId);
            successResponse($chart);
        } else {
            // Get all charts
            $charts = $controller->getAll();
            successResponse($charts);
        }
        break;
        
    case 'POST':
        // Create new chart
        $data = getJsonInput();
        $chart = $controller->create($data);
        successResponse($chart, 'Chart created successfully');
        break;
        
    case 'PUT':
        // Update chart
        if (!$chartId) {
            errorResponse('Chart ID is required');
        }
        
        $data = getJsonInput();
        $chart = $controller->update($chartId, $data);
        successResponse($chart, 'Chart updated successfully');
        break;
        
    case 'DELETE':
        // Delete chart
        if (!$chartId) {
            errorResponse('Chart ID is required');
        }
        
        $result = $controller->delete($chartId);
        successResponse($result, 'Chart deleted successfully');
        break;
        
    default:
        errorResponse('Method not allowed', 405);
}

