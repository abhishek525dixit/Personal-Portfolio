// Smooth scrolling functionality
const navLinks = document.querySelectorAll('.link-group a');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.link-group');
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
