<?php
/**
 * POST /api/playlists/add-song.php?id=123
 * Aggiunge una chart alla playlist
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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
    
    if (empty($data['chart_id'])) {
        errorResponse('Chart ID required');
    }
    
    $controller = new PlaylistController();
    $result = $controller->addSong($playlistId, $user['id'], $data['chart_id']);
    
    successResponse($result, 'Song added to playlist');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

