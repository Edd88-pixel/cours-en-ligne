<?php
require 'db_connect.php';

$exam_id = $_GET['exam_id'] ?? null;

if (!$exam_id) {
    http_response_code(400);
    echo json_encode(['message' => 'ID d\'examen manquant']);
    exit;
}

// Récupérer les questions
$stmt = $pdo->prepare('SELECT id, question, type, options FROM questions WHERE exam_id = :exam_id');
$stmt->bindParam(':exam_id', $exam_id);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (!$questions) {
    http_response_code(404);
    echo json_encode(['message' => 'Aucune question trouvée pour cet examen']);
    exit;
}

// Traiter les options des questions MCQ
foreach ($questions as &$question) {
    // Si la question est de type MCQ, séparer les options par virgule
    if ($question['type'] === 'mcq' && !empty($question['options'])) {
        $question['options'] = explode(',', $question['options']); // Sépare les options par la virgule
    } else {
        // Pour les autres types de questions, on supprime la clé 'options'
        unset($question['options']);
    }
}

// Renvoyer les questions avec les options pour les questions MCQ
$response = [
    'questions' => $questions
];

header('Content-Type: application/json');
echo json_encode($response);
?>
