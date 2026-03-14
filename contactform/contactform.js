document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const submitButton = document.getElementById('submit');

  if (!form || !submitButton) {
    console.error('Form elements not found');
    return;
  }

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all the fields!');
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email address!');
      return;
    }

    const formData = { 
      from_name: name, 
      from_email: email, 
      subject: subject, 
      message: message 
    };  // Match your EmailJS template placeholders

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", formData)
      .then(() => {
        alert('Message sent successfully!');
        form.reset();
      }, (error) => {
        console.error('Error:', error);
        alert('Error sending message! Please try again.');
      });
  });

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
});