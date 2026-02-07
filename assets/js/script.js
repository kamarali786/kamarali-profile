// ========== DEVELOPER TOOLS PROTECTION ==========
(function () {
    'use strict';

    const overlay = document.getElementById('protectionOverlay');

    ['log', 'warn', 'error', 'info', 'debug'].forEach(fn => {
        console[fn] = function () { };
    });

    document.addEventListener('keydown', function (e) {
        if (
            e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) ||
            (e.ctrlKey && e.keyCode === 85)
        ) {
            e.preventDefault();
            showProtectionOverlay();
            return false;
        }
    });

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showToast("🔒 Right-click is disabled on this portfolio");
        return false;
    });

    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());

    let devToolsOpen = false;

    // function checkDevTools() {
    //     const threshold = 160;
    //     if (
    //         window.outerWidth - window.innerWidth > threshold ||
    //         window.outerHeight - window.innerHeight > threshold
    //     ) {
    //         if (!devToolsOpen) {
    //             devToolsOpen = true;
    //             showProtectionOverlay();
    //         }
    //     }
    // }

    // setInterval(checkDevTools, 1000);

    function showProtectionOverlay() {
        if (!overlay) return;
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
            z-index: 99999;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
})();

// ========== THEME TOGGLE ==========
(function () {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light');
        const isLight = document.documentElement.classList.contains('light');
        themeIcon.className = isLight ? 'fa fa-sun' : 'fa fa-moon';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
        themeIcon.className = 'fa fa-sun';
    }
})();

// ========== MOBILE MENU ==========
(function () {
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.getElementById('navLinks');

    if (!mobileMenu || !navLinks) return;

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.innerHTML = navLinks.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
})();

// ========== TYPEWRITER ==========
(function () {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;

    const texts = ['Backend Developer', 'PHP Expert', 'Laravel Specialist', 'API Architect'];
    let i = 0, j = 0, del = false;

    function type() {
        typingText.textContent = texts[i].substring(0, j);
        j += del ? -1 : 1;

        if (j === texts[i].length + 1) del = true;
        if (j === 0 && del) {
            del = false;
            i = (i + 1) % texts.length;
        }
        setTimeout(type, del ? 60 : 120);
    }
    type();
})();

// ========== SMOOTH SCROLL ==========
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
})();

// ========== INTERSECTION ANIMATIONS ==========
(function () {
    const fadeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document
        .querySelectorAll('.skill-category,.project-card,.contact-card')
        .forEach(el => {
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px)';
            el.style.transition = '0.6s';
            fadeObserver.observe(el);
        });
})();

// ========== FOOTER YEAR ==========
(function () {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ========== EMAILJS ==========
(function () {
    emailjs.init("ld7KH-e2_PdMCcmrE");

    const form = document.getElementById("contactForm");
    if (!form) return;

    const btn = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const original = btn.innerHTML;
        btn.innerHTML = "Sending...";
        btn.disabled = true;

        try {
            await emailjs.send(
                "service_4drocoa",
                "template_tncnn79",
                {
                    from_name: document.getElementById("name").value,
                    reply_to: document.getElementById("email").value,
                    subject: document.getElementById("company").value || "Portfolio Contact",
                    message: document.getElementById("message").value
                }
            );
            showAlert(
                "success",
                "Message Sent!",
                "Thank you for reaching out. I’ll get back to you within 24 hours."
            );

            form.reset();
        } catch (err) {
            console.error(err);
            showAlert(
                "error",
                "Message Failed",
                "Something went wrong while sending your message. Please try again later."
            );

        } finally {
            btn.innerHTML = original;
            btn.disabled = false;
        }
    });
})();

function showAlert(type, title, message) {
    const wrapper = document.getElementById("customAlert");
    const box = wrapper.querySelector(".alert-box");

    box.classList.remove("success", "error");
    box.classList.add(type);

    document.getElementById("alertTitle").innerText = title;
    document.getElementById("alertMessage").innerText = message;

    wrapper.style.display = "flex";
}

function closeAlert() {
    document.getElementById("customAlert").style.display = "none";
}

