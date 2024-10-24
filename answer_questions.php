<?php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $exam_id = $_POST['exam_id'];
    $question_ids = $_POST['question_ids'];
    $answers = $_POST['answers'];
    $student_id = 1; // Remplacez ceci par l'ID réel de l'élève connecté

    foreach ($question_ids as $index => $question_id) {
        $answer = $answers[$index];

        $stmt = $pdo->prepare('INSERT INTO answers (student_id, exam_id, question_id, answer) VALUES (:student_id, :exam_id, :question_id, :answer)');
        $stmt->execute([
            'student_id' => $student_id,
            'exam_id' => $exam_id,
            'question_id' => $question_id,
            'answer' => $answer
        ]);
    }

    echo 'Réponses soumises avec succès.';
}
?>
