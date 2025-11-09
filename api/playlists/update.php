<?php
/**
 * POST /api/playlists/update.php?id=123
 * Aggiorna playlist
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $playlistId = $_GET['id'] ?? null;
    
    if (!$playlistId) {
        errorResponse('Playlist ID required');
    }
    
    $data = getJsonInput();
    
    $controller = new PlaylistController();
    $playlist = $controller->updatePlaylist(
        $playlistId, 
        $user['id'], 
        $data['name'] ?? null, 
        $data['description'] ?? null
    );
    
    successResponse($playlist, 'Playlist updated successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

