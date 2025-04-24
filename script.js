document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const content = document.querySelector('.content');
    let isSidebarOpen = false;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    // Function to close sidebar
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('visible');
            document.body.style.overflow = '';
            isSidebarOpen = false;
        }
    }

    // Function to toggle sidebar
    function toggleSidebar() {
        if (window.innerWidth > 768) {
            // Desktop behavior
            sidebar.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        } else {
            // Mobile behavior
            isSidebarOpen = !isSidebarOpen;
            if (isSidebarOpen) {
                sidebar.classList.add('open');
                overlay.classList.add('visible');
                document.body.style.overflow = 'hidden';
            } else {
                closeSidebar();
            }
        }
    }

    // Event Listeners
    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Close sidebar when clicking navigation links
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        } else {
            sidebar.classList.remove('collapsed');
            content.classList.remove('collapsed');
        }
    });

    // Handle tab changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            closeSidebar();
        }
    });

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                alert('Please fill in all required fields');
                return;
            }

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('subject', subject);
            formData.append('message', message);

            fetch('send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
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