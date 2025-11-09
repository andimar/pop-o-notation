<?php
/**
 * POST /api/playlists/create.php
 * Crea nuova playlist
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $data = getJsonInput();
    
    if (empty($data['name'])) {
        errorResponse('Playlist name is required');
    }
    
    $controller = new PlaylistController();
    $playlist = $controller->createPlaylist(
        $user['id'], 
        $data['name'], 
        $data['description'] ?? ''
    );
    
    successResponse($playlist, 'Playlist created successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

