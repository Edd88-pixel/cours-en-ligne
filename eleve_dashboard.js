document.addEventListener('DOMContentLoaded', () => {
    // Fonction pour charger la liste des examens
    const loadExams = async () => {
        try {
            const response = await fetch('api_exams.php');
            if (!response.ok) {
                throw new Error('Erreur de chargement des examens');
            }
            const exams = await response.json();
            displayExams(exams);
        } catch (error) {
            console.error('Erreur:', error);
            document.getElementById('exam-list').innerHTML = '<p>Erreur de chargement des examens</p>';
        }
    };

    // Fonction pour afficher la liste des examens
    const displayExams = (exams) => {
        const examList = document.getElementById('exam-list');
        examList.innerHTML = '';
        exams.forEach(exam => {
            const examElement = document.createElement('p');
            examElement.textContent = `Examen: ${exam.title} - Date: ${exam.date}`;
            examList.appendChild(examElement);
        });
    };

    // Appel de la fonction de chargement des examens au chargement de la page
    loadExams();

    // Déconnexion
    document.getElementById('logout').addEventListener('click', () => {
        // Envoyer la requête pour déconnecter
        fetch('logout.php').then(() => {
            window.location.href = 'login.html';
        });
    });
    
    // Gérer la fermeture d'onglet pour mettre à jour le statut de session
    window.addEventListener('beforeunload', function () {
        navigator.sendBeacon('logout.php');
    });
});
  