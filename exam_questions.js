document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const examId = queryParams.get('exam_id');
    const questionsSection = document.getElementById('questions-section');
    const examForm = document.getElementById('exam-form');

    // Charger les questions de l'examen
    const loadQuestions = async () => {
        try {
            const response = await fetch(`api_questions.php?exam_id=${examId}`);
            if (!response.ok) {
                throw new Error('Erreur de chargement des questions');
            }
            const questions = await response.json();
            displayQuestions(questions);
        } catch (error) {
            console.error('Erreur:', error);
            questionsSection.innerHTML = '<div>Erreur de chargement des questions</div>';
        }
    };

    // Afficher les questions
    const displayQuestions = (questions) => {
        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-item');
            questionDiv.innerHTML = `
                <label>${index + 1}. ${question.question}</label>
                <input type="text" name="answers[${question.id}]" required>
            `;
            examForm.insertBefore(questionDiv, examForm.querySelector('button[type="submit"]'));
        });
    };

    // Soumettre les réponses
    examForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(examForm);
        formData.append('exam_id', examId);

        try {
            const response = await fetch('submit_exam.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                alert('Examen soumis avec succès!');
                window.location.href = 'eleve_results.html';
            } else {
                alert('Erreur lors de la soumission de l\'examen: ' + result.message);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la soumission.');
        }
    });

    
    // Charger les questions au démarrage
    loadQuestions();
});
