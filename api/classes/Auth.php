<?php
/**
 * Authentication Class - JWT and User Management
 */

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Register new user
     */
    public function register($username, $email, $password) {
        // Validate input
        if (empty($username) || empty($email) || empty($password)) {
            throw new Exception("All fields are required");
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format");
        }
        
        if (strlen($password) < 6) {
            throw new Exception("Password must be at least 6 characters");
        }
        
        // Check if user exists
        $stmt = $this->db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        
        if ($stmt->fetch()) {
            throw new Exception("Username or email already exists");
        }
        
        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Insert user
        $stmt = $this->db->prepare("
            INSERT INTO users (username, email, password) 
            VALUES (?, ?, ?)
        ");
        
        $stmt->execute([$username, $email, $hashedPassword]);
        
        $userId = $this->db->lastInsertId();
        
        return [
            'id' => $userId,
            'username' => $username,
            'email' => $email
        ];
    }
    
    /**
     * Login user
     */
    public function login($username, $password) {
        $stmt = $this->db->prepare("
            SELECT id, username, email, password 
            FROM users 
            WHERE username = ? OR email = ?
        ");
        
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();
        
        if (!$user || !password_verify($password, $user['password'])) {
            throw new Exception("Invalid credentials");
        }
        
        // Generate JWT token
        $token = $this->generateToken($user['id'], $user['username']);
        
        return [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ],
            'token' => $token
        ];
    }
    
    /**
     * Generate JWT token
     */
    private function generateToken($userId, $username) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $payload = json_encode([
            'user_id' => $userId,
            'username' => $username,
            'exp' => time() + JWT_EXPIRATION
        ]);
        
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode($payload);
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    /**
     * Verify JWT token
     */
    public function verifyToken($token) {
        if (!$token) {
            throw new Exception("No token provided");
        }
        
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception("Invalid token format");
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignatureCheck = $this->base64UrlEncode($signature);
        
        if ($base64UrlSignature !== $base64UrlSignatureCheck) {
            throw new Exception("Invalid token signature");
        }
        
        // Decode payload
        $payload = json_decode($this->base64UrlDecode($base64UrlPayload), true);
        
        // Check expiration
        if ($payload['exp'] < time()) {
            throw new Exception("Token expired");
        }
        
        return $payload;
    }
    
    /**
     * Get current user from token
     */
    public function getCurrentUser() {
        $token = getBearerToken();
        
        if (!$token) {
            throw new Exception("Authentication required");
        }
        
        $payload = $this->verifyToken($token);
        
        $stmt = $this->db->prepare("
            SELECT id, username, email 
            FROM users 
            WHERE id = ?
        ");
        
        $stmt->execute([$payload['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user) {
            throw new Exception("User not found");
        }
        
        return $user;
    }
    
    private function base64UrlEncode($text) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($text));
    }
    
    private function base64UrlDecode($text) {
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $text));
    }
}

