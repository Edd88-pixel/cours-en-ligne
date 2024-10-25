<?php
session_start();
require 'db_connect.php';

// Définir l'en-tête Content-Type avec charset
header('Content-Type: application/json; charset=utf-8');

// Vérifier si l'utilisateur est authentifié
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non authentifié.']);
    exit();
}

$user_id = $_SESSION['user_id']; // Récupérer l'ID de l'utilisateur authentifié

try {
    // Récupération des messages
    $query = $pdo->prepare('SELECT user_id, message, timestamp FROM chat_messages ORDER BY timestamp ASC');
    $query->execute();
    $messages = $query->fetchAll(PDO::FETCH_ASSOC);

    // Préparer les messages pour la réponse JSON
    $result = array_map(function($msg) use ($user_id) {
        return [
            'message' => $msg['message'],
            'is_current_user' => $msg['user_id'] == $user_id
        ];
    }, $messages);

    // Renvoi des messages au format JSON
    echo json_encode(['success' => true, 'messages' => $result]);
} catch (Exception $e) {
    // En cas d'erreur, renvoyer une réponse JSON avec l'erreur
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
