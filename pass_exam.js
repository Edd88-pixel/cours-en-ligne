document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('exam-form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        try {
            const response = await fetch('submit_exam.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors de la soumission de l\'examen');
            }
            
            const result = await response.json();
            alert(result.message);
            if (result.success) {
                window.location.href = 'eleve_results.html';
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la soumission de l\'examen.');
        }
    });
});
