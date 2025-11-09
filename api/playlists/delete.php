<?php
/**
 * POST /api/playlists/delete.php?id=123
 * Elimina playlist
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $playlistId = $_GET['id'] ?? null;
    
    if (!$playlistId) {
        errorResponse('Playlist ID required');
    }
    
    $controller = new PlaylistController();
    $controller->deletePlaylist($playlistId, $user['id']);
    
    successResponse(['deleted' => true], 'Playlist deleted successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

