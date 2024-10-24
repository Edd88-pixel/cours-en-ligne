<?php
header('Content-Type: application/json');
require 'db_connect.php';

try {
    // Activer les exceptions PDO pour une meilleure gestion des erreurs
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Exécuter la requête pour obtenir les examens
        $stmt = $pdo->query('SELECT id, title, start_time AS date FROM exams');
        $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Si des examens sont trouvés, formater les dates
        if ($exams) {
            foreach ($exams as &$exam) {
                $exam['date'] = date('d-m-Y H:i:s', strtotime($exam['date'])); // Format de date français
            }
            echo json_encode($exams);
        } else {
            // Aucun examen trouvé
            http_response_code(404);
            echo json_encode(['message' => 'Aucun examen trouvé']);
        }
    } else {
        // Méthode HTTP non autorisée
        http_response_code(405);
        echo json_encode(['message' => 'Méthode non autorisée']);
    }
} catch (PDOException $e) {
    // Gérer les exceptions de connexion et de requêtes SQL
    http_response_code(500);
    echo json_encode(['message' => 'Erreur du serveur', 'error' => $e->getMessage()]);
}
?>
