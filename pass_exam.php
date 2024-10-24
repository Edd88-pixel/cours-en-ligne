<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'eleve') {
    header('Location: login.html');
    exit();
}

if (!isset($_GET['exam_id'])) {
    header('Location: eleve_exam.html');
    exit();
}

$exam_id = intval($_GET['exam_id']);

// Connexion à la base de données PostgreSQL
$conn = new PDO('pgsql:host=localhost;dbname=your_database', 'your_username', 'your_password');

// Gestion de la soumission du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($_POST as $question_id => $answer_id) {
        $question_id = intval(str_replace('question_', '', $question_id));
        $answer_id = intval($answer_id);

        $stmt = $conn->prepare('INSERT INTO student_answers (student_id, question_id, answer_id) VALUES (:student_id, :question_id, :answer_id)');
        $stmt->execute([
            'student_id' => $_SESSION['user_id'],
            'question_id' => $question_id,
            'answer_id' => $answer_id,
        ]);
    }
    
    header('Location: eleve_results.html'); // Rediriger vers la page des résultats après la soumission
    exit();
}

// Préparation et exécution de la requête
$stmt = $conn->prepare('SELECT * FROM exams WHERE id = :id');
$stmt->bindParam(':id', $exam_id);
$stmt->execute();
$exam = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$exam) {
    header('Location: eleve_exam.html');
    exit();
}

// Préparation des questions de l'examen
$stmt = $conn->prepare('SELECT * FROM questions WHERE exam_id = :exam_id');
$stmt->bindParam(':exam_id', $exam_id);
$stmt->execute();
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passer l'Examen</title>
    <link rel="stylesheet" href="pass_exam.css">
</head>
<body>
    <header>
        <h1>Passer l'Examen</h1>
        <nav>
            <ul>
                <li><a href="eleve_dashboard.html">Tableau de Bord</a></li>
                <li><a href="eleve_results.html">Voir les Résultats</a></li>
                <li><a href="logout.php" id="logout">Déconnexion</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="exam-content">
            <h2><?php echo htmlspecialchars($exam['title']); ?></h2>
            <p><?php echo htmlspecialchars($exam['description']); ?></p>
            <form id="exam-form" method="POST">
                <?php foreach ($questions as $question): ?>
                    <fieldset>
                        <legend><?php echo htmlspecialchars($question['question_text']); ?></legend>
                        <?php 
                        // Fetch possible answers
                        $stmt = $conn->prepare('SELECT * FROM answers WHERE question_id = :question_id');
                        $stmt->bindParam(':question_id', $question['id']);
                        $stmt->execute();
                        $answers = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        ?>
                        <?php foreach ($answers as $answer): ?>
                            <label>
                                <input type="radio" name="question_<?php echo $question['id']; ?>" value="<?php echo $answer['id']; ?>" required>
                                <?php echo htmlspecialchars($answer['answer_text']); ?>
                            </label><br>
                        <?php endforeach; ?>
                    </fieldset>
                <?php endforeach; ?>
                <button type="submit">Soumettre</button>
            </form>
        </section>
    </main>
    <script src="pass_exam.js"></script>
</body>
</html>
