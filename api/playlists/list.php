<?php
/**
 * GET /api/playlists/list.php
 * GET /api/playlists/list.php?id=123
 * Lista tutte le playlist o una specifica
 */

require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse('Method not allowed', 405);
}

try {
    $auth = new Auth();
    $user = $auth->getCurrentUser();
    
    $controller = new PlaylistController();
    
    if (!empty($_GET['id'])) {
        $playlist = $controller->getPlaylist($_GET['id'], $user['id']);
        successResponse($playlist);
    } else {
        $playlists = $controller->getPlaylists($user['id']);
        successResponse($playlists);
    }
    
} catch (Exception $e) {
    errorResponse($e->getMessage(), 401);
}

