document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/exams/results');
        const result = await response.json();

        const resultsDiv = document.getElementById('results');
        if (result.success) {
            resultsDiv.innerHTML = `<p>Votre score : ${result.score}</p>`;
        } else {
            resultsDiv.innerHTML = `<p>Erreur: ${result.message}</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
