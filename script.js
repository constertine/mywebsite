// Form validation and submission handling
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formStatus = document.createElement('div');
  formStatus.className = 'form-status';
  
  if (contactForm) {
    // Add the status element after the form
    contactForm.after(formStatus);
    
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="submit-icon fa-solid fa-spinner fa-spin"></i>';
      
      // Get form data
      const formData = new FormData(contactForm);
      const formDataObj = {};
      formData.forEach((value, key) => {
        formDataObj[key] = value;
      });
      
      // Validate form data
      if (!validateForm(formDataObj)) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="submit-icon fa-solid fa-paper-plane"></i>';
        return;
      }
      
      // Send form data using EmailJS service
      emailjs.send('service_id', 'template_id', formDataObj, 'user_id')
        .then(function(response) {
          formStatus.innerHTML = '<div class="success-message">Message sent successfully!</div>';
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <i class="submit-icon fa-solid fa-paper-plane"></i>';
          
          // Clear success message after 5 seconds
          setTimeout(() => {
            formStatus.innerHTML = '';
          }, 5000);
        })
        .catch(function(error) {
          console.error('Error:', error);
          formStatus.innerHTML = '<div class="error-message">Failed to send message. Please try again.</div>';
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Message <i class="submit-icon fa-solid fa-paper-plane"></i>';
        });
    });
  }
  
  function validateForm(data) {
    let isValid = true;
    formStatus.innerHTML = '';
    
    // Check for empty required fields
    if (!data.name || data.name.trim() === '') {
      formStatus.innerHTML += '<div class="error-message">Please enter your name</div>';
      isValid = false;
    }
    
    if (!data.email || data.email.trim() === '') {
      formStatus.innerHTML += '<div class="error-message">Please enter your email</div>';
      isValid = false;
    } else if (!isValidEmail(data.email)) {
      formStatus.innerHTML += '<div class="error-message">Please enter a valid email address</div>';
      isValid = false;
    }
    
    if (!data.message || data.message.trim() === '') {
      formStatus.innerHTML += '<div class="error-message">Please enter your message</div>';
      isValid = false;
    }
    
    return isValid;
  }
  
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
});