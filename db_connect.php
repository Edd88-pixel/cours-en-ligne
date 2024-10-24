<?php
$dsn = 'pgsql:host=localhost;dbname=exam_db';
$user = 'postgres';
$password = 'paincafe';

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}
?>
