<?php
// Connexion à la base de données PostgreSQL
$dsn = 'pgsql:host=localhost;dbname=exam_db';
$user = 'postgres';
$password = 'paincafe';

try {
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Connexion échouée : ' . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérer et nettoyer les données du formulaire
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    // Préparer la requête d'insertion
    $sql = "INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)";
    $stmt = $pdo->prepare($sql);

    // Exécuter la requête avec les valeurs
    if ($stmt->execute([':name' => $name, ':email' => $email, ':message' => $message])) {
        echo "Merci pour votre message. Nous vous contacterons bientôt.";
    } else {
        echo "Erreur lors de l'envoi de votre message.";
    }
}
?>
