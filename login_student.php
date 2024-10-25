<?php
require 'db_connect.php';
session_start([
    'cookie_lifetime' => 86400,
    'cookie_secure' => false, // Désactivé en mode développement local. Changez pour true en production avec HTTPS
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

// Si l'utilisateur est déjà connecté, rediriger vers le tableau de bord
if (isset($_SESSION['user_id'])) {
    header('Location: eleve_dashboard.html');
    exit();
}

// Si la session est déjà active, on ne la régénère pas
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start([
        'cookie_lifetime' => 86400,
        'cookie_secure' => false, // Désactivé en mode développement local. Changez pour true en production avec HTTPS
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict'
    ]);
    session_regenerate_id(true); // Cette ligne régénère l'ID de session
}

// Traitement du formulaire de connexion
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Requête pour récupérer le hash du mot de passe et le rôle de l'utilisateur
    $stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM users WHERE username = :username AND role = :role');

    // Exécuter la requête en passant le rôle comme paramètre
    $stmt->execute(['username' => $username, 'role' => 'student']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérification de l'utilisateur et du mot de passe
    if ($user && password_verify($password, $user['password_hash'])) {
        // Enregistrer l'utilisateur en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // Assigner un ID d'authentification unique
        $auth_id = 1 + $user['id']; // Exemple simple : ID utilisateur + 1, + 2, etc.

        // Mettre à jour le statut de la session, l'heure de la dernière connexion et l'ID d'authentification
        $update = $pdo->prepare("UPDATE users SET session_status = TRUE, last_login = NOW() WHERE id = :id");
        $update->execute(['id' => $user['id']]);

        // Redirection vers la page d'origine ou tableau de bord
        $redirectUrl = $_GET['redirect'] ?? 'eleve_dashboard.html';
        header('Location: ' . $redirectUrl);
        exit();
    } else {
        echo 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
}
