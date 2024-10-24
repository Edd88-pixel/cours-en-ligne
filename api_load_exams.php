<?php
// api_load_exams.php
require 'config.php';  // Connection à votre base de données

session_start();

try {
    $query = "SELECT id, title, creation_date FROM exams WHERE user_id = :user_id ORDER BY creation_date DESC";
    $stmt = $pdo->prepare($query);
    $stmt->execute(['user_id' => $_SESSION['user_id']]);
    $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($exams);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de chargement des examens']);
}
