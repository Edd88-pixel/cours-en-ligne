// create_question.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-question-form');
    const answerType = document.getElementById('answer_type');
    const openAnswerContainer = document.getElementById('open-answer-container');
    const qcmContainer = document.getElementById('qcm-container');
    const addChoiceBtn = document.getElementById('add-choice');
    const choicesContainer = document.getElementById('choices-container');
    
    // Affichage dynamique en fonction du type de question (ouverte ou QCM)
    answerType.addEventListener('change', function () {
        if (this.value === 'ouverte') {
            openAnswerContainer.style.display = 'block';
            qcmContainer.style.display = 'none';
        } else if (this.value === 'qcm') {
            openAnswerContainer.style.display = 'none';
            qcmContainer.style.display = 'block';
        }
    });

    // Ajouter une nouvelle option de réponse pour les QCM
    addChoiceBtn.addEventListener('click', function () {
        const newChoice = document.createElement('div');
        newChoice.classList.add('choice');
        newChoice.innerHTML = `<input type="text" name="choices[]" placeholder="Nouvelle Option">`;
        choicesContainer.appendChild(newChoice);
    });

    // Validation du formulaire lors de la soumission
    form.addEventListener('submit', function(event) {
        const examId = document.getElementById('exam_id').value;
        const question = document.getElementById('question').value.trim();
        const answerTypeValue = answerType.value;

        // Validation de base (ID d'examen et question)
        if (!examId || !question) {
            event.preventDefault();
            alert('L\'ID de l\'examen et la question sont obligatoires.');
            return;
        }

        // Validation pour les questions ouvertes
        if (answerTypeValue === 'ouverte') {
            const answer = document.getElementById('answer').value.trim();
            if (!answer) {
                event.preventDefault();
                alert('Veuillez fournir une réponse pour la question ouverte.');
                return;
            }
        }

        // Validation pour les QCM
        if (answerTypeValue === 'qcm') {
            const choices = document.querySelectorAll('input[name="choices[]"]');
            const correctChoice = document.getElementById('correct_choice').value;

            // Vérifier s'il y a au moins deux options
            if (choices.length < 2) {
                event.preventDefault();
                alert('Veuillez ajouter au moins deux options pour le QCM.');
                return;
            }

            // Vérifier si toutes les options sont remplies
            let emptyChoiceFound = false;
            choices.forEach(choice => {
                if (choice.value.trim() === '') {
                    emptyChoiceFound = true;
                }
            });
            if (emptyChoiceFound) {
                event.preventDefault();
                alert('Toutes les options de réponse doivent être remplies.');
                return;
            }

            // Vérifier si la bonne réponse est spécifiée et est un numéro valide
            if (!correctChoice || correctChoice < 1 || correctChoice > choices.length) {
                event.preventDefault();
                alert('Veuillez spécifier un numéro valide pour la bonne réponse.');
                return;
            }
        }

        // Si tout est correct, on soumet le formulaire
        alert('Question créée avec succès.');
    });
});
