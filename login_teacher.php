<?php
require 'db_connect.php';
session_start([
    'cookie_lifetime' => 86400,
    'cookie_secure' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Strict'
]);

if (session_status() === PHP_SESSION_ACTIVE) {
    session_regenerate_id(true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Requête pour récupérer le hash du mot de passe et le rôle de l'utilisateur
    $stmt = $pdo->prepare('SELECT id, username, password_hash, role FROM users WHERE username = :username AND role = :role');
    
    // Exécuter la requête en passant le rôle comme paramètre
    $stmt->execute(['username' => $username, 'role' => 'teacher']);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérification de l'utilisateur et du mot de passe
    if ($user && password_verify($password, $user['password_hash'])) {
        // Enregistrer l'utilisateur en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // Mettre à jour le statut de la session et l'heure de la dernière connexion
        $update = $pdo->prepare("UPDATE users SET session_status = TRUE, last_login = NOW() WHERE id = :id");
        $update->execute(['id' => $user['id']]);

        // Redirection
        header('Location: enseignant_dashboard.html');
        exit();
    } else {
        echo 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
}
?>
