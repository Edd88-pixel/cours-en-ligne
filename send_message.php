<?php
session_start();
require 'db_connect.php';

// Définir l'en-tête Content-Type avec charset
header('Content-Type: application/json; charset=utf-8');

// Vérifier si l'utilisateur est authentifié
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => "Utilisateur non authentifié."]);
    exit();
}

$user_id = $_SESSION['user_id']; // Récupérer l'ID de l'utilisateur authentifié
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['message'])) {
    echo json_encode(['success' => false, 'error' => "Aucun message fourni."]);
    exit();
}

$message = $data['message'];

try {
    // Insertion du message dans la base de données
    $query = $pdo->prepare('INSERT INTO chat_messages (user_id, message, timestamp) VALUES (?, ?, NOW())');
    $query->execute([$user_id, $message]);

    // Renvoi de la réponse en cas de succès
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    // Renvoi de la réponse en cas d'erreur
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
