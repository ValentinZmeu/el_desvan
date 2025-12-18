/* ============================================
   EL ANTIGUO DESVÁN - Main JavaScript
   ============================================ */

// ========== DOM Content Loaded ==========
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollHeader();
    initScrollAnimations();
    initCounterAnimation();
    initParallaxEffects();
    initGalleryLightbox();
    initSmoothScroll();
    initCursorGlow();
    initBackToTop();
    initCookieConsent();
});

// ========== Back to Top Button ==========
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const scrollThreshold = window.innerHeight * 1.5; // 150vh

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== Navigation ==========
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    // Toggle menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Update active link on scroll
    updateActiveNavOnScroll();
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ========== Scroll Header Effect ==========
function initScrollHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ========== Scroll Animations (AOS-like) ==========
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);

                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ========== Counter Animation ==========
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
}

// ========== Parallax Effects ==========
function initParallaxEffects() {
    const heroGlows = document.querySelectorAll('.hero__glow');
    const floatingCard = document.querySelector('.about__floating-card');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Hero glow parallax
        heroGlows.forEach((glow, index) => {
            const speed = index === 0 ? 0.3 : 0.2;
            glow.style.transform = `translate(${scrollY * speed * 0.1}px, ${scrollY * speed}px)`;
        });

        // Floating card parallax
        if (floatingCard) {
            const rect = floatingCard.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                floatingCard.style.transform = `translateY(${(scrollY * 0.05)}px)`;
            }
        }
    });

    // Mouse move parallax on hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPos = (clientX / innerWidth - 0.5) * 30;
            const yPos = (clientY / innerHeight - 0.5) * 30;

            heroGlows.forEach((glow, index) => {
                const multiplier = index === 0 ? 1 : -1;
                glow.style.transform = `translate(${xPos * multiplier}px, ${yPos * multiplier}px)`;
            });
        });
    }
}

// ========== Gallery Lightbox ==========
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery__item');

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__overlay"></div>
        <div class="lightbox__content">
            <button class="lightbox__close">&times;</button>
            <button class="lightbox__prev">&larr;</button>
            <button class="lightbox__next">&rarr;</button>
            <img class="lightbox__image" src="" alt="">
            <div class="lightbox__caption"></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    // Add lightbox styles
    const lightboxStyles = document.createElement('style');
    lightboxStyles.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        .lightbox__overlay {
            position: absolute;
            inset: 0;
            background: rgba(10, 10, 15, 0.95);
            backdrop-filter: blur(10px);
        }
        .lightbox__content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        .lightbox.active .lightbox__content {
            transform: scale(1);
        }
        .lightbox__image {
            max-width: 100%;
            max-height: 85vh;
            object-fit: contain;
            border-radius: 12px;
            box-shadow: 0 0 60px rgba(255, 45, 117, 0.3);
        }
        .lightbox__close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .lightbox__close:hover {
            background: var(--color-neon-pink);
            transform: rotate(90deg);
        }
        .lightbox__prev,
        .lightbox__next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .lightbox__prev { left: -70px; }
        .lightbox__next { right: -70px; }
        .lightbox__prev:hover,
        .lightbox__next:hover {
            background: var(--color-neon-cyan);
            color: var(--color-bg-primary);
        }
        .lightbox__caption {
            text-align: center;
            padding: 15px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9375rem;
        }
        @media (max-width: 768px) {
            .lightbox__prev { left: 10px; }
            .lightbox__next { right: 10px; }
            .lightbox__close { top: 10px; right: 10px; }
        }
    `;
    document.head.appendChild(lightboxStyles);

    // Lightbox functionality
    const overlay = lightbox.querySelector('.lightbox__overlay');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    const lightboxImage = lightbox.querySelector('.lightbox__image');
    const lightboxCaption = lightbox.querySelector('.lightbox__caption');

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        caption: item.querySelector('.gallery__caption')?.textContent || ''
    }));

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImage.src = images[currentIndex].src;
        lightboxCaption.textContent = images[currentIndex].caption;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

// ========== Smooth Scroll ==========
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========== Cursor Glow Effect ==========
function initCursorGlow() {
    // Only on desktop
    if (window.matchMedia('(hover: hover)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor-glow';
        document.body.appendChild(cursor);

        const cursorStyles = document.createElement('style');
        cursorStyles.textContent = `
            .cursor-glow {
                position: fixed;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255, 45, 117, 0.15) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease;
                opacity: 0;
            }
            body:hover .cursor-glow {
                opacity: 1;
            }
        `;
        document.head.appendChild(cursorStyles);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.1;
            cursorY += dy * 0.1;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }
}

// ========== Typing Effect for Hero (Optional Enhancement) ==========
function initTypingEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;

    const text = subtitle.innerHTML;
    subtitle.innerHTML = '';
    subtitle.style.visibility = 'visible';

    let i = 0;
    const speed = 50;

    function typeWriter() {
        if (i < text.length) {
            if (text.charAt(i) === '<') {
                // Handle HTML tags
                const closeTag = text.indexOf('>', i);
                subtitle.innerHTML += text.substring(i, closeTag + 1);
                i = closeTag + 1;
            } else {
                subtitle.innerHTML += text.charAt(i);
                i++;
            }
            setTimeout(typeWriter, speed);
        }
    }

    // Start after a delay
    setTimeout(typeWriter, 1000);
}

// ========== Magnetic Buttons ==========
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// Initialize magnetic buttons
document.addEventListener('DOMContentLoaded', initMagneticButtons);

// ========== Performance: Debounce & Throttle ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== Cookie Consent ==========
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    const acceptMapBtn = document.getElementById('accept-cookies-map');
    const mapPlaceholder = document.getElementById('map-placeholder');
    const googleMap = document.getElementById('google-map');

    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (cookieConsent === 'accepted') {
        // Load map immediately if already accepted
        loadGoogleMap();
    } else if (cookieConsent === 'rejected') {
        // Keep map hidden, don't show banner again
    } else {
        // Show cookie banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    // Accept cookies
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
            loadGoogleMap();
        });
    }

    // Reject cookies
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'rejected');
            cookieBanner.classList.remove('visible');
        });
    }

    // Accept from map placeholder button
    if (acceptMapBtn) {
        acceptMapBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
            loadGoogleMap();
        });
    }

    // Function to load Google Map
    function loadGoogleMap() {
        if (googleMap && mapPlaceholder) {
            const mapSrc = googleMap.getAttribute('data-src');
            if (mapSrc) {
                googleMap.src = mapSrc;
                googleMap.style.display = 'block';
                mapPlaceholder.classList.add('hidden');
            }
        }
    }
}

// ========== Preloader (Optional) ==========
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations after load
    setTimeout(() => {
        document.querySelectorAll('.hero [data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
    }, 100);
});
