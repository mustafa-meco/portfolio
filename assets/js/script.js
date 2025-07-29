// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');
const techIcons = document.querySelectorAll('.tech-icon');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Mobile navigation toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu if open
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px -80px 0px'
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    navObserver.observe(section);
});

// Project filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active filter button
        filterBtns.forEach(filterBtn => filterBtn.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter project cards
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Enhanced form submission with better user feedback
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // You can integrate with services like:
            // - EmailJS: emailjs.send('service_id', 'template_id', formData)
            // - Netlify Forms: Just add netlify attribute to form
            // - Formspree: https://formspree.io/
            // - Backend API: fetch('/api/contact', { method: 'POST', body: formData })
            
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
        
        // For production, replace the setTimeout with actual form submission:
        /*
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showNotification('Failed to send message. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('An error occurred. Please try again later.', 'error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
        */
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#0066ff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: background 0.2s ease;
    }
    
    .notification-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Animate elements on scroll
const animateOnScrollElements = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .achievement-item, .recommendation-card');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            entry.target.style.opacity = '1';
            
            // Add animate class for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Initially hide elements and observe them
animateOnScrollElements.forEach(element => {
    element.style.opacity = '0';
    scrollObserver.observe(element);
});

// Skills progress bar animation - Fixed
const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                if (progress) {
                    // Set CSS custom property and add animate class
                    bar.style.setProperty('--progress-width', progress + '%');
                    setTimeout(() => {
                        bar.classList.add('animate');
                    }, 200);
                }
            });
            // Only animate once
            skillProgressObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

// Observe all skill categories for progress animation
document.querySelectorAll('.skill-category').forEach(category => {
    skillProgressObserver.observe(category);
});

// Skills category collapsible functionality - Fixed
function initializeSkillCategories() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach((category, index) => {
        const header = category.querySelector('.skill-category-header');
        const skillsGrid = category.querySelector('.skills-grid');
        
        if (!header || !skillsGrid) return;
        
        // Add expand button if it doesn't exist
        let expandBtn = header.querySelector('.expand-btn');
        if (!expandBtn) {
            expandBtn = document.createElement('button');
            expandBtn.className = 'expand-btn';
            expandBtn.setAttribute('aria-label', 'Collapse category');
            expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            header.appendChild(expandBtn);
        }
        
        // Store original max-height for smooth animation
        const originalHeight = skillsGrid.scrollHeight;
        skillsGrid.style.maxHeight = originalHeight + 'px';
        
        // Add click handler to header for expanding/collapsing
        header.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSkillCategory(category);
        });
        
        // Start with some categories collapsed (optional)
        if (index > 2) { // Keep first 3 categories expanded by default
            category.classList.add('collapsed');
            skillsGrid.style.maxHeight = '0';
            skillsGrid.style.opacity = '0';
            expandBtn.setAttribute('aria-label', 'Expand category');
        }
    });
}

function toggleSkillCategory(category) {
    const skillsGrid = category.querySelector('.skills-grid');
    const expandBtn = category.querySelector('.expand-btn');
    
    if (!skillsGrid || !expandBtn) return;
    
    const isCollapsed = category.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expand
        category.classList.remove('collapsed');
        skillsGrid.style.maxHeight = skillsGrid.scrollHeight + 'px';
        skillsGrid.style.opacity = '1';
        expandBtn.setAttribute('aria-label', 'Collapse category');
        
        // Animate progress bars if they haven't been animated yet
        const progressBars = skillsGrid.querySelectorAll('.skill-progress-bar:not(.animate)');
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                bar.style.setProperty('--progress-width', progress + '%');
                setTimeout(() => {
                    bar.classList.add('animate');
                }, 300);
            }
        });
    } else {
        // Collapse
        category.classList.add('collapsed');
        skillsGrid.style.maxHeight = '0';
        skillsGrid.style.opacity = '0';
        expandBtn.setAttribute('aria-label', 'Expand category');
    }
}

// Initialize skill categories when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSkillCategories();
});

// Add particle effect to hero section (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 102, 255, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Add particle animation styles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
        }
    }
`;
document.head.appendChild(particleStyles);

// Handle external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.hasAttribute('target') && e.target.getAttribute('target') === '_blank') {
        // Add analytics tracking here if needed
        console.log('External link clicked:', e.target.href);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 3px solid rgba(0, 102, 255, 0.3);
        border-top: 3px solid #0066ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10001;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    body.loaded::before,
    body.loaded::after {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease;
    }
`;
document.head.appendChild(loadingStyles);

// Console message for developers
console.log('%c🚀 Welcome to Mustafa Ghoneim\'s Portfolio!', 'color: #0066ff; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with passion for AI, Robotics, and Education 🤖📚', 'color: #00d4aa; font-size: 14px;');
console.log('%cInterested in collaborating? Reach out! 💪', 'color: #ff6b35; font-size: 14px;');