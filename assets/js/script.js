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

// Skills progress bar animation
const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                if (progress) {
                    setTimeout(() => {
                        bar.style.width = progress + '%';
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

// Enhanced timeline animation with stagger effect
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 200); // Stagger animation
            
            timelineObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

// Observe timeline items
document.querySelectorAll('.timeline-item').forEach(item => {
    timelineObserver.observe(item);
});

// Mark current position (most recent job)
const currentJobs = document.querySelectorAll('.timeline-item');
if (currentJobs.length > 0) {
    // Mark the first two items as current (since they're both 2024-Present and 2023-Present)
    currentJobs[0].classList.add('current');
    if (currentJobs[1]) {
        currentJobs[1].classList.add('current');
    }
}

// Enhanced skill tag interactions
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = tag.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        tag.style.position = 'relative';
        tag.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Experience section interactive features
document.querySelectorAll('.timeline-tags .tag').forEach(tag => {
    tag.addEventListener('click', () => {
        // Filter timeline items by tag
        const tagText = tag.textContent.toLowerCase();
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            const itemTags = Array.from(item.querySelectorAll('.tag')).map(t => t.textContent.toLowerCase());
            if (itemTags.includes(tagText)) {
                item.style.opacity = '1';
                item.style.transform = 'scale(1.02)';
                item.style.border = '2px solid var(--primary-color)';
            } else {
                item.style.opacity = '0.5';
                item.style.transform = 'scale(0.98)';
                item.style.border = '1px solid var(--border-color)';
            }
        });
        
        // Reset after 3 seconds
        setTimeout(() => {
            timelineItems.forEach(item => {
                item.style.opacity = '';
                item.style.transform = '';
                item.style.border = '';
            });
        }, 3000);
    });
});

// Skills category hover effects enhancement
document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', () => {
        // Slightly fade other categories
        document.querySelectorAll('.skill-category').forEach(other => {
            if (other !== category) {
                other.style.opacity = '0.7';
                other.style.transform = 'scale(0.98)';
            }
        });
    });
    
    category.addEventListener('mouseleave', () => {
        // Reset all categories
        document.querySelectorAll('.skill-category').forEach(other => {
            other.style.opacity = '';
            other.style.transform = '';
        });
    });
});

// Add performance optimization for animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

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

// Initialize particles (uncomment if you want particle effect)
// createParticles();

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

// Skills category expandable functionality
function initializeSkillCategories() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const header = category.querySelector('.skill-category-header');
        const expandBtn = category.querySelector('.expand-btn');
        const content = category.querySelector('.skill-content');
        
        // Only add expandable functionality to categories with expand buttons
        if (expandBtn && content) {
            // Initially collapse all expandable categories
            category.classList.add('collapsed');
            content.style.maxHeight = '0';
            content.style.opacity = '0';
            
            // Add click handler to header for expanding/collapsing
            header.addEventListener('click', (e) => {
                e.preventDefault();
                toggleSkillCategory(category);
            });
        } else if (content) {
            // For non-expandable categories, ensure content is visible
            content.style.maxHeight = 'none';
            content.style.opacity = '1';
        }
    });
}

function toggleSkillCategory(category) {
    const content = category.querySelector('.skill-content');
    const expandBtn = category.querySelector('.expand-btn');
    
    if (!content || !expandBtn) return;
    
    const isCollapsed = category.classList.contains('collapsed');
    
    if (isCollapsed) {
        // Expand
        category.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.opacity = '1';
        expandBtn.setAttribute('aria-label', 'Collapse category');
    } else {
        // Collapse
        category.classList.add('collapsed');
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        expandBtn.setAttribute('aria-label', 'Expand category');
    }
}

// Add expand buttons to all skill categories that don't have them
function addExpandButtonsToSkillCategories() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        const header = category.querySelector('.skill-category-header');
        const existingBtn = category.querySelector('.expand-btn');
        const skillItems = category.querySelector('.skill-items');
        const skillTags = category.querySelector('.skill-tags');
        
        // Skip if expand button already exists
        if (existingBtn) return;
        
        // Create expand button
        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-btn';
        expandBtn.setAttribute('aria-label', 'Expand category');
        expandBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        // Add expand button to header
        header.appendChild(expandBtn);
        
        // Wrap skill items and tags in skill-content div if not already wrapped
        if (skillItems && !category.querySelector('.skill-content')) {
            const skillContent = document.createElement('div');
            skillContent.className = 'skill-content';
            
            // Move skill items and tags into content wrapper
            if (skillItems) {
                skillContent.appendChild(skillItems);
            }
            if (skillTags) {
                skillContent.appendChild(skillTags);
            }
            
            // Insert content wrapper after header
            header.parentNode.insertBefore(skillContent, header.nextSibling);
        }
    });
}

// Initialize skill categories when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addExpandButtonsToSkillCategories();
    initializeSkillCategories();
});