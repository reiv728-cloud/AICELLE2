// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const generationSections = document.querySelectorAll('.generation-section');
    const progressFill = document.getElementById('progressFill');
    const scrollTopBtn = document.getElementById('scrollTop');

    // Function to update progress bar
    function updateProgressBar(generation) {
        const progress = (generation / 5) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Function to switch between generations
    function switchGeneration(generationNumber) {
        // Remove active class from all buttons and sections
        navButtons.forEach(btn => btn.classList.remove('active'));
        generationSections.forEach(section => section.classList.remove('active'));

        // Add active class to selected button and section
        const selectedButton = document.querySelector(`.nav-btn[data-generation="${generationNumber}"]`);
        const selectedSection = document.querySelector(`.generation-section[data-generation="${generationNumber}"]`);

        if (selectedButton && selectedSection) {
            selectedButton.classList.add('active');
            selectedSection.classList.add('active');

            // Update progress bar
            updateProgressBar(generationNumber);

            // Smooth scroll to content
            selectedSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Add click event listeners to navigation buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const generation = this.getAttribute('data-generation');
            switchGeneration(generation);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const activeButton = document.querySelector('.nav-btn.active');
        if (!activeButton) return;

        const currentGeneration = parseInt(activeButton.getAttribute('data-generation'));
        let newGeneration = currentGeneration;

        // Left arrow or 'a' key - previous generation
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            newGeneration = currentGeneration > 1 ? currentGeneration - 1 : 5;
        }
        // Right arrow or 'd' key - next generation
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            newGeneration = currentGeneration < 5 ? currentGeneration + 1 : 1;
        }
        // Number keys 1-5
        else if (e.key >= '1' && e.key <= '5') {
            newGeneration = parseInt(e.key);
        }

        if (newGeneration !== currentGeneration) {
            switchGeneration(newGeneration);
        }
    });

    // Scroll to top button functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });

    // Initialize scroll button as hidden
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.pointerEvents = 'none';
    scrollTopBtn.style.transition = 'all 0.3s ease';

    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and set initial state
    document.querySelectorAll('.card, .insight-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Parallax effect for header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = 1 - (scrolled / 500);
        }
    });

    // Add ripple effect to buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Timeline row hover effects
    const timelineRows = document.querySelectorAll('.timeline-row:not(.header)');
    timelineRows.forEach((row, index) => {
        row.addEventListener('click', function() {
            const generation = index + 1;
            switchGeneration(generation);
            
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Add cursor pointer
        row.style.cursor = 'pointer';
    });

    // Add tooltip functionality for navigation buttons
    navButtons.forEach(button => {
        button.setAttribute('title', 'Click to view this generation or use arrow keys to navigate');
    });

    // Initialize progress bar
    updateProgressBar(1);

    // Animated counter for stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Animate stat numbers on load
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        const text = stat.textContent;
        if (text === '5') {
            setTimeout(() => animateCounter(stat, 5, 1500), index * 200);
        } else if (text.includes('80')) {
            stat.textContent = '0+';
            setTimeout(() => {
                let count = 0;
                const timer = setInterval(() => {
                    count += 2;
                    if (count >= 80) {
                        stat.textContent = '80+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = count + '+';
                    }
                }, 20);
            }, index * 200);
        }
    });

    // Add smooth scroll behavior for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add tilt effect to cards
    document.querySelectorAll('.card, .insight-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // Page load animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // Animate header elements
        const headerIcon = document.querySelector('.header-icon');
        const headerTitle = document.querySelector('header h1');
        const subtitle = document.querySelector('.subtitle');
        const stats = document.querySelector('.header-stats');
        
        setTimeout(() => {
            if (headerIcon) headerIcon.style.animation = 'fadeIn 0.8s ease forwards';
        }, 100);
        
        setTimeout(() => {
            if (headerTitle) headerTitle.style.animation = 'fadeIn 0.8s ease forwards';
        }, 300);
        
        setTimeout(() => {
            if (subtitle) subtitle.style.animation = 'fadeIn 0.8s ease forwards';
        }, 500);
        
        setTimeout(() => {
            if (stats) stats.style.animation = 'fadeIn 0.8s ease forwards';
        }, 700);
    });

    // Add CSS for ripple effect dynamically
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add keyboard shortcuts info
    document.addEventListener('keydown', function(e) {
        if (e.key === '?' || e.key === 'h') {
            alert('⌨️ Keyboard Shortcuts:\n\n' +
                  '← / A - Previous Generation\n' +
                  '→ / D - Next Generation\n' +
                  '1-5 - Jump to Generation\n' +
                  'H / ? - Show this help');
        }
    });

    // Custom cursor trail effect - DISABLED for performance
    // Uncomment below if you want to enable it on powerful devices
    /*
    const canvas = document.getElementById('cursorCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // ... particle code here
    }
    */

    // Console message with style
    console.log('%c🖥️ Computer Evolution Timeline', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
    console.log('%c💡 Keyboard Shortcuts:', 'font-size: 14px; font-weight: bold; color: #06b6d4;');
    console.log('%c   ← / → or A / D - Navigate generations', 'font-size: 12px; color: #cbd5e1;');
    console.log('%c   1-5 - Jump to specific generation', 'font-size: 12px; color: #cbd5e1;');
    console.log('%c   H or ? - Show help', 'font-size: 12px; color: #cbd5e1;');
    console.log('%c🎯 Click timeline rows to jump to generations', 'font-size: 12px; color: #10b981;');
    console.log('%c✨ Created by: Casagda, Aicelle | BSTM-2C', 'font-size: 12px; color: #8b5cf6; font-style: italic;');
    
    // Performance monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`%c⚡ Page loaded in ${Math.round(loadTime)}ms`, 'font-size: 11px; color: #10b981;');
    });
});
