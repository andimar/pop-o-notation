<?php
/**
 * ChordChart API - Main Router
 */

require_once 'config.php';

// Parse request
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Remove query string and base path
$requestUri = strtok($requestUri, '?');
$requestUri = str_replace('/api', '', $requestUri);
$requestUri = trim($requestUri, '/');

// Split path into segments
$segments = explode('/', $requestUri);
$endpoint = $segments[0] ?? 'index';

try {
    // Route to appropriate endpoint
    switch ($endpoint) {
        case '':
        case 'index':
            successResponse([
                'name' => 'ChordChart API',
                'version' => API_VERSION,
                'status' => 'running',
                'endpoints' => [
                    'POST /auth/register' => 'Register new user',
                    'POST /auth/login' => 'Login user',
                    'GET /auth/me' => 'Get current user',
                    'GET /charts' => 'Get all charts',
                    'GET /charts/{id}' => 'Get single chart',
                    'POST /charts' => 'Create chart',
                    'PUT /charts/{id}' => 'Update chart',
                    'DELETE /charts/{id}' => 'Delete chart',
                    'GET /playlists' => 'Get all playlists',
                    'GET /playlists/{id}' => 'Get single playlist',
                    'POST /playlists' => 'Create playlist',
                    'PUT /playlists/{id}' => 'Update playlist',
                    'DELETE /playlists/{id}' => 'Delete playlist',
                    'POST /playlists/{id}/songs' => 'Add song to playlist',
                    'DELETE /playlists/{id}/songs/{chartId}' => 'Remove song from playlist',
                    'PUT /playlists/{id}/reorder' => 'Reorder playlist songs'
                ]
            ]);
            break;
            
        case 'auth':
            require 'endpoints/auth.php';
            break;
            
        case 'charts':
            require 'endpoints/charts.php';
            break;
            
        case 'playlists':
            require 'endpoints/playlists.php';
            break;
            
        default:
            errorResponse('Endpoint not found', 404);
    }
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 500);
}

