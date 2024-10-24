<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $student_id = 1; // Remplacez avec l'ID réel de l'élève connecté
    $exam_id = $data['exam_id']; // ID de l'examen
    $score = 0; // Calculez le score en fonction des réponses

    $stmt = $pdo->prepare('INSERT INTO results (student_id, exam_id, score, completed_at) VALUES (:student_id, :exam_id, :score, NOW())');
    $success = $stmt->execute(['student_id' => $student_id, 'exam_id' => $exam_id, 'score' => $score]);

    echo json_encode(['success' => $success]);
}
?>
