<?php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $start_time = $_POST['start_time'];
    $end_time = $_POST['end_time'];

    $stmt = $pdo->prepare('INSERT INTO exams (title, description, start_time, end_time) VALUES (:title, :description, :start_time, :end_time)');
    $success = $stmt->execute([
        'title' => $title,
        'description' => $description,
        'start_time' => $start_time,
        'end_time' => $end_time
    ]);

    if ($success) {
        echo 'Examen créé avec succès. <a href="manage_exams.html">Retourner à la gestion des examens</a>';
    } else {
        echo 'Erreur lors de la création de l\'examen.';
    }
}
?>
