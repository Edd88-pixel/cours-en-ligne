document.addEventListener('DOMContentLoaded', function() {
    const examId = document.getElementById('exam_id').value;

    fetch(`/api/questions?exam_id=${examId}`)
        .then(response => response.json())
        .then(data => {
            const questionsContainer = document.getElementById('questions-container');
            data.forEach(question => {
                const questionElement = document.createElement('div');
                questionElement.innerHTML = `
                    <label>${question.question}</label>
                    <input type="hidden" name="question_ids[]" value="${question.id}">
                    <input type="text" name="answers[]" required>
                `;
                questionsContainer.appendChild(questionElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des questions:', error));
});
