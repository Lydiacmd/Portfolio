// ===== MENU MOBILE =====
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Hamburger animation
burger.addEventListener('click', function() {
    const spans = this.querySelectorAll('span');
    if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(7px, 7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ===== ANIMATION TYPEWRITER SUR LE NOM (RAPIDE) =====
const nameElement = document.querySelector('.hero h1');
if (nameElement) {
    const originalText = nameElement.textContent;
    let displayText = '';
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < originalText.length) {
            displayText += originalText.charAt(charIndex);
            nameElement.textContent = displayText;
            charIndex++;
            setTimeout(typeWriter, 50); // 50ms au lieu de 100ms = 2x plus rapide
        }
        // Une fois fini, on laisse le nom affiché sans l'effacer
    }
    
    setTimeout(() => {
        nameElement.textContent = '';
        typeWriter();
    }, 300); // Commence plus tôt aussi (300ms au lieu de 500ms)
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR AU SCROLL =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.7)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===== CAROUSEL DE PROJETS =====
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('projectsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.getElementById('indicators');
    const projectCards = document.querySelectorAll('.project-card');

    if (!carousel || !prevBtn || !nextBtn) {
        console.log('Carousel elements not found');
        return;
    }

    let currentIndex = 0;

    // Fonction pour défiler vers un index
    function scrollToIndex(index) {
        const cardWidth = projectCards[0].offsetWidth + 24; // largeur + gap
        const scrollAmount = index * cardWidth;
        carousel.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateIndicators();
    }

    // Créer les indicateurs
    function createIndicators() {
        indicators.innerHTML = '';
        projectCards.forEach((card, i) => {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => scrollToIndex(i));
            indicators.appendChild(indicator);
        });
    }

    // Mettre à jour les indicateurs
    function updateIndicators() {
        const allIndicators = indicators.querySelectorAll('.indicator');
        allIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }

    // Bouton précédent
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    });

    // Bouton suivant
    nextBtn.addEventListener('click', function() {
        if (currentIndex < projectCards.length - 1) {
            scrollToIndex(currentIndex + 1);
        }
    });

    // Initialiser
    createIndicators();
    carousel.style.cursor = 'grab';

    // Drag to scroll
    let isDragging = false;
    let startX;
    let scrollLeft;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        carousel.style.cursor = 'grabbing';
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });

    carousel.addEventListener('mouseleave', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        carousel.style.cursor = 'grab';
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch swipe
    let touchStartX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < projectCards.length - 1) {
                scrollToIndex(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                scrollToIndex(currentIndex - 1);
            }
        }
    });

    // Update on scroll
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const cardWidth = projectCards[0].offsetWidth + 24;
            const newIndex = Math.round(carousel.scrollLeft / cardWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < projectCards.length) {
                currentIndex = newIndex;
                updateIndicators();
            }
        }, 150);
    });
});

// ===== MODAL VIDÉO =====
const videoModal = document.getElementById('videoModal');
const demoVideo = document.getElementById('demoVideo');
const videoModalClose = document.querySelector('.video-modal-close');
const demoBtns = document.querySelectorAll('.btn-demo');

// Ouvrir la modal quand on clique sur un bouton démo
demoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const videoSrc = btn.getAttribute('data-video');
        demoVideo.querySelector('source').src = videoSrc;
        demoVideo.load();
        videoModal.classList.add('active');
        demoVideo.play();
    });
});

// Fermer la modal
function closeVideoModal() {
    videoModal.classList.remove('active');
    demoVideo.pause();
    demoVideo.currentTime = 0;
}

videoModalClose.addEventListener('click', closeVideoModal);

// Fermer en cliquant en dehors de la vidéo
videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Fermer avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// ===== ANIMATIONS AU SCROLL =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observer les sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('fade-in');
        section.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(section);
    });
    
    // Observer les cartes de compétences
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });
});

// ===== EFFET PARALLAX LÉGER =====
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero-content');
            
            if (hero && scrolled < window.innerHeight) {
                hero.style.transform = `translateY(${scrolled * 0.2}px)`;
                hero.style.opacity = Math.max(0, 1 - scrolled / 600);
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// ===== EFFET 3D SUR LES CARTES =====
const cards = document.querySelectorAll('.skill-card, .project-card, .info-card');

cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== FORMULAIRE DE CONTACT =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('.btn');
        const originalHTML = btn.innerHTML;
        
        // Afficher un état de chargement
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        btn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    contactForm.reset();
                }, 3000);
            } else {
                throw new Error('Erreur lors de l\'envoi');
            }
        } catch (error) {
            btn.innerHTML = '<i class="fas fa-times"></i> Erreur d\'envoi';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// ===== CURSEUR PERSONNALISÉ (DESKTOP UNIQUEMENT) =====
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(167, 139, 250, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.15s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Agrandir sur les éléments cliquables
    const clickables = document.querySelectorAll('a, button, .project-card, .skill-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.marginLeft = '-10px';
            cursor.style.marginTop = '-10px';
            cursor.style.borderColor = 'rgba(167, 139, 250, 1)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.marginLeft = '0';
            cursor.style.marginTop = '0';
            cursor.style.borderColor = 'rgba(167, 139, 250, 0.5)';
        });
    });
}

// ===== ANIMATION DES SPOTS LUMINEUX =====
const spots = document.querySelectorAll('.light-spot');
spots.forEach((spot, index) => {
    setInterval(() => {
        const randomX = Math.random() * 100 - 50;
        const randomY = Math.random() * 100 - 50;
        spot.style.transform = `translate(${randomX}px, ${randomY}px)`;
    }, 5000 + index * 1000);
});

// ===== CONSOLE EASTER EGG =====
console.log('%c🚀 Portfolio', 'color: #a78bfa; font-size: 32px; font-weight: bold; font-family: Quicksand;');
console.log('%c✨ Développé avec passion', 'color: #667eea; font-size: 16px;');
console.log('%c💼 Recherche de stage en informatique', 'color: #4facfe; font-size: 14px;');

// ===== PERFORMANCE: LAZY LOADING =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== LOADING INITIAL =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== TYPEWRITER INFINI SUR LA SUBTITLE =====
document.addEventListener("DOMContentLoaded", () => {
    const subtitle = document.querySelector(".subtitle");
    if (!subtitle) return;

    const fullText = subtitle.textContent.trim();  
    const firstChar = fullText.charAt(0);          // ex: "É"
    const rest = fullText.slice(1);                // ex: "tudiante en Informatique"
    const len = rest.length;

    let phase = 0;
    const interval = 80; // vitesse globale

    setInterval(() => {
        if (len === 0) {
            subtitle.textContent = firstChar;
            return;
        }

        const total = len * 2;      // montée + descente
        const p = phase % total;    // étape courante

        let n;
        if (p <= len) {
            // ÉCRITURE
            n = p;
        } else {
            // EFFACEMENT
            n = total - p;
        }

        subtitle.textContent = firstChar + rest.slice(0, n);
        phase++;
    }, interval);
});
