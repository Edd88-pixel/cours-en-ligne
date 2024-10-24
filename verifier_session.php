session_start();

header('Content-Type: application/json');

// Retourner la session de l'utilisateur sous forme de JSON
echo json_encode([
    'user_id' => $_SESSION['user_id'] ?? null
]);
