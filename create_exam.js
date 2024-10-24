// create_exam.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-exam-form');

    form.addEventListener('submit', function(event) {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const startTime = document.getElementById('start_time').value;
        const endTime = document.getElementById('end_time').value;

        // Simple validation before submitting the form
        if (!title || !description || !startTime || !endTime) {
            event.preventDefault();
            alert('Tous les champs sont obligatoires.');
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            event.preventDefault();
            alert('L\'heure de début doit être avant l\'heure de fin.');
            return;
        }
    });
});
