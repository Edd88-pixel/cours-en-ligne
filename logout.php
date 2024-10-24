<?php
session_start();

if (isset($_SESSION['user_id'])) {
    require 'db_connect.php';

    // Mettre à jour le statut de la session à hors ligne
    $update = $pdo->prepare("UPDATE users SET session_status = 'offline' WHERE id = :id");
    $update->execute(['id' => $_SESSION['user_id']]);
}

// Détruire la session
session_unset();
session_destroy();

header('Location: login.html');
exit();
?>
