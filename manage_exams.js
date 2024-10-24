document.addEventListener('DOMContentLoaded', () => {
    const createExamForm = document.getElementById('create-exam-form');
    const manualQuestionsForm = document.getElementById('manual-questions-form');
    const questionsContainer = document.getElementById('questions-container');
    const addQuestionButton = document.getElementById('add-question');
    const addMcqButton = document.getElementById('add-mcq');
    const examTableBody = document.querySelector('table tbody');
    const examSelect = document.getElementById('exam-select');

    // Fonction pour charger les examens existants depuis la base de données
    async function loadExams() {
        try {
            const response = await fetch('manage_exams.php');
            const result = await response.json();

            if (result.success) {
                examSelect.innerHTML = ''; // Réinitialiser la liste déroulante
                examTableBody.innerHTML = ''; // Réinitialiser le tableau

                result.exams.forEach(exam => {
                    // Ajouter les examens dans le tableau
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${exam.title}</td>
                        <td>${exam.description}</td>
                        <td>${exam.start_time}</td>
                        <td>${exam.end_time}</td>
                    `;
                    examTableBody.appendChild(newRow);

                    // Ajouter les examens dans la liste déroulante
                    const option = document.createElement('option');
                    option.value = exam.id;
                    option.textContent = exam.title;
                    examSelect.appendChild(option);
                });
            } else {
                console.error('Erreur lors du chargement des examens:', result.message);
            }
        } catch (error) {
            console.error('Erreur de chargement des examens:', error);
        }
    }

    // Charger les examens au démarrage
    loadExams();

    // Fonction pour charger les questions pour l'examen sélectionné
    async function loadQuestionsForExam(examId) {
        try {
            const response = await fetch(`manage_exams.php?exam_id=${examId}`);
            const result = await response.json();

            if (result.success) {
                questionsContainer.innerHTML = ''; // Vider le conteneur avant de charger les questions

                result.questions.forEach((question, index) => {
                    const questionDiv = document.createElement('div');
                    questionDiv.classList.add('question');

                    // Affichage des questions selon le type (manuelle ou QCM)
                    if (question.type === 'manual') {
                        // Question simple (manuelle)
                        questionDiv.innerHTML = `
                            <p>${index + 1}. ${question.question}</p>
                            <input type="text" name="answers[${question.id}]" required>
                        `;
                    } else if (question.type === 'mcq') {
                        // Question à choix multiples (QCM)
                        questionDiv.innerHTML = `<p>${index + 1}. ${question.question}</p>`;
                        question.options.forEach((option, optIndex) => {
                            const optionLabel = document.createElement('label');
                            optionLabel.innerHTML = `
                                <input type="radio" name="mcq_answers[${question.id}]" value="${optIndex + 1}" required> 
                                ${option}
                            `;
                            questionDiv.appendChild(optionLabel);
                        });
                    }

                    questionsContainer.appendChild(questionDiv);
                });
            } else {
                console.error('Erreur lors du chargement des questions:', result.message);
            }
        } catch (error) {
            console.error('Erreur de chargement des questions:', error);
        }
    }

    // Charger les questions lors de la sélection d'un examen
    examSelect.addEventListener('change', () => {
        const selectedExamId = examSelect.value;
        if (selectedExamId) {
            loadQuestionsForExam(selectedExamId);
        }
    });

    // Ajouter une question manuelle
    addQuestionButton.addEventListener('click', () => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        questionDiv.innerHTML = `
            <label>Question :</label>
            <input type="text" name="questions[]" required>
            <label>Réponse :</label>
            <input type="text" name="answers[]" required>
            <button type="button" class="remove-question">Supprimer</button>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    // Ajouter un QCM
    addMcqButton.addEventListener('click', () => {
        const mcqDiv = document.createElement('div');
        mcqDiv.classList.add('mcq');

        mcqDiv.innerHTML = `
            <label>Question (QCM) :</label>
            <input type="text" name="mcq_questions[]" required>
            <label>Options (séparées par des virgules) :</label>
            <input type="text" name="mcq_options[]" required>
            <label>Réponse correcte :</label>
            <select name="mcq_correct[]" required>
                <option value="">Sélectionnez la bonne réponse</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
                <option value="4">Option 4</option>
            </select>
            <button type="button" class="remove-question">Supprimer</button>
        `;
        questionsContainer.appendChild(mcqDiv);
    });

    // Supprimer une question
    questionsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-question')) {
            event.target.parentElement.remove();
        }
    });

    // Fonction pour gérer la réponse du serveur
    async function handleResponse(response) {
        try {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const text = await response.text();
            console.log("Réponse brute du serveur :", text);
            const result = JSON.parse(text);
            return result;
        } catch (error) {
            console.error('Erreur de parsing ou réponse non valide:', error);
            throw error;
        }
    }

    // Soumettre le formulaire de création d'examen
    createExamForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(createExamForm);
        console.log("Données envoyées pour la création de l'examen :", [...formData.entries()]);

        try {
            const response = await fetch('manage_exams.php', {
                method: 'POST',
                body: formData
            });

            const result = await handleResponse(response);
            console.log("Réponse du serveur pour la création de l'examen :", result);

            if (result.success) {
                alert(result.message);

                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${result.exam.title}</td>
                    <td>${result.exam.description}</td>
                    <td>${result.exam.start_time}</td>
                    <td>${result.exam.end_time}</td>
                `;
                examTableBody.appendChild(newRow);

                const option = document.createElement('option');
                option.value = result.exam.id;
                option.textContent = result.exam.title;
                examSelect.appendChild(option);

                createExamForm.reset();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue.');
        }
    });

    // Soumettre le formulaire des questions manuelles et QCM
    manualQuestionsForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(manualQuestionsForm);
        formData.append('exam_id', examSelect.value); // Ajouter l'ID de l'examen sélectionné

        console.log("Données envoyées pour les questions :", [...formData.entries()]);

        try {
            const response = await fetch('manage_exams.php', {
                method: 'POST',
                body: formData
            });

            const result = await handleResponse(response);
            console.log("Réponse du serveur pour les questions :", result);

            if (result.success) {
                alert(result.message);
                manualQuestionsForm.reset();
                questionsContainer.innerHTML = ''; // Effacer le conteneur des questions
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue.');
        }
    });
});
