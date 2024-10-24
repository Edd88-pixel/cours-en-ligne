<?php
header('Content-Type: application/json');
$response = ['success' => false, 'message' => 'Une erreur est survenue.'];

try {
    $pdo = new PDO('pgsql:host=localhost;dbname=exam_db', 'postgres', 'paincafe');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion à la base de données : " . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['pdf'])) {
        handleExamCreation($pdo);
    } elseif (isset($_POST['questions']) || isset($_POST['mcq_questions']) || isset($_POST['section_titles'])) {
        handleManualQuestions($pdo);
    } else {
        sendErrorResponse("Requête non reconnue.");
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['exam_id'])) {
    fetchQuestionsForExam($pdo, $_GET['exam_id']);
} else {
    fetchExams($pdo);
}

function fetchExams($pdo) {
    try {
        $stmt = $pdo->prepare("SELECT id, title, description, start_time, end_time FROM exams");
        $stmt->execute();
        $exams = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendSuccessResponse(['exams' => $exams]);
    } catch (PDOException $e) {
        sendErrorResponse("Erreur lors de la récupération des examens : " . $e->getMessage());
    }
}

function handleExamCreation($pdo) {
    if (empty($_POST['title']) || empty($_POST['description']) || empty($_POST['start_time']) || empty($_POST['end_time'])) {
        sendErrorResponse("Tous les champs sont obligatoires.");
        return;
    }

    $title = $_POST['title'];
    $description = $_POST['description'];
    $startTime = $_POST['start_time'];
    $endTime = $_POST['end_time'];

    try {
        $stmt = $pdo->prepare("INSERT INTO exams (title, description, start_time, end_time) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $description, $startTime, $endTime]);
        $examId = $pdo->lastInsertId();

        if (isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
            $pdf = $_FILES['pdf'];
            $filePath = 'uploads/' . basename($pdf['name']);
            move_uploaded_file($pdf['tmp_name'], $filePath);

            $stmt = $pdo->prepare("UPDATE exams SET pdf_path = ? WHERE id = ?");
            $stmt->execute([$filePath, $examId]);
        }

        sendSuccessResponse(['message' => "Examen créé avec succès."]);
    } catch (PDOException $e) {
        sendErrorResponse("Erreur lors de la création de l'examen : " . $e->getMessage());
    }
}

function fetchQuestionsForExam($pdo, $examId) {
    try {
        $stmt = $pdo->prepare("SELECT id, type, question, options FROM questions WHERE exam_id = ?");
        $stmt->execute([$examId]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendSuccessResponse(['questions' => $questions]);
    } catch (PDOException $e) {
        sendErrorResponse("Erreur lors de la récupération des questions : " . $e->getMessage());
    }
}

function handleManualQuestions($pdo) {
    if (empty($_POST['exam_id'])) {
        sendErrorResponse("Aucun examen sélectionné.");
        return;
    }

    $examId = $_POST['exam_id'];
    $questions = isset($_POST['questions']) ? $_POST['questions'] : [];
    $answers = isset($_POST['answers']) ? $_POST['answers'] : [];
    $mcqQuestions = isset($_POST['mcq_questions']) ? $_POST['mcq_questions'] : [];
    $mcqOptions = isset($_POST['mcq_options']) ? $_POST['mcq_options'] : [];
    $mcqCorrectAnswers = isset($_POST['mcq_correct']) ? $_POST['mcq_correct'] : [];
    $sectionTitles = isset($_POST['section_titles']) ? $_POST['section_titles'] : [];

    try {
        if (!empty($questions)) {
            foreach ($questions as $index => $question) {
                $answer = $answers[$index] ?? '';
                $stmt = $pdo->prepare("INSERT INTO questions (exam_id, type, question, answer) VALUES (?, 'manual', ?, ?)");
                $stmt->execute([$examId, $question, $answer]);
            }
        }

        if (!empty($mcqQuestions)) {
            foreach ($mcqQuestions as $index => $question) {
                // Récupérer les options et la réponse correcte
                $options = $mcqOptions[$index] ?? '';
                $correctAnswer = $mcqCorrectAnswers[$index] ?? '';
        
                // Insertion dans la base de données, avec les colonnes nécessaires
                $stmt = $pdo->prepare("
                    INSERT INTO questions (exam_id, type, question, options, correct_answer) 
                    VALUES (?, 'mcq', ?, ?, ?)
                ");
                $stmt->execute([$examId, $question, json_encode($options), $correctAnswer]);
            }
        }
        

        if (!empty($sectionTitles)) {
            foreach ($sectionTitles as $title) {
                $stmt = $pdo->prepare("INSERT INTO questions (exam_id, type, question) VALUES (?, 'section', ?)");
                $stmt->execute([$examId, $title]);
            }
        }

        sendSuccessResponse(['message' => "Questions enregistrées avec succès."]);
    } catch (PDOException $e) {
        sendErrorResponse("Erreur lors de l'enregistrement des questions : " . $e->getMessage());
    }
}

function sendSuccessResponse($data) {
    global $response;
    $response['success'] = true;
    $response = array_merge($response, $data);
    echo json_encode($response);
    exit;
}

function sendErrorResponse($message) {
    global $response;
    $response['message'] = $message;
    echo json_encode($response);
    exit;
}
?>
