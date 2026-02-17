// ==================== PARTICLE SYSTEM ====================
class Particle {
    constructor(x, y, vx, vy, size, color, life) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.angle = Math.random() * Math.PI * 2;
        this.angularVelocity = (Math.random() - 0.5) * 0.05;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.life--;
        this.angle += this.angularVelocity;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.particles = [];
        this.time = 0;
        this.emitterX = canvas.width / 2;
        this.emitterY = canvas.height / 2;
    }

    emit(x, y, count = 1) {
        const colors = ['rgba(231, 76, 60, 0.6)', 'rgba(52, 152, 219, 0.6)', 'rgba(155, 89, 182, 0.6)'];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 2 + 0.5;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 2;
            const size = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = Math.random() * 60 + 40;

            this.particles.push(new Particle(x, y, vx, vy, size, color, life));
        }
    }

    update() {
        this.time++;
        
        // Emit particles from multiple locations
        if (this.time % 3 === 0) {
            const angle = this.time * 0.02;
            const radius = 200;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            const x1 = centerX + Math.cos(angle) * radius;
            const y1 = centerY + Math.sin(angle) * radius;
            this.emit(x1, y1, 2);
            
            const x2 = centerX + Math.cos(angle + Math.PI) * radius;
            const y2 = centerY + Math.sin(angle + Math.PI) * radius;
            this.emit(x2, y2, 2);
        }

        // Update particles
        this.particles = this.particles.filter(p => {
            p.update();
            return !p.isDead();
        });
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx));
    }
}

// ==================== ENHANCED GRADIENT BACKGROUND ====================
class GradientBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    update() {
        this.time += 0.008;
    }

    draw() {
        const ctx = this.ctx;
        
        // Create smooth transitioning gradients
        const grad1 = ctx.createLinearGradient(0, 0, this.width, this.height);
        const hue1 = (Math.sin(this.time * 0.5) * 30 + 200) % 360;
        const hue2 = (Math.cos(this.time * 0.3) * 40 + 220) % 360;
        
        grad1.addColorStop(0, `hsl(${hue1}, 60%, 20%)`);
        grad1.addColorStop(0.5, `hsl(${(hue2 + 60) % 360}, 50%, 15%)`);
        grad1.addColorStop(1, `hsl(${hue2}, 70%, 18%)`);

        ctx.fillStyle = grad1;
        ctx.fillRect(0, 0, this.width, this.height);

        // Add radial gradient overlay
        const radGrad = ctx.createRadialGradient(
            this.width * 0.5 + Math.sin(this.time * 0.4) * 200,
            this.height * 0.5 + Math.cos(this.time * 0.3) * 200,
            100,
            this.width * 0.5,
            this.height * 0.5,
            this.width
        );
        
        radGrad.addColorStop(0, `rgba(231, 76, 60, ${0.05 + Math.sin(this.time) * 0.02})`);
        radGrad.addColorStop(1, 'rgba(15, 20, 25, 0)');
        
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

// Canvas setup
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particleSystem = null;
    let gradientBg = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleSystem = new ParticleSystem(canvas);
        gradientBg = new GradientBackground(canvas);
    }

    function animate() {
        // Draw gradient background
        gradientBg.update();
        gradientBg.draw();

        // Update and draw particles
        particleSystem.update();
        particleSystem.draw(ctx);

        requestAnimationFrame(animate);
    }

    resizeCanvas();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
    });
}

// ==================== SCROLL REVEAL ANIMATION ====================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.link-group');
const navLinks = document.querySelectorAll('.link-group a');
const body = document.body;

// Smooth scroll on nav link click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active link
            updateActiveLink(targetId);
        }
    });
});

// Update active link based on scroll position
function updateActiveLink(id) {
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
        if (link.getAttribute('href') === id) {
            link.parentElement.classList.add('active');
        }
    });
}

// Track active section on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    // Update active nav link based on scroll
    navLinks.forEach(link => {
        link.parentElement.classList.remove('active');
    });
    
    if (current) {
        const activeLink = document.querySelector(`.link-group a[href="#${current}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});
document.getElementById("downloadCV").addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = "abhicv.pdf";      // exact file name
    link.download = "Abhishek_Dixit_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Enhanced Scroll reveal animation using Intersection Observer
const revealElements = document.querySelectorAll('section');
const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -80px 0px'
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animation = 'fadeInUp 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(element => {
    element.style.opacity = '0';
    revealOnScroll.observe(element);
})

// Enhanced Navbar scroll effect with smooth transitions
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true })

// Enhanced Parallax effect for home image with smooth easing
window.addEventListener('scroll', () => {
    const homeImg = document.querySelector('.home-img');
    if (homeImg) {
        const parallaxValue = Math.min(window.scrollY * 0.4, window.innerHeight);
        homeImg.style.transform = `translateY(${parallaxValue}px) scale(${1 + parallaxValue * 0.0001})`;
    }
}, { passive: true })

// Enhanced project card reveal on scroll with staggered animation
const projectCards = document.querySelectorAll('.project-card');
const projectRevealOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
};

const projectRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            projectRevealObserver.unobserve(entry.target);
        }
    });
}, projectRevealOptions);

projectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    projectRevealObserver.observe(card);
})

// Skill cards reveal animation
const skillCards = document.querySelectorAll('.skill-card');
const skillRevealOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
};

const skillRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            skillRevealObserver.unobserve(entry.target);
        }
    });
}, skillRevealOptions);

skillCards.forEach(card => {
    card.style.opacity = '0';
    skillRevealObserver.observe(card);
});

// Timeline items reveal animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineRevealOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const timelineRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            timelineRevealObserver.unobserve(entry.target);
        }
    });
}, timelineRevealOptions);

timelineItems.forEach(item => {
    item.style.opacity = '0';
    timelineRevealObserver.observe(item);
});

// About section content animation
const aboutSection = document.querySelector('.about-section');
const aboutText = document.querySelector('.about-text');
const aboutContent = document.querySelector('.about-content');

if (aboutSection && aboutText && aboutContent) {
    const aboutRevealOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const aboutRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutContent.style.animation = 'fadeInUp 0.8s ease-out';
                aboutText.style.animation = 'fadeInUp 0.8s ease-out 0.2s both';
                aboutRevealObserver.unobserve(entry.target);
            }
        });
    }, aboutRevealOptions);

    aboutRevealObserver.observe(aboutSection);
}

// Formspree Contact Form Handler
const contactForm = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(contactForm);
        const action = contactForm.getAttribute("action");
        
        // Send form data via fetch
        fetch(action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                successMessage.style.display = "block";
                contactForm.style.display = "none";
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.style.display = "none";
                    contactForm.style.display = "flex";
                }, 5000);
            } else {
                alert("There was an error sending your message. Please try again.");
            }
        })
        .catch(error => {
            alert("Error sending message. Please check your Formspree Form ID.");
            console.error("Error:", error);
        });
    });
}

// Smooth button and card interactions
const buttons = document.querySelectorAll('.project-btn, .contact-btn, .download-btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

const cards = document.querySelectorAll('.skill-card, .project-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// Smooth form transitions
const formInputs = document.querySelectorAll('.form-input, .form-textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// Scroll-linked color intensity changes
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.borderBottomColor = `rgba(231, 76, 60, ${Math.min(scrollPercent * 0.5, 0.5)})`;
    }
}, { passive: true })
