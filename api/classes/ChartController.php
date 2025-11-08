<?php
/**
 * Chart Controller - CRUD operations for charts
 */

class ChartController {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->auth = new Auth();
    }
    
    /**
     * Get all charts for current user
     */
    public function getAll() {
        $user = $this->auth->getCurrentUser();
        
        $stmt = $this->db->prepare("
            SELECT id, title, artist, tempo, time_signature, key_signature, 
                   content, chart_data, created_at, updated_at
            FROM charts 
            WHERE user_id = ?
            ORDER BY updated_at DESC
        ");
        
        $stmt->execute([$user['id']]);
        $charts = $stmt->fetchAll();
        
        // Decode chart_data JSON
        foreach ($charts as &$chart) {
            $chart['chart_data'] = json_decode($chart['chart_data'], true);
        }
        
        return $charts;
    }
    
    /**
     * Get single chart by ID
     */
    public function getById($id) {
        $user = $this->auth->getCurrentUser();
        
        $stmt = $this->db->prepare("
            SELECT id, title, artist, tempo, time_signature, key_signature,
                   content, chart_data, created_at, updated_at
            FROM charts 
            WHERE id = ? AND user_id = ?
        ");
        
        $stmt->execute([$id, $user['id']]);
        $chart = $stmt->fetch();
        
        if (!$chart) {
            throw new Exception("Chart not found");
        }
        
        $chart['chart_data'] = json_decode($chart['chart_data'], true);
        
        return $chart;
    }
    
    /**
     * Create new chart
     */
    public function create($data) {
        $user = $this->auth->getCurrentUser();
        
        // Validate required fields
        if (empty($data['content']) || empty($data['chart_data'])) {
            throw new Exception("Content and chart data are required");
        }
        
        $chartData = is_string($data['chart_data']) ? $data['chart_data'] : json_encode($data['chart_data']);
        
        $stmt = $this->db->prepare("
            INSERT INTO charts (user_id, title, artist, tempo, time_signature, 
                              key_signature, content, chart_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user['id'],
            $data['title'] ?? 'Untitled',
            $data['artist'] ?? null,
            $data['tempo'] ?? null,
            $data['time_signature'] ?? '4/4',
            $data['key_signature'] ?? null,
            $data['content'],
            $chartData
        ]);
        
        $chartId = $this->db->lastInsertId();
        
        return $this->getById($chartId);
    }
    
    /**
     * Update existing chart
     */
    public function update($id, $data) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($id);
        
        $chartData = isset($data['chart_data']) 
            ? (is_string($data['chart_data']) ? $data['chart_data'] : json_encode($data['chart_data']))
            : null;
        
        $stmt = $this->db->prepare("
            UPDATE charts 
            SET title = COALESCE(?, title),
                artist = COALESCE(?, artist),
                tempo = COALESCE(?, tempo),
                time_signature = COALESCE(?, time_signature),
                key_signature = COALESCE(?, key_signature),
                content = COALESCE(?, content),
                chart_data = COALESCE(?, chart_data),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND user_id = ?
        ");
        
        $stmt->execute([
            $data['title'] ?? null,
            $data['artist'] ?? null,
            $data['tempo'] ?? null,
            $data['time_signature'] ?? null,
            $data['key_signature'] ?? null,
            $data['content'] ?? null,
            $chartData,
            $id,
            $user['id']
        ]);
        
        return $this->getById($id);
    }
    
    /**
     * Delete chart
     */
    public function delete($id) {
        $user = $this->auth->getCurrentUser();
        
        // Check ownership
        $this->getById($id);
        
        $stmt = $this->db->prepare("DELETE FROM charts WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        return ['deleted' => true];
    }
}

