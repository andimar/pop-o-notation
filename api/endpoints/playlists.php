<?php
/**
 * Playlists Endpoints
 */

$controller = new PlaylistController();
$playlistId = $segments[1] ?? null;
$action = $segments[2] ?? null;
$chartId = $segments[3] ?? null;

switch ($requestMethod) {
    case 'GET':
        if ($playlistId) {
            // Get single playlist with songs
            $playlist = $controller->getById($playlistId);
            successResponse($playlist);
        } else {
            // Get all playlists
            $playlists = $controller->getAll();
            successResponse($playlists);
        }
        break;
        
    case 'POST':
        if ($playlistId && $action === 'songs') {
            // Add song to playlist
            $data = getJsonInput();
            
            if (empty($data['chart_id'])) {
                errorResponse('Chart ID is required');
            }
            
            $result = $controller->addSong($playlistId, $data['chart_id']);
            successResponse($result, 'Song added to playlist');
            
        } else {
            // Create new playlist
            $data = getJsonInput();
            $playlist = $controller->create($data);
            successResponse($playlist, 'Playlist created successfully');
        }
        break;
        
    case 'PUT':
        if ($playlistId && $action === 'reorder') {
            // Reorder songs
            $data = getJsonInput();
            
            if (empty($data['song_ids']) || !is_array($data['song_ids'])) {
                errorResponse('Song IDs array is required');
            }
            
            $result = $controller->reorderSongs($playlistId, $data['song_ids']);
            successResponse($result, 'Playlist reordered successfully');
            
        } elseif ($playlistId) {
            // Update playlist
            $data = getJsonInput();
            $playlist = $controller->update($playlistId, $data);
            successResponse($playlist, 'Playlist updated successfully');
            
        } else {
            errorResponse('Playlist ID is required');
        }
        break;
        
    case 'DELETE':
        if ($playlistId && $action === 'songs' && $chartId) {
            // Remove song from playlist
            $result = $controller->removeSong($playlistId, $chartId);
            successResponse($result, 'Song removed from playlist');
            
        } elseif ($playlistId) {
            // Delete playlist
            $result = $controller->delete($playlistId);
            successResponse($result, 'Playlist deleted successfully');
            
        } else {
            errorResponse('Playlist ID is required');
        }
        break;
        
    default:
        errorResponse('Method not allowed', 405);
}

