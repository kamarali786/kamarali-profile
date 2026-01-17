// ========== DEVELOPER TOOLS PROTECTION ==========
(function () {
    'use strict';

    // Hide overlay initially
    const overlay = document.getElementById('protectionOverlay');

    // Store original console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug
    };

    // Disable console methods
    console.log = console.warn = console.error = console.info = console.debug = function () {
        // Optionally log to a hidden element or do nothing
    };

    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }

        // Ctrl+Shift+I
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }

        // Ctrl+Shift+J
        if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }

        // Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }
    });

    // Right-click protection
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showToast("🔒 Right-click is disabled on this portfolio");
        return false;
    });

    // Disable text selection
    document.addEventListener('selectstart', function (e) {
        e.preventDefault();
        return false;
    });

    // Disable drag and drop
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    // Detect DevTools by checking window size difference
    let devToolsOpen = false;

    function checkDevTools() {
        const threshold = 160;
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;

        if ((widthDiff > threshold || heightDiff > threshold) && !devToolsOpen) {
            devToolsOpen = true;
            showProtectionOverlay();
        }
    }

    // Check periodically
    setInterval(checkDevTools, 1000);

    function showProtectionOverlay() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: var(--laravel);
                    color: white;
                    padding: 0.8rem 1.5rem;
                    border-radius: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 0.9rem;
                    z-index: 99999;
                    box-shadow: 0 5px 15px rgba(255, 45, 32, 0.3);
                    animation: slideUp 0.3s ease;
                `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Add animations for toast
    const style = document.createElement('style');
    style.textContent = `
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
            `;
    document.head.appendChild(style);

})();

// ========== PORTFOLIO FUNCTIONALITY ==========

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');

    if (document.documentElement.classList.contains('light')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Mobile Menu
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Typewriter Effect
const typingText = document.querySelector('.typing-text');
const texts = ['Backend Developer', 'PHP Expert', 'Laravel Specialist', 'API Architect', 'Database Guru'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isEnd = false;

function typeWriter() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isEnd = true;
        setTimeout(() => {
            isDeleting = true;
        }, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex++;
        if (textIndex === texts.length) {
            textIndex = 0;
        }
    }

    const speed = isDeleting ? 50 : isEnd ? 100 : 150;
    setTimeout(typeWriter, speed);
}

// Start typewriter effect
setTimeout(typeWriter, 1000);

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    };

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert(`Thank you, ${formData.name}! Your proposal request has been sent. I'll review it and get back to you within 24 hours.`);

        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Reset labels
        document.querySelectorAll('.form-label').forEach(label => {
            label.style.top = '1rem';
            label.style.fontSize = '1rem';
            label.style.background = 'transparent';
            label.style.color = '';
        });
    }, 1500);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.terminal-header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.skill-category, .project-card, .contact-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Initial greeting (protected by our console override)
window.onload = function () {
    console.log = function () {
        // Empty function to block console logs
    };
};
// Skills Section Animations
document.addEventListener('DOMContentLoaded', function () {
    // Animate progress bars
    const progressItems = document.querySelectorAll('.progress-item');

    const animateProgress = () => {
        progressItems.forEach(item => {
            const fill = item.querySelector('.progress-fill');
            const percent = item.querySelector('.progress-percent');
            const targetWidth = fill.getAttribute('data-width');
            const targetPercent = percent.getAttribute('data-target');

            let currentWidth = 0;
            let currentPercent = 0;
            const increment = targetWidth / 50;

            const progressTimer = setInterval(() => {
                if (currentWidth >= targetWidth) {
                    clearInterval(progressTimer);
                } else {
                    currentWidth += increment;
                    currentPercent += (targetPercent / 50);
                    fill.style.width = currentWidth + '%';
                    percent.textContent = Math.round(currentPercent) + '%';
                }
            }, 20);
        });
    };

    // Animate skill cards
    const skillCards = document.querySelectorAll('.skill-card');

    const animateCards = () => {
        skillCards.forEach((card, index) => {
            const delay = parseInt(card.getAttribute('data-delay')) || 0;

            setTimeout(() => {
                card.classList.add('animated');
                card.style.animationDelay = (index * 100) + 'ms';
            }, delay);
        });
    };

    // Skill wheel interaction
    const wheelItems = document.querySelectorAll('.wheel-item');
    const skillDetail = document.getElementById('skillDetail');

    const skillDetails = {
        0: {
            icon: 'fab fa-php',
            title: 'PHP Development',
            desc: 'Building dynamic web applications with PHP. Expertise in OOP, MVC architecture, and server-side logic.'
        },
        1: {
            icon: 'fab fa-laravel',
            title: 'Laravel Framework',
            desc: 'Modern PHP framework for elegant web applications. Experience in routing, middleware, and Eloquent ORM.'
        },
        2: {
            icon: 'fas fa-database',
            title: 'MySQL Database',
            desc: 'Database design, optimization, and complex query writing. Proficient in database normalization and indexing.'
        },
        3: {
            icon: 'fab fa-js',
            title: 'JavaScript & jQuery',
            desc: 'Interactive frontend development. DOM manipulation, AJAX requests, and dynamic content loading.'
        },
        4: {
            icon: 'fab fa-git-alt',
            title: 'Git Version Control',
            desc: 'Source code management with Git. Experience in branching, merging, and collaborative development.'
        },
        5: {
            icon: 'fab fa-bootstrap',
            title: 'Bootstrap Framework',
            desc: 'Responsive web design with Bootstrap. Creating mobile-first, cross-browser compatible interfaces.'
        }
    };

    wheelItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const index = item.getAttribute('data-index');
            const detail = skillDetails[index];

            skillDetail.innerHTML = `
                <div class="detail-content">
                    <i class="${detail.icon}"></i>
                    <div>
                        <h4>${detail.title}</h4>
                        <p>${detail.desc}</p>
                    </div>
                </div>
            `;

            // Add active class to wheel item
            wheelItems.forEach(wheelItem => wheelItem.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Add rotation animation to wheel
    const wheel = document.querySelector('.wheel');
    let rotation = 0;

    function rotateWheel() {
        rotation += 0.2;
        wheel.style.transform = `rotate(${rotation}deg)`;
        requestAnimationFrame(rotateWheel);
    }

    wheel.addEventListener('mouseenter', () => {
        rotation = 0;
        rotateWheel();
    });

    wheel.addEventListener('mouseleave', () => {
        rotation = 0;
        wheel.style.transform = 'rotate(0deg)';
    });

    // Intersection Observer for animations
    const skillsSection = document.getElementById('skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgress();
                animateCards();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(skillsSection);
});

/* ================= EMAILJS SETUP ================= */

(function () {
    emailjs.init("ld7KH-e2_PdMCcmrE"); // your public key
})();

const form = document.getElementById("contact-form");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";

    try {
        const fileInput = document.getElementById("imageInput");
        let attachment = "";

        if (fileInput.files.length > 0) {
            attachment = await toBase64(fileInput.files[0]);
        }

        const templateParams = {
            from_name: form.from_name.value,
            reply_to: form.reply_to.value,
            subject: form.subject.value,
            message: form.message.value,
            attachment: attachment
        };

        await emailjs.send(
            "service_4drocoa",
            "template_tncnn79",
            templateParams
        );

        document.getElementById("formSuccess").style.display = "block";
        form.reset();

    } catch (error) {
        console.error("EmailJS Error:", error);
        alert("❌ Failed to send message. Try again later.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalText;
    }
});

/* ================= BASE64 HELPER ================= */
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}
