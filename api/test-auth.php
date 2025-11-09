<?php
/**
 * Test registrazione diretta - bypassa routing
 */

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Leggi input
    $data = getJsonInput();
    
    if (empty($data)) {
        // Se non c'è input, mostra form di test
        ?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Registrazione API</title>
    <style>
        body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
        input { width: 100%; padding: 8px; margin: 5px 0; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Test Registrazione API</h1>
    <form id="testForm">
        <label>Username:</label>
        <input type="text" id="username" value="testuser" required>
        
        <label>Email:</label>
        <input type="email" id="email" value="test@example.com" required>
        
        <label>Password:</label>
        <input type="password" id="password" value="test123456" required>
        
        <button type="submit">Registra</button>
    </form>
    
    <div class="result" id="result"></div>
    
    <script>
        document.getElementById('testForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            try {
                const response = await fetch('test-auth.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<strong style="color: red;">Errore: ' + error.message + '</strong>';
            }
        });
    </script>
</body>
</html>
        <?php
        exit;
    }
    
    // Processa registrazione
    $auth = new Auth();
    
    if (empty($data['username']) || empty($data['email']) || empty($data['password'])) {
        errorResponse('Username, email and password are required');
    }
    
    $result = $auth->register($data['username'], $data['email'], $data['password']);
    successResponse($result, 'User registered successfully');
    
} catch (Exception $e) {
    errorResponse($e->getMessage());
}

