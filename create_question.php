<?php
require 'db_connect.php';
session_start();

// Vérifiez si l'utilisateur est connecté et s'il est un enseignant
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'enseignant') {
    header('Location: login_teacher.html');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $exam_id = $_POST['exam_id'];
    $question = $_POST['question'];
    $answer_type = $_POST['answer_type']; // Nouveau champ pour le type de question (ouverte ou QCM)

    try {
        // Insérer la question dans la base de données
        $stmt = $pdo->prepare('INSERT INTO questions (exam_id, question, answer_type) VALUES (:exam_id, :question, :answer_type)');
        $stmt->execute([
            'exam_id' => $exam_id,
            'question' => $question,
            'answer_type' => $answer_type
        ]);

        // Récupérer l'ID de la question nouvellement insérée
        $question_id = $pdo->lastInsertId();

        if ($answer_type === 'ouverte') {
            // Pour les questions ouvertes
            $answer = $_POST['answer'];
            $stmt = $pdo->prepare('INSERT INTO question_answers (question_id, answer) VALUES (:question_id, :answer)');
            $stmt->execute([
                'question_id' => $question_id,
                'answer' => $answer
            ]);
        } else if ($answer_type === 'qcm') {
            // Pour les QCM
            $choices = $_POST['choices']; // Tableaux des choix
            $correct_choice = $_POST['correct_choice']; // Index de la bonne réponse

            foreach ($choices as $index => $choice) {
                $is_correct = ($index == $correct_choice) ? 1 : 0;
                $stmt = $pdo->prepare('INSERT INTO question_choices (question_id, choice, is_correct) VALUES (:question_id, :choice, :is_correct)');
                $stmt->execute([
                    'question_id' => $question_id,
                    'choice' => $choice,
                    'is_correct' => $is_correct
                ]);
            }
        }

        header('Location: manage_exams.php?message=Question créée avec succès');
        exit();
    } catch (Exception $e) {
        echo 'Erreur lors de la création de la question : ' . $e->getMessage();
    }
}
?>
