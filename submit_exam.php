<?php
// Démarrer la session
session_start();
require 'db_connect.php';

// Activer l'affichage des erreurs (pour le débogage)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Logs pour suivre la session avant la vérification
file_put_contents('log.txt', "Session avant vérification user_id: " . print_r($_SESSION, true) . "\n", FILE_APPEND);

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    // Logs en cas de session invalide
    file_put_contents('log.txt', "Session invalide ou user_id absent : " . print_r($_SESSION, true) . "\n", FILE_APPEND);

    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    // Ajouter l'URL de redirection après connexion
    $redirectUrl = urlencode($_SERVER['REQUEST_URI']); // URL de la page d'examen où l'utilisateur était
    header('Location: login_student.html?redirect=' . $redirectUrl);
    exit();
}

// Continuer seulement si la connexion à la base de données est valide
try {
    // Vérifier la connexion à la base de données
    if (!$pdo) {
        throw new Exception('Connexion à la base de données échouée');
    }

    // Récupérer les données utilisateur et de l'examen
    $user_id = $_SESSION['user_id'];
    $exam_id = $_POST['exam_id'] ?? null;
    $answers = $_POST['answers'] ?? [];

    // Logs pour voir les données soumises
    file_put_contents('log.txt', "Données POST : " . print_r($_POST, true) . "\n", FILE_APPEND);

    // Vérification des données soumises
    if (!$exam_id || empty($answers)) {
        throw new Exception('Données manquantes');
    }

    // Initialiser le score et le nombre total de questions
    $score = 0;
    $totalQuestions = count($answers);

    // Récupérer les réponses correctes pour les questions de cet examen
    $stmt = $pdo->prepare('SELECT id, answer FROM questions WHERE exam_id = :exam_id');
    $stmt->bindParam(':exam_id', $exam_id);
    $stmt->execute();
    $correctAnswers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Comparer les réponses de l'élève avec les réponses correctes
    foreach ($correctAnswers as $question) {
        $questionId = $question['id'];
        $correctAnswer = trim($question['answer']);
        $userAnswer = trim($answers[$questionId]);

        if (strcasecmp($userAnswer, $correctAnswer) === 0) {
            $score++; // Augmenter le score si la réponse est correcte
        }
    }

    // Calculer le score en pourcentage
    $percentageScore = ($totalQuestions > 0) ? ($score / $totalQuestions) * 100 : 0;

    // Enregistrer le résultat dans la base de données
    $stmt = $pdo->prepare('INSERT INTO results (user_id, exam_id, score) VALUES (:user_id, :exam_id, :score)');
    $stmt->execute([
        ':user_id' => $user_id,
        ':exam_id' => $exam_id,
        ':score' => $percentageScore
    ]);

    // Logs pour le score calculé
    file_put_contents('log.txt', "Score enregistré : $percentageScore\n", FILE_APPEND);

    // Envoyer une réponse JSON de succès avec le score
    echo json_encode([
        'success' => true,
        'message' => 'Examen soumis avec succès',
        'score' => $percentageScore
    ]);

} catch (Exception $e) {
    // En cas d'erreur liée aux données
    http_response_code(400);
    file_put_contents('log.txt', "Erreur : " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    // En cas d'erreur du serveur (base de données)
    http_response_code(500);
    file_put_contents('log.txt', "Erreur de la base de données : " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Erreur du serveur', 'error' => $e->getMessage()]);
}
?>
