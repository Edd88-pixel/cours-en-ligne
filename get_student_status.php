<?php
require 'db_connect.php';

try {
    // Récupérer les utilisateurs avec leur statut de session
    $stmt = $pdo->prepare("SELECT username, session_status FROM users WHERE role = 'student'");
   $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($students);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données.']);
}
?>
