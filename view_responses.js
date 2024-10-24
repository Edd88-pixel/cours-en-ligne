document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/exams')
        .then(response => response.json())
        .then(data => {
            const examSelect = document.getElementById('exam_id');
            data.forEach(exam => {
                const option = document.createElement('option');
                option.value = exam.id;
                option.textContent = exam.title;
                examSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des examens:', error));
});

function loadResponses() {
    const examId = document.getElementById('exam_id').value;

    fetch(`/api/responses?exam_id=${examId}`)
        .then(response => response.json())
        .then(data => {
            const responsesList = document.getElementById('responses-list');
            responsesList.innerHTML = ''; // Clear previous responses
            data.forEach(response => {
                const responseElement = document.createElement('div');
                responseElement.innerHTML = `
                    <h3>Élève ID: ${response.student_id}</h3>
                    <p><strong>Question ID:</strong> ${response.question_id}</p>
                    <p><strong>Réponse:</strong> ${response.answer}</p>
                `;
                responsesList.appendChild(responseElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des réponses:', error));
}
