document.addEventListener('DOMContentLoaded', function() {
    const studentList = document.getElementById('student-list');

    // Fonction pour récupérer les données des élèves
    async function fetchStudentData() {
        try {
            const response = await fetch('get_student_status.php');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données.');
            }
            const studentData = await response.json();
            
            // Effacer la liste précédente
            studentList.innerHTML = '';

            if (studentData.length === 0 || studentData.message) {
                studentList.innerHTML = '<p>Aucun étudiant en ligne.</p>';
            } else {
                studentData.forEach(student => {
                    const studentItem = document.createElement('div');
                    studentItem.className = 'student-item';

                    // Vérifier le statut de la session
                    const status = student.session_status === 'online' ? 'En ligne' : 'Hors ligne';
                    const statusClass = student.session_status === 'online' ? 'student-online' : 'student-offline';

                    studentItem.innerHTML = `
                        <span>${student.username}</span>
                        <span class="${statusClass}">${status}</span>
                    `;

                    studentList.appendChild(studentItem);
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            studentList.innerHTML = '<p>Erreur de chargement des données des élèves.</p>';
        }
    }

    // Polling toutes les 10 secondes
    setInterval(fetchStudentData, 10000);

    // Charger les données au chargement de la page
    fetchStudentData();
});
