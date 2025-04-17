document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleContainer = document.querySelector('.toggle-container');
    let isSidebarVisible = true;

    // Toggle sidebar
    toggleBtn.addEventListener('click', () => {
        isSidebarVisible = !isSidebarVisible;
        if (isSidebarVisible) {
            sidebar.style.transform = 'translateX(0)';
            content.style.marginLeft = window.innerWidth <= 768 ? '70px' : 'var(--sidebar-width)';
            toggleContainer.style.left = window.innerWidth <= 768 ? '1rem' : 'calc(var(--sidebar-width) - 3rem)';
        } else {
            sidebar.style.transform = 'translateX(-100%)';
            content.style.marginLeft = '0';
            toggleContainer.style.left = '1rem';
        }
    });

    // Handle responsive behavior
    window.addEventListener('resize', () => {
        if (isSidebarVisible) {
            content.style.marginLeft = window.innerWidth <= 768 ? '70px' : 'var(--sidebar-width)';
            toggleContainer.style.left = window.innerWidth <= 768 ? '1rem' : 'calc(var(--sidebar-width) - 3rem)';
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Validate required fields
            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Create form data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('subject', subject);
            formData.append('message', message);

            // Send form data to PHP script
            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    if (data.success) {
                        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
                        contactForm.reset();
                    } else {
                        submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${data.message || 'Failed to send'}`;
                    }
                } catch (e) {
                    console.error('Error parsing response:', text);
                    submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Server error';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to send';
            })
            .finally(() => {
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }
}); 