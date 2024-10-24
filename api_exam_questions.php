<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['exam_id'])) {
    $exam_id = intval($_GET['exam_id']);
    
    // Récupérer les informations de l'examen
    $stmt = $pdo->prepare('SELECT * FROM exams WHERE id = :id');
    $stmt->bindParam(':id', $exam_id);
    $stmt->execute();
    $exam = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$exam) {
        echo json_encode(['error' => 'Examen non trouvé']);
        exit();
    }

    // Récupérer les questions de l'examen
    $stmt = $pdo->prepare('SELECT * FROM questions WHERE exam_id = :exam_id');
    $stmt->bindParam(':exam_id', $exam_id);
    $stmt->execute();
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Pour chaque question, récupérer les réponses possibles
    foreach ($questions as &$question) {
        $stmt = $pdo->prepare('SELECT * FROM answers WHERE question_id = :question_id');
        $stmt->bindParam(':question_id', $question['id']);
        $stmt->execute();
        $question['answers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(['exam' => $exam, 'questions' => $questions]);
} else {
    echo json_encode(['error' => 'ID de l\'examen invalide']);
}
?>
