<?php
header('Content-Type: application/json');
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $title = $data['title'];
    $description = $data['description'];
    $start_time = $data['start_time'];
    $end_time = $data['end_time'];

    $stmt = $pdo->prepare('INSERT INTO exams (title, description, start_time, end_time) VALUES (:title, :description, :start_time, :end_time)');
    $success = $stmt->execute(['title' => $title, 'description' => $description, 'start_time' => $start_time, 'end_time' => $end_time]);

    echo json_encode(['success' => $success]);
}
?>
