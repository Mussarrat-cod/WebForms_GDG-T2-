/**
 * Function to control the visibility of the registration forms.
 * It hides all forms and shows only the one selected by the user.
 */
function showForm() {
    const selectedExam = document.getElementById('examSelect').value;
    
    // Get all form elements
    const jeeForm = document.getElementById('jeeForm');
    const neetForm = document.getElementById('neetForm');
    const cetForm = document.getElementById('cetForm');

    // Hide all forms initially
    jeeForm.style.display = 'none';
    neetForm.style.display = 'none';
    cetForm.style.display = 'none';

    // Show the selected form
    if (selectedExam === 'jee') {
        jeeForm.style.display = 'block';
    } else if (selectedExam === 'neet') {
        neetForm.style.display = 'block';
    } else if (selectedExam === 'cet') {
        cetForm.style.display = 'block';
    }
}

/**
 * Event listener for form submission.
 * Prevents default submission and simulates data processing.
 */
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.registration-form');

    forms.forEach(form => {
        form.addEventListener('submit', async function(event) {
            event.preventDefault(); // Stop the form from submitting normally
            
            const formId = this.id;
            const examName = this.querySelector('h2').textContent.replace('Registration', '').trim();
            
            // Prepare form data
            const formData = new FormData(this);
            const formObject = {};
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            // Send data to the backend
            try {
                const response = await fetch('http://localhost:3000/api/submit-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        formId: formId,
                        formData: formObject
                    })
                });
                
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Failed to submit form');
                
                console.log('Form data saved successfully:', result);
            } catch (error) {
                console.error('Error saving form data:', error);
                alert('⚠️ Error saving form data. Please try again.');
                return; // Stop further execution if there's an error
            }

            alert(`✅ Success! Simulated registration for ${examName} completed. Check the console for data simulation details (if implemented).`);
            
            // Optional: Clear the form after submission
            this.reset();
            document.getElementById('examSelect').value = '';
            showForm(); // Hide the form after reset
        });
    });
});