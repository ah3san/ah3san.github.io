// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Parallax hero scroll effect
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        heroVisual.style.opacity = 1 - (window.scrollY / window.innerHeight) * 1.5;
    }
});

// Intersection Observer for scroll animations (fade in content on scroll)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.classList.remove('hidden', 'hidden-left', 'hidden-right', 'hidden-scale');
            
            // Re-apply hover transitions ONLY to interactive 3D tilt cards to avoid bleed on text elements
            setTimeout(() => {
                if (entry.target.classList.contains('glass-card') || entry.target.classList.contains('tech-card') || entry.target.classList.contains('contact-card')) {
                    entry.target.style.transition = 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, transform 0.2s ease-out';
                }
            }, 1000); // After reveal transition is done
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply observer to elements
document.addEventListener('DOMContentLoaded', () => {
    // Reveal up elements (default)
    const fadeUpElements = document.querySelectorAll('.section-title, .hero-subtitle, .project-card, .contact-card');
    fadeUpElements.forEach((el, index) => {
        el.classList.add('hidden');
        if(el.closest('.projects-grid')) {
            const delay = (index % 2) * 0.15;
            el.style.transitionDelay = `${delay}s, ${delay}s`;
        }
        observer.observe(el);
    });

    // Reveal left elements (from left)
    const revealLeftElements = document.querySelectorAll('.hero-title, .badge, .hero-actions');
    revealLeftElements.forEach((el, index) => {
        el.classList.add('hidden-left');
        const delay = index * 0.15;
        el.style.transitionDelay = `${delay}s, ${delay}s`;
        observer.observe(el);
    });

    // Reveal right elements (from right)
    const revealRightElements = document.querySelectorAll('.hero-visual .tech-card');
    revealRightElements.forEach((el, index) => {
        el.classList.add('hidden-right');
        const delay = index * 0.2;
        el.style.transitionDelay = `${delay}s, ${delay}s`;
        observer.observe(el);
    });

    // Reveal scale elements (pop in)
    const revealScaleElements = document.querySelectorAll('.skill-card');
    revealScaleElements.forEach((el, index) => {
        el.classList.add('hidden-scale');
        const delay = (index % 4) * 0.1;
        el.style.transitionDelay = `${delay}s, ${delay}s`;
        observer.observe(el);
    });

    // --- 3D Glass Card Tilt Effect ---
    const tiltElements = document.querySelectorAll('.glass-card, .tech-card, .contact-card');
    
    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Mouse position relative to the middle of the card
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation up to 10 degrees based on distance from center
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly snap back to original state
            card.style.transition = 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, transform 0.1s ease-out';
        });
    });

    // --- Reveal Pre-Configured HTML Elements (like Footer) ---
    // Ensure elements with hardcoded HTML reveal classes actually get observed
    const preConfiguredReveals = document.querySelectorAll('.reveal');
    preConfiguredReveals.forEach(el => observer.observe(el));
});

// Mouse tracking for background gradient blobs
const blobs = document.querySelectorAll('.blob');
let mouseX = 0.5; // Start at center
let mouseY = 0.5;
let currentX = 0.5;
let currentY = 0.5;

document.addEventListener('mousemove', (e) => {
    // Normalize coordinates from 0 to 1
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
});

// Smoothly animate the blobs using requestAnimationFrame
function animateBlobs() {
    // Lerp (Linear Interpolation)
    currentX += (mouseX - currentX) * 0.05;
    currentY += (mouseY - currentY) * 0.05;

    const time = Date.now() * 0.001; // for continuous float movement

    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 40;
        
        // Mouse offset calculation
        const xOffset = (currentX - 0.5) * speed;
        const yOffset = (currentY - 0.5) * speed;
        
        // Add autonomous floating effect using Math.sin/cos
        const floatX = Math.sin(time + index * 2) * 40;
        const floatY = Math.cos(time + index * 2) * 40;
        
        // Add subtle scaling heartbeat
        const scale = 1 + Math.sin(time * 0.5 + index) * 0.1;

        // Apply translations combined
        blob.style.transform = `translate(${xOffset + floatX}px, ${yOffset + floatY}px) scale(${scale})`;
    });

    requestAnimationFrame(animateBlobs);
}

// Start animation loop
animateBlobs();
