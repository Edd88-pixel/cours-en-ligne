document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    if (form) {
        form.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // Simple validation côté client
            if (!username || !password) {
                event.preventDefault();
                alert('Veuillez remplir tous les champs.');
            }
        });
    } else {
        console.error('Form element not found.');
    }
});
