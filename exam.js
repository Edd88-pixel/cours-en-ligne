document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/exams/current');
        const exam = await response.json();

        const form = document.getElementById('exam-form');

        exam.questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');

            let questionHTML = `<p>${question.question_text}</p>`;

            if (question.question_type === 'multiple_choice') {
                question.answers.forEach(answer => {
                    questionHTML += `
                        <label>
                            <input type="radio" name="question_${question.id}" value="${answer.id}">
                            ${answer.answer_text}
                        </label>
                    `;
                });
            } else if (question.question_type === 'true_false') {
                questionHTML += `
                    <label><input type="radio" name="question_${question.id}" value="true"> Vrai</label>
                    <label><input type="radio" name="question_${question.id}" value="false"> Faux</label>
                `;
            } else if (question.question_type === 'short_answer') {
                questionHTML += `<textarea name="question_${question.id}" rows="3"></textarea>`;
            }

            questionElement.innerHTML = questionHTML;
            form.insertBefore(questionElement, form.querySelector('button'));
        });

        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const answers = {};

            formData.forEach((value, key) => {
                answers[key] = value;
            });

            try {
                const response = await fetch('/api/exams/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(answers)
                });

                const result = await response.json();

                if (result.success) {
                    window.location.href = 'results.html';
                } else {
                    alert('Erreur: ' + result.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
