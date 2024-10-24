document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/profile')
        .then(response => response.json())
        .then(data => {
            const profileInfo = document.getElementById('profile-info');
            profileInfo.innerHTML = `
                <p><strong>Nom d'utilisateur:</strong> ${data.username}</p>
                <p><strong>Rôle:</strong> ${data.role}</p>
            `;
        })
        .catch(error => console.error('Erreur lors du chargement des informations du profil:', error));
});
