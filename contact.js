document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");

    contactForm.addEventListener("submit", function(event) {
        if (!validateForm()) {
            event.preventDefault();
        }
    });

    function validateForm() {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        clearErrors();
        let isValid = true;

        if (name === "") {
            showError("name", "Le nom est requis.");
            isValid = false;
        }

        if (email === "") {
            showError("email", "L'email est requis.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError("email", "Veuillez entrer un email valide.");
            isValid = false;
        }

        if (message === "") {
            showError("message", "Le message est requis.");
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.createElement("div");
        errorElement.classList.add("error-message");
        errorElement.textContent = message;
        field.parentElement.appendChild(errorElement);
        field.classList.add("error");
    }

    function clearErrors() {
        const errors = document.querySelectorAll(".error-message");
        errors.forEach(function(error) {
            error.remove();
        });

        const fields = document.querySelectorAll(".error");
        fields.forEach(function(field) {
            field.classList.remove("error");
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
