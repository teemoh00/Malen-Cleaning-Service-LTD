document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed navbar height
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar Background Change on Scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.backgroundColor = '#FFFFFF';
        }
    });

    // Animate Statistics Counter
    const statsSection = document.querySelector('.stats');
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const animateStats = () => {
        const sectionTop = statsSection.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (sectionTop < screenHeight - 100 && !animated) {
            animated = true;
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const duration = 2000; // Animation duration in ms
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current) + '+';
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.innerText = target + '+';
                    }
                };
                updateCount();
            });
        }
    };

    window.addEventListener('scroll', animateStats);

    // Typing Animation
    const typingText = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const statements = [
        "Professional cleaning solutions for residential and commercial spaces.",
        "Expert cleaning services for homes and businesses.",
        "Reliable cleaning services for both domestic and commercial properties.",
        "Quality cleaning services tailored for households and workplaces."
    ];

    let statementIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 40; // Initial speed

    function type() {
        if (!typingText) return;

        const currentStatement = statements[statementIndex];

        if (isDeleting) {
            typingText.textContent = currentStatement.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 20; // Faster deleting speed
        } else {
            typingText.textContent = currentStatement.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 40; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentStatement.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of statement
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            statementIndex = (statementIndex + 1) % statements.length;
            typeSpeed = 500; // Pause before typing next statement
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing if element exists
    if (typingText) {
        type();
    }
    // Typing Animation logic ends here

    // Custom Notification System
    const showNotification = (message, type = 'success') => {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `notification-toast ${type}`;

        const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const title = type === 'success' ? 'Success' : 'Error';

        toast.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;

        container.appendChild(toast);

        // Close button functionality
        const closeBtn = toast.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => {
                    toast.remove();
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }, 300);
            }
        }, 5000);
    };

    // Form Submission Handling
    const handleFormSubmission = (formSelector) => {
        const form = document.querySelector(formSelector);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;

                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        body: new FormData(form),
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        showNotification('Message sent successfully! We will get back to you shortly.', 'success');
                        form.reset();
                    } else {
                        const data = await response.json();
                        if (Object.hasOwn(data, 'errors')) {
                            showNotification(data["errors"].map(error => error["message"]).join(", "), 'error');
                        } else {
                            showNotification('Oops! There was a problem submitting your form. Please try again.', 'error');
                        }
                    }
                } catch (error) {
                    showNotification('Error submitting form. Please check your internet connection and try again.', 'error');
                } finally {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                }
            });
        }
    };

    handleFormSubmission('.contact-form');
    handleFormSubmission('.booking-form');

    // WhatsApp Button Injection
    const whatsappNumber = "254790834422";
    const whatsappMessage = "Hello, I would like to inquire about your cleaning services.";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const whatsappButton = document.createElement('a');
    whatsappButton.href = whatsappURL;
    whatsappButton.target = "_blank";
    whatsappButton.className = "whatsapp-float";
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i><span>Chat with Us</span>';
    document.body.appendChild(whatsappButton);
});
