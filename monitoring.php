<?php
require 'db_connect.php';
session_start();

// Vérifier si l'utilisateur est connecté et s'il est un enseignant
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'enseignant') {
    header('Location: login_teacher.html');
    exit();
}

// Vous pourriez utiliser WebSockets pour mettre à jour en temps réel les activités des élèves.
// Ce fichier affiche l'interface de surveillance.
?>