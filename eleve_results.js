document.addEventListener('DOMContentLoaded', () => {
    const loadResults = async () => {
        try {
            const response = await fetch('api_results.php');
            if (!response.ok) {
                throw new Error('Erreur de chargement des résultats');
            }
            const results = await response.json();
            displayResults(results);
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('results-section').innerHTML = '<div>Erreur de chargement des résultats</div>';
        }
    };

    const displayResults = (results) => {
        const section = document.getElementById('results-section');
        results.forEach(result => {
            const div = document.createElement('div');
            div.className = 'result';
            div.innerHTML = `
                <h3>${result.exam_title}</h3>
                <p>Score: ${result.score}%</p>
            `;
            section.appendChild(div);
        });
    };

    loadResults();
});
