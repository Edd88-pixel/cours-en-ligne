
document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    let examId = queryParams.get('exam_id');
    const questionsSection = document.getElementById('questions-section');
    const examForm = document.getElementById('exam-form');
    const examSelect = document.getElementById('exam-select');
    const startExamButton = document.getElementById('start-exam-button');

    if (!questionsSection) {
        console.error("L'élément 'questions-section' est introuvable.");
        return;
    }

    // Vérifier si l'utilisateur est connecté avant de charger les examens
    const verifierSession = async () => {
        try {
            const response = await fetch('verifier_session.php', {
                method: 'GET',
                credentials: 'include'  // Inclure les cookies de session
            });
            const data = await response.json();
            if (!data.user_id) {
                // Si la session est invalide, rediriger l'utilisateur vers la page de connexion
                window.location.href = 'login_student.html?redirect=' + encodeURIComponent(window.location.href);
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de la session:', error);
            window.location.href = 'login_student.html?redirect=' + encodeURIComponent(window.location.href);
        }
    };

    // Charger les examens disponibles
    const loadExams = async () => {
        try {
            const response = await fetch('api_exams.php', {
                method: 'GET',
                credentials: 'include'  // Ajoute les cookies de session
            });
            if (!response.ok) {
                throw new Error('Erreur de chargement des examens');
            }
            const exams = await response.json();
            populateExamSelect(exams);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de chargement des examens');
        }
    };

    // Remplir le menu déroulant avec les options des examens
    const populateExamSelect = (exams) => {
        for (let i = 0; i < exams.length; i++) {
            const exam = exams[i];
            const option = document.createElement('option');
            option.value = exam.id;
            option.textContent = `${exam.title} (Début: ${exam.date})`;
            examSelect.appendChild(option);
        }

        // Activer le bouton de démarrage si une option est sélectionnée
        examSelect.addEventListener('change', () => {
            startExamButton.disabled = !examSelect.value;
            examId = examSelect.value; // Met à jour examId lorsque l'utilisateur sélectionne un examen
        });
    };

    // Afficher les questions
    const displayQuestions = (questions) => {
        if (!Array.isArray(questions)) {
            console.error("Les questions ne sont pas un tableau :", questions);
            questionsSection.innerHTML = '<div>Erreur de chargement des questions</div>';
            return;
        }

        questionsSection.style.display = 'block'; // Afficher la section des questions
        examForm.innerHTML = ''; // Réinitialiser le formulaire

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');

            // Vérifier si la question est de type "mcq"
            if (question.type === 'mcq') {
                let optionsHtml = '';
                question.options.forEach((option) => {
                    optionsHtml += `
                        <div>
                            <input type="checkbox" name="answers[${question.id}][]" value="${option}">
                            <label>${option}</label>
                        </div>
                    `;
                });

                questionDiv.innerHTML = `
                    <label>${i + 1}. ${question.question}</label>
                    <div>${optionsHtml}</div>
                `;
            } else {
                // Cas par défaut, question ouverte ou autre type de question
                questionDiv.innerHTML = `
                    <label>${i + 1}. ${question.question}</label>
                    <input type="text" name="answers[${question.id}]" required>
                `;
            }

            examForm.appendChild(questionDiv);
        }

        // Ajouter le bouton de soumission à la fin
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Soumettre';
        examForm.appendChild(submitButton);
    };

    // Charger les questions de l'examen sélectionné
    const loadQuestions = async () => {
        if (!examId) return;
        try {
            const response = await fetch(`api_questions.php?exam_id=${examId}`, {
                method: 'GET',
                credentials: 'include'  // Ajoute les cookies de session
            });
            if (!response.ok) {
                throw new Error('Erreur de chargement des questions');
            }
            const data = await response.json();

            // Vérifie ici si data.questions est bien un tableau
            if (!Array.isArray(data.questions)) {
                throw new Error('Le format des données des questions est incorrect');
            }

            displayQuestions(data.questions);
        } catch (error) {
            console.error('Erreur:', error);
            questionsSection.innerHTML = '<div>Erreur de chargement des questions</div>';
        }
    };

    // Soumettre les réponses
    examForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(examForm);
        formData.append('exam_id', examId);

        try {
            const response = await fetch('submit_exam.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'  // Assure que les cookies de session sont envoyés
            });

            const textResponse = await response.text();
            try {
                const result = JSON.parse(textResponse);
                if (result.success) {
                    alert('Examen soumis avec succès!');
                    window.location.href = 'eleve_results.html';
                } else {
                    alert('Erreur lors de la soumission de l\'examen: ' + result.message);
                }
            } catch (jsonError) {
                console.error('Erreur de parsing JSON:', jsonError);
                alert('Erreur lors de la soumission. Réponse du serveur invalide.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la soumission.');
        }
    });

    // Événement pour démarrer l'examen
    startExamButton.addEventListener('click', async () => {
        if (examId) {
            await loadQuestions();
        }
    });

    // Initialisation
    verifierSession();
    loadExams();
});
