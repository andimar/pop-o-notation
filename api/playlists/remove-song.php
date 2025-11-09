<?php
/**
 * POST /api/playlists/remove-song.php?id=123&chart_id=456
 * Rimuove una chart dalla playlist
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $playlistId = $_GET['id'] ?? null;
    $chartId = $_GET['chart_id'] ?? null;
    
    if (!$playlistId) {
        errorResponse('Playlist ID required');
    }
    
    if (!$chartId) {
        errorResponse('Chart ID required');
    }
    
    $controller = new PlaylistController();
    $controller->removeSong($playlistId, $user['id'], $chartId);
    
    successResponse(['removed' => true], 'Song removed from playlist');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

