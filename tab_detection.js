document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Envoi de la notification au serveur lorsque l'onglet est caché
        fetch('/api/monitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: 'tab_changed',
                timestamp: new Date().toISOString(),
                user_id: 1 // Remplacez ceci par l'ID réel de l'utilisateur connecté
            })
        }).catch(error => {
            console.error('Erreur lors de l\'envoi de la notification de changement d\'onglet:', error);
        });
    }
});
