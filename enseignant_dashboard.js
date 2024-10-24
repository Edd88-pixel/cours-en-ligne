document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Enseignant chargé.');

    // Sélection de l'élément où les examens seront affichés
    const examList = document.getElementById('exam-list');

    // Fonction pour récupérer les examens récents depuis la base de données
    async function loadRecentExams() {
        try {
            const response = await fetch('get_recent_exams.php');
            if (!response.ok) {
                const errorText = await response.text(); // Lire la réponse en texte pour débogage
                throw new Error(`Erreur ${response.status}: ${errorText}`);
            }
            const exams = await response.json();

            // Vérification et affichage des examens
            examList.innerHTML = ''; // Nettoyage de la liste existante
            if (exams.length === 0) {
                examList.innerHTML = '<p>Aucun examen récent trouvé.</p>';
            } else {
                exams.forEach(exam => {
                    const examItem = document.createElement('div');
                    examItem.className = 'exam-item';
                    examItem.innerHTML = `<strong>${exam.title}</strong><br>Date: ${exam.date}`;
                    examList.appendChild(examItem);
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            examList.innerHTML = '<p>Erreur lors du chargement des examens récents.</p>';
        }
    }

    // Charger les examens au chargement de la page
    loadRecentExams();
});