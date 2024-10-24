<?php
// Configuration de la base de données pour PostgreSQL
$dsn = 'pgsql:host=localhost;port=5432;dbname=exam_db';
$db_user = 'postgres'; // Remplacez 'nom_utilisateur' par votre nom d'utilisateur PostgreSQL
$db_password = 'paincafe'; // Remplacez 'mot_de_passe' par votre mot de passe PostgreSQL

// Autres options de configuration
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

// Créer une instance PDO pour la connexion
try {
    $db = new PDO($dsn, $db_user, $db_password, $options);
    echo 'Connexion réussie à la base de données PostgreSQL.';
} catch (PDOException $e) {
    echo 'Erreur de connexion : ' . $e->getMessage();
    exit();
}
?>
