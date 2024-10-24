<?php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $role = $_POST['role'];

    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare('INSERT INTO users (username, password_hash, role) VALUES (:username, :password_hash, :role)');
    if ($stmt->execute(['username' => $username, 'password_hash' => $password_hash, 'role' => $role])) {
        header('Location: login.html');
        exit();
    } else {
        echo 'Erreur lors de l\'inscription.';
    }
}
?>
