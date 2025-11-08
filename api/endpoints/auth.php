<?php
/**
 * Authentication Endpoints
 */

$auth = new Auth();
$action = $segments[1] ?? '';

switch ($requestMethod) {
    case 'POST':
        $data = getJsonInput();
        
        if ($action === 'register') {
            // Register new user
            if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
                errorResponse('Username, email and password are required');
            }
            
            $result = $auth->register($data['username'], $data['email'], $data['password']);
            successResponse($result, 'User registered successfully');
            
        } elseif ($action === 'login') {
            // Login user
            if (empty($data['username']) || empty($data['password'])) {
                errorResponse('Username and password are required');
            }
            
            $result = $auth->login($data['username'], $data['password']);
            successResponse($result, 'Login successful');
            
        } else {
            errorResponse('Invalid auth endpoint', 404);
        }
        break;
        
    case 'GET':
        if ($action === 'me') {
            // Get current user
            $user = $auth->getCurrentUser();
            successResponse($user);
        } else {
            errorResponse('Invalid auth endpoint', 404);
        }
        break;
        
    default:
        errorResponse('Method not allowed', 405);
}

