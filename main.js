document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       PRELOADER & LOADING BAR
       ========================================== */
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const loaderPercentage = document.querySelector('.loader-percentage');
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            // Fade out preloader
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                onComplete: () => {
                    preloader.style.display = 'none';
                    triggerHeroAnimations();
                }
            });
        }
        loaderBar.style.width = `${progress}%`;
        loaderPercentage.textContent = `${progress}%`;
    }, 80);

    /* ==========================================
       STICKY HEADER SCROLL TRIGGER
       ========================================== */
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.classList.add('fixed-header');
        } else {
            header.classList.remove('fixed-header');
        }
        
        // Scroll progress indicator
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('scrollProgress').style.width = `${scrollPercent}%`;
    });

    /* ==========================================
       LENIS SMOOTH SCROLLING
       ========================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Integrates GSAP ScrollTrigger with Lenis
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    /* ==========================================
       CUSTOM CURSOR
       ========================================== */
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('customCursorGlow');
    
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(cursorGlow, { x: e.clientX, y: e.clientY, duration: 0.2 });
    });

    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .service-item, .country-card, .job-cat-card, .why-choose-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursorGlow.style.width = '60px';
            cursorGlow.style.height = '60px';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '8px';
            cursor.style.height = '8px';
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
        });
    });

    /* ==========================================
       FLOATING PARTICLES CANVAS
       ========================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.3 - 0.15;
            this.speedY = Math.random() * 0.3 - 0.15;
            this.color = 'rgba(252, 135, 23, 0.12)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;

            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    /* ==========================================
       BACKGROUND SLIDESHOW LOGIC
       ========================================== */
    const slidesList = document.querySelectorAll('.hero-slideshow .hero-slide');
    let currentSlide = 0;
    
    function nextHeroSlide() {
        slidesList[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slidesList.length;
        slidesList[currentSlide].classList.add('active');
    }
    
    setInterval(nextHeroSlide, 5000);

    /* ==========================================
       GSAP SCROLLTRIGGER & HERO ANIMATIONS
       ========================================== */
    gsap.registerPlugin(ScrollTrigger);

    function triggerHeroAnimations() {
        gsap.from('.hero-glass-floating-card', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
        gsap.from('.hero-content h1', { y: 50, opacity: 0, duration: 1, ease: 'power4.out', delay: 0.2 });
        gsap.from('.hero-content h3', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });
        gsap.from('.hero-desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 });
        gsap.from('.hero-btn', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
    }

    // Scroll trigger animations for sections
    const scrollElements = document.querySelectorAll('.about-us-content, .about-us-images, .why-choose-content, .why-choose-image, .service-item, .country-card, .job-cat-card');
    scrollElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Timeline Process progress
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                onEnter: () => {
                    item.classList.add('active');
                    const total = timelineItems.length;
                    const percent = ((index + 1) / total) * 100;
                    gsap.to('.timeline-line-progress', { height: `${percent}%`, duration: 0.5 });
                }
            },
            opacity: 0,
            x: index % 2 === 0 ? -40 : 40,
            duration: 0.8
        });
    });

    // Counters increments
    const counters = document.querySelectorAll('.count-up');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: () => {
                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        counter.textContent = Math.floor(obj.val);
                    }
                });
            }
        });
    });

    /* ==========================================
       COUNTRIES TABS
       ========================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const regionPanes = document.querySelectorAll('.region-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetRegion = btn.getAttribute('data-region');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            regionPanes.forEach(pane => pane.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(targetRegion).classList.add('active');
            ScrollTrigger.refresh();
        });
    });

    /* ==========================================
       TESTIMONIALS SLIDER
       ========================================== */
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let activeSlideIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    prevBtn.addEventListener('click', () => {
        activeSlideIndex = activeSlideIndex === 0 ? slides.length - 1 : activeSlideIndex - 1;
        showSlide(activeSlideIndex);
    });

    nextBtn.addEventListener('click', () => {
        activeSlideIndex = activeSlideIndex === slides.length - 1 ? 0 : activeSlideIndex + 1;
        showSlide(activeSlideIndex);
    });

    /* ==========================================
       FAQ ACCORDIONS
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-body').style.maxHeight = '0';
            });
            
            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = `${body.scrollHeight}px`;
            }
        });
    });

    /* ==========================================
       CONTACT FORM SUBMIT
       ========================================== */
    const visaForm = document.getElementById('visaApplicationForm');
    const formFeedback = document.getElementById('formFeedback');

    visaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        formFeedback.style.display = 'block';
        formFeedback.className = 'form-feedback-message';
        formFeedback.textContent = 'Submitting application...';
        
        setTimeout(() => {
            formFeedback.className = 'form-feedback-message success';
            formFeedback.textContent = 'Success! Application has been recorded. Our counselor will contact you shortly.';
            visaForm.reset();
        }, 1500);
    });

    /* ==========================================
       INTERACTIVE BOOKING POPUP MODAL HANDLERS
       ========================================== */
    const popupForm = document.getElementById('popupForm');
    const leadForm = document.getElementById('leadForm');
    const popupFeedback = document.getElementById('popupFormFeedback');

    window.openPopup = function() {
        popupForm.style.display = 'flex';
    };

    window.closePopup = function() {
        popupForm.style.display = 'none';
        popupFeedback.style.display = 'none';
        leadForm.reset();
    };

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        popupFeedback.style.display = 'block';
        popupFeedback.className = 'form-feedback-message';
        popupFeedback.textContent = 'Booking your appointment...';
        
        setTimeout(() => {
            popupFeedback.className = 'form-feedback-message success';
            popupFeedback.textContent = 'Appoinment booked successfully!';
            
            setTimeout(() => {
                closePopup();
            }, 1500);
        }, 1200);
    });
});

/* ==========================================
   MOBILE MENU TOGGLE FUNCTIONS
   ========================================== */
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.remove('active');
}
