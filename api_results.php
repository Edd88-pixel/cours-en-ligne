<?php
session_start();
require 'db_connect.php';

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare('
    SELECT exams.title AS exam_title, results.score 
    FROM results 
    JOIN exams ON results.exam_id = exams.id 
    WHERE results.user_id = :user_id
');
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($results);
?>
