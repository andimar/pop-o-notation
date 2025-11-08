<?php
/**
 * Playlist Controller - CRUD operations for playlists
 */

class PlaylistController {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new Auth();
    }
    
    /**
     * Get all playlists for current user
     */
    public function getAll() {
        $user = $this->auth->getCurrentUser();
        
        $stmt = $this->db->prepare("
            SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
                   COUNT(pi.id) as song_count
            FROM playlists p
            LEFT JOIN playlist_items pi ON p.id = pi.playlist_id
            WHERE p.user_id = ?
            GROUP BY p.id
            ORDER BY p.updated_at DESC
        ");
        
        $stmt->execute([$user['id']]);
        
        return $stmt->fetchAll();
    }
    
    /**
     * Get single playlist with songs
     */
    public function getById($id) {
        $user = $this->auth->getCurrentUser();
        
        // Get playlist info
        $stmt = $this->db->prepare("
            SELECT id, name, description, created_at, updated_at
            FROM playlists 
            WHERE id = ? AND user_id = ?
        ");
        
        $stmt->execute([$id, $user['id']]);
        $playlist = $stmt->fetch();
        
        if (!$playlist) {
            throw new Exception("Playlist not found");
        }
        
        // Get songs in playlist
        $stmt = $this->db->prepare("
            SELECT c.id, c.title, c.artist, c.tempo, c.time_signature,
                   c.content, c.chart_data, pi.position
            FROM playlist_items pi
            JOIN charts c ON pi.chart_id = c.id
            WHERE pi.playlist_id = ?
            ORDER BY pi.position ASC
        ");
        
        $stmt->execute([$id]);
        $songs = $stmt->fetchAll();
        
        // Decode chart_data
        foreach ($songs as &$song) {
            $song['chart_data'] = json_decode($song['chart_data'], true);
        }
        
        $playlist['songs'] = $songs;
        
        return $playlist;
    }
    
    /**
     * Create new playlist
     */
    public function create($data) {
        $user = $this->auth->getCurrentUser();
        
        if (empty($data['name'])) {
            throw new Exception("Playlist name is required");
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO playlists (user_id, name, description)
            VALUES (?, ?, ?)
        ");
        
        $stmt->execute([
            $user['id'],
            $data['name'],
            $data['description'] ?? null
        ]);
        
        $playlistId = $this->db->lastInsertId();
        
        return $this->getById($playlistId);
    }
    
    /**
     * Update playlist
     */
    public function update($id, $data) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($id);
        
        $stmt = $this->db->prepare("
            UPDATE playlists 
            SET name = COALESCE(?, name),
                description = COALESCE(?, description),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        ");
        
        $stmt->execute([
            $data['name'] ?? null,
            $data['description'] ?? null,
            $id,
            $user['id']
        ]);
        
        return $this->getById($id);
    }
    
    /**
     * Delete playlist
     */
    public function delete($id) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($id);
        
        $stmt = $this->db->prepare("DELETE FROM playlists WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        return ['deleted' => true];
    }
    
    /**
     * Add song to playlist
     */
    public function addSong($playlistId, $chartId) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($playlistId);
        
        // Verify chart belongs to user
        $stmt = $this->db->prepare("SELECT id FROM charts WHERE id = ? AND user_id = ?");
        $stmt->execute([$chartId, $user['id']]);
        
        if (!$stmt->fetch()) {
            throw new Exception("Chart not found");
        }
        
        // Get next position
        $stmt = $this->db->prepare("
            SELECT COALESCE(MAX(position), 0) + 1 as next_position
            FROM playlist_items
            WHERE playlist_id = ?
        ");
        
        $stmt->execute([$playlistId]);
        $result = $stmt->fetch();
        $position = $result['next_position'];
        
        // Add to playlist
        try {
            $stmt = $this->db->prepare("
                INSERT INTO playlist_items (playlist_id, chart_id, position)
                VALUES (?, ?, ?)
            ");
            
            $stmt->execute([$playlistId, $chartId, $position]);
            
            // Update playlist timestamp
            $stmt = $this->db->prepare("
                UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
            ");
            $stmt->execute([$playlistId]);
            
            return ['added' => true, 'position' => $position];
            
        } catch (PDOException $e) {
            if ($e->getCode() == 23000) { // Unique constraint violation
                throw new Exception("Song already in playlist");
            }
            throw $e;
        }
    }
    
    /**
     * Remove song from playlist
     */
    public function removeSong($playlistId, $chartId) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($playlistId);
        
        $stmt = $this->db->prepare("
            DELETE FROM playlist_items 
            WHERE playlist_id = ? AND chart_id = ?
        ");
        
        $stmt->execute([$playlistId, $chartId]);
        
        // Update playlist timestamp
        $stmt = $this->db->prepare("
            UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
        ");
        $stmt->execute([$playlistId]);
        
        // Reorder positions
        $this->reorderPositions($playlistId);
        
        return ['removed' => true];
    }
    
    /**
     * Reorder songs in playlist
     */
    public function reorderSongs($playlistId, $songIds) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($playlistId);
        
        $this->db->beginTransaction();
        
        try {
            $stmt = $this->db->prepare("
                UPDATE playlist_items 
                SET position = ?
                WHERE playlist_id = ? AND chart_id = ?
            ");
            
            foreach ($songIds as $position => $chartId) {
                $stmt->execute([$position + 1, $playlistId, $chartId]);
            }
            
            // Update playlist timestamp
            $stmt = $this->db->prepare("
                UPDATE playlists SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
            ");
            $stmt->execute([$playlistId]);
            
            $this->db->commit();
            
            return ['reordered' => true];
            
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
    
    private function reorderPositions($playlistId) {
        $stmt = $this->db->prepare("
            SELECT id FROM playlist_items 
            WHERE playlist_id = ?
            ORDER BY position ASC
        ");
        
        $stmt->execute([$playlistId]);
        $items = $stmt->fetchAll();
        
        $updateStmt = $this->db->prepare("
            UPDATE playlist_items SET position = ? WHERE id = ?
        ");
        
        foreach ($items as $index => $item) {
            $updateStmt->execute([$index + 1, $item['id']]);
        }
    }
}

