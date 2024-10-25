<?php
session_start();
echo 'Session ID: ' . session_id();
echo '<pre>';
print_r($_SESSION);
echo '</pre>';
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'eleve') {
    header('Location: login.html');
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de Bord Élève</title>
    <link rel="stylesheet" href="eleve_dashboard.css">
</head>
<body>
    <header>
        <h1>Bienvenue sur votre Tableau de Bord, Élève</h1>
        <nav>
            <ul>
                <li><a href="eleve_exam.html">Passer un Examen</a></li>
                <li><a href="eleve_results.html">Voir les Résultats</a></li>
                <li><a href="logout.php">Déconnexion</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="dashboard-content">
            <h2>Prochains Examens</h2>
            <div id="exam-list">
                <!-- Liste dynamique des examens -->
            </div>
        </section>
    </main>
    <script src="eleve_dashboard.js"></script>
</body>
</html>
