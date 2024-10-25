document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('send-btn');

    function loadMessages() {
        fetch('get_messages.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Convertit la réponse en JSON
            })
            .then(data => {
                console.log('Data received from get_messages.php:', data);

                // Vérifie si la réponse contient un champ 'success' et gère les erreurs
                if (data.success === false) {
                    console.error('Error from get_messages.php:', data.error);
                    return; // Arrête le chargement si une erreur est détectée
                }

                // Vérifie si data est un tableau pour afficher les messages
                if (Array.isArray(data)) {
                    chatBox.innerHTML = ''; // Efface les anciens messages

                    data.forEach(msg => {
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('message');
                        messageDiv.classList.add(msg.is_current_user ? 'sent' : 'received');
                        messageDiv.textContent = msg.message;
                        chatBox.appendChild(messageDiv);
                    });

                    chatBox.scrollTop = chatBox.scrollHeight; // Fait défiler jusqu'au bas de la boîte de messages
                } else {
                    console.error('Expected an array but got:', data);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    sendBtn.addEventListener('click', function () {
        const message = messageInput.value.trim();
        
        // Si le message n'est pas vide
        if (message) {
            fetch('send_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message }) // Envoie le message au format JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json(); // Convertit la réponse en JSON
            })
            .then(data => {
                console.log('Data received from send_message.php:', data);
                
                // Si l'envoi du message est réussi, recharge les messages
                if (data.success) {
                    messageInput.value = ''; // Efface le champ de saisie
                    loadMessages(); // Recharge les messages pour afficher le nouveau
                } else {
                    console.error('Error sending message:', data.error);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });

    // Recharge les messages toutes les 2 secondes
    setInterval(loadMessages, 2000);
});

document.addEventListener('DOMContentLoaded', function () {
    const chatBox = document.getElementById('chat-box');
    const messageInput = document.getElementById('message');
    const sendBtn = document.getElementById('send-btn');

    function loadMessages() {
        fetch('get_messages.php', {
            method: 'GET',
            credentials: 'same-origin' // Assure l'envoi des cookies de session
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received from get_messages.php:', data);
            if (data.success && Array.isArray(data.messages)) {
                chatBox.innerHTML = ''; // Efface les anciens messages
                data.messages.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');
                    messageDiv.classList.add(msg.is_current_user ? 'sent' : 'received');
                    messageDiv.textContent = msg.message;
                    chatBox.appendChild(messageDiv);
                });
                chatBox.scrollTop = chatBox.scrollHeight; // Fait défiler jusqu'au bas de la boîte de messages
            } else {
                console.error('Expected an array but got:', data);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    sendBtn.addEventListener('click', function () {
        const message = messageInput.value.trim();
        
        // Si le message n'est pas vide
        if (message) {
            fetch('send_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message }) // Envoie le message au format JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received from send_message.php:', data);
                
                // Si l'envoi du message est réussi, recharge les messages
                if (data.success) {
                    messageInput.value = ''; // Efface le champ de saisie
                    loadMessages(); // Recharge les messages pour afficher le nouveau
                } else {
                    console.error('Error sending message:', data.error);
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    });

    // Recharge les messages toutes les 2 secondes
    setInterval(loadMessages, 2000);
});
