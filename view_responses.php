<?php
require 'db_connect.php';

$exam_id = $_GET['exam_id'];

$stmt = $pdo->prepare('SELECT * FROM answers WHERE exam_id = :exam_id');
$stmt->execute(['exam_id' => $exam_id]);
$responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($responses);
?>
