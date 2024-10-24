document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/exams')
        .then(response => response.json())
        .then(data => {
            const examsList = document.getElementById('exams-list');
            data.forEach(exam => {
                const examElement = document.createElement('div');
                examElement.innerHTML = `
                    <h2>${exam.title}</h2>
                    <p>${exam.description}</p>
                    <p><strong>Début:</strong> ${exam.start_time}</p>
                    <p><strong>Fin:</strong> ${exam.end_time}</p>
                `;
                examsList.appendChild(examElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement des examens:', error));
});
