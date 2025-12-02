// ===== NAVIGATION =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.getElementById('header');

// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;
const scrollThreshold = 100;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow on scroll
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
// Enhanced smooth scroll with cross-browser support
const smoothScrollTo = (targetElement) => {
    if (!targetElement) return;

    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    // Check if smooth scroll is supported
    if ('scrollBehavior' in document.documentElement.style) {
        // Native smooth scroll
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    } else {
        // Polyfill for older browsers
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800; // milliseconds
        let start = null;

        const animationStep = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function for smooth animation
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + (distance * ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animationStep);
            }
        };

        requestAnimationFrame(animationStep);
    }
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Only handle internal links
        if (!targetId || targetId === '#' || targetId.length <= 1) return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            e.preventDefault();

            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }

            // Perform smooth scroll
            smoothScrollTo(targetElement);

            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.about, .projects, .catalog, .contact');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('reveal', 'active');
        }
    });
};

// Initial check
revealOnScroll();

// Check on scroll with throttle
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        revealOnScroll();
    }, 50);
});

// ===== PROJECT CARDS STAGGER ANIMATION =====
const projectCards = document.querySelectorAll('.project__card');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            projectObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    projectObserver.observe(card);
});

// ===== CATALOG ITEMS ANIMATION =====
const catalogItems = document.querySelectorAll('.catalog__item');

const catalogObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 80);
            catalogObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

catalogItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    catalogObserver.observe(item);
});

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        // Create success message
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #2C2C2C;
            color: white;
            padding: 2rem 3rem;
            border-radius: 4px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            text-align: center;
            animation: fadeInUp 0.5s ease;
        `;
        successMessage.innerHTML = `
            <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; margin-bottom: 0.5rem;">Obrigado!</h3>
            <p style="font-size: 1rem; opacity: 0.9;">A sua mensagem foi enviada com sucesso. Entraremos em contacto em breve.</p>
        `;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(successMessage);

        // Log form data (in production, send to server)
        console.log('Form submitted:', formData);

        // Reset form
        contactForm.reset();

        // Remove message after 3 seconds
        setTimeout(() => {
            successMessage.style.animation = 'fadeOut 0.5s ease';
            overlay.style.animation = 'fadeOut 0.3s ease';

            setTimeout(() => {
                document.body.removeChild(successMessage);
                document.body.removeChild(overlay);
            }, 500);
        }, 3000);

        // Close on click
        overlay.addEventListener('click', () => {
            document.body.removeChild(successMessage);
            document.body.removeChild(overlay);
        });
    });
}

// ===== PARALLAX EFFECT FOR HERO =====
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;

        if (scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            hero.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.8;
        }
    });
}

// ===== ACTIVE NAVIGATION LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

const updateActiveLink = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = 'var(--color-secondary)';
            } else {
                navLink.style.color = '';
            }
        }
    });
};

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// ===== LAZY LOADING FOR IMAGES =====
// This would be used if you add actual images
const lazyImages = document.querySelectorAll('[data-src]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for resize events
const debounce = (func, wait = 10, immediate = true) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

// Handle window resize efficiently
const handleResize = debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250);

window.addEventListener('resize', handleResize);

// ===== KEYBOARD NAVIGATION =====
// Trap focus in mobile menu when open
const focusableElements = 'a[href], button, textarea, input, select';

navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navToggle.click();
    }
});

// ESC key to close mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        navToggle.focus();
    }
});

// ===== PREVENT FLASHING ON PAGE LOAD =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger reveal animations for elements in viewport
    revealOnScroll();
});

// ===== ACCESSIBILITY: Announce dynamic content changes =====
const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
};

// Use when mobile menu is toggled
navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    announceToScreenReader(isOpen ? 'Menu aberto' : 'Menu fechado');
});

console.log('Dekora website loaded successfully! ✨');
