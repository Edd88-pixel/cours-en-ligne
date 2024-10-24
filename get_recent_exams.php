<?php
// Inclure la connexion à la base de données
require 'db_connect.php'; // Le fichier db_connect.php contient déjà la connexion $pdo

try {
    // Utilisation de la connexion $pdo pour PostgreSQL
    // Requête pour récupérer les examens récents
    $stmt = $pdo->prepare("SELECT id, title, start_time AS date FROM exams ORDER BY start_time DESC LIMIT 10");
    $stmt->execute();
    $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retourner les examens au format JSON
    echo json_encode($exams);

} catch (PDOException $e) {
    // Gérer les erreurs de connexion à la base de données
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données.', 'details' => $e->getMessage()]);
}
?>
