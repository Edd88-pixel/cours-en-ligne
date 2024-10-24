document.addEventListener('DOMContentLoaded', function() {
    console.log('Homepage JavaScript loaded.');

    // Example: Add interactivity if needed

    // Check if there are any notifications or messages
    const messageElement = document.querySelector('#message');
    if (messageElement) {
        setTimeout(() => {
            messageElement.style.opacity = 0;
        }, 5000); // Hide the message after 5 seconds
    }

    // Event listener for button clicks
    const btnLogin = document.querySelector('.btn-login');
    const btnRegister = document.querySelector('.btn-register');

    if (btnLogin) {
        btnLogin.addEventListener('click', function() {
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }

    if (btnRegister) {
        btnRegister.addEventListener('click', function() {
            // Redirect to registration page
            window.location.href = 'register.html';
        });
    }

    // Example: Handle form validation
    const loginForm = document.querySelector('#loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = document.querySelector('#username');
            const password = document.querySelector('#password');

            if (!username.value || !password.value) {
                event.preventDefault();
                alert('Veuillez remplir tous les champs.');
            }
        });
    }
});
