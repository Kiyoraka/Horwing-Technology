// DOM Content Loaded
// Theme Selector functionality
let isThemeWheelOpen = false;

function initThemeSelector() {
    const themeToggle = document.getElementById('themeToggle');
    const themeWheel = document.getElementById('themeWheel');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeToggle || !themeWheel) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('selectedTheme') || 'blue';
    setTheme(savedTheme);
    
    // Toggle theme wheel
    themeToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        isThemeWheelOpen = !isThemeWheelOpen;
        themeWheel.classList.toggle('active', isThemeWheelOpen);
    });
    
    // Close theme wheel when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.theme-selector')) {
            isThemeWheelOpen = false;
            themeWheel.classList.remove('active');
        }
    });
    
    // Theme option selection
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            setTheme(theme);
            localStorage.setItem('selectedTheme', theme);
            
            // Close wheel after selection
            isThemeWheelOpen = false;
            themeWheel.classList.remove('active');
            
            // Show notification
            showNotification(`Theme changed to ${theme.charAt(0).toUpperCase() + theme.slice(1)}!`, 'success');
        });
    });
}

function setTheme(themeName) {
    // Update body data-theme attribute
    document.body.setAttribute('data-theme', themeName);
    
    // Update active theme option
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.theme === themeName);
    });
    
    // Add a subtle animation to show theme change
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initSmoothScrolling();
    initScrollEffects();
    initFormHandling();
    initAnimations();
    initCarousel();
    initGallery();
    initThemeSelector();
});

// Navigation functionality
function initNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .feature, .benefit-item, .component, .process-step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for statistics (if any)
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = collectFormData(contactForm);
            
            // Validate required fields
            if (!validateFormData(formData)) {
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Opening WhatsApp...';
            submitBtn.disabled = true;
            
            // Send to WhatsApp
            sendToWhatsApp(formData);
            
            // Reset form and button state after a short delay
            setTimeout(() => {
                showNotification('Redirecting to WhatsApp...', 'success');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Form validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
}

// Collect form data from contact form
function collectFormData(form) {
    const data = {
        name: form.querySelector('input[placeholder="Your Name"]')?.value?.trim() || '',
        email: form.querySelector('input[placeholder="Your Email"]')?.value?.trim() || '',
        phone: form.querySelector('input[placeholder="Your Phone"]')?.value?.trim() || '',
        service: form.querySelector('select')?.value || '',
        message: form.querySelector('textarea[placeholder="Your Message"]')?.value?.trim() || ''
    };
    
    return data;
}

// Validate form data
function validateFormData(data) {
    // Check required fields
    if (!data.name || !data.email || !data.message || !data.service) {
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }
    
    return true;
}

// Send data to WhatsApp
function sendToWhatsApp(data) {
    const whatsappNumber = '60123202422'; // Malaysia number format
    
    // Get service name from select option
    const serviceNames = {
        'skd': 'Vehicle SKD Assembly',
        'electrification': 'Vehicle Electrification',
        'charging': 'Charging Stations',
        'biomass': 'Biomass Power',
        'consultation': 'General Consultation'
    };
    
    const serviceName = serviceNames[data.service] || data.service;
    
    // Format the message
    let message = `🌟 *HORWING TECHNOLOGY - Contact Inquiry* 🌟\n\n`;
    message += `👤 *Name:* ${data.name}\n`;
    message += `📧 *Email:* ${data.email}\n`;
    
    if (data.phone) {
        message += `📱 *Phone:* ${data.phone}\n`;
    }
    
    message += `🔧 *Service Interest:* ${serviceName}\n\n`;
    message += `💬 *Message:*\n${data.message}\n\n`;
    message += `---\n`;
    message += `*Sent from: www.horwingtechnology.com*`;
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank');
}

// Field validation
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error messages
    clearValidation(e);
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
        }
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
    }
}

// Clear field validation
function clearValidation(e) {
    const field = e.target;
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    field.style.borderColor = '#ddd';
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    errorMsg.style.color = '#e74c3c';
    errorMsg.style.fontSize = '0.9rem';
    errorMsg.style.marginTop = '0.5rem';
    field.parentNode.appendChild(errorMsg);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

// Remove notification
function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Initialize animations
function initAnimations() {
    // Improved parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const heroBottom = hero.offsetTop + heroHeight;
            
            // Only apply parallax when hero section is visible
            if (scrolled < heroBottom) {
                const parallaxOffset = Math.min(scrolled * 0.3, heroHeight * 0.2);
                hero.style.transform = `translateY(${parallaxOffset}px)`;
            } else {
                hero.style.transform = 'translateY(0)';
            }
        }
    });

    // Hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Utility functions
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
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
// initLazyLoading();

// Export functions for potential external use
window.HorwingTech = {
    showNotification,
    scrollToSection: function(sectionId) {
        const section = document.querySelector(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Simple Carousel functionality
let slideIndex = 1;
const images = [
    'assets/img/skd1.jpg',
    'assets/img/skd2.jpg', 
    'assets/img/skd3.jpg'
];

function changeSlide(n) {
    showSlide(slideIndex += n);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    const img = document.getElementById('carousel-img');
    const dots = document.querySelectorAll('.dot');
    
    if (!img || !dots.length) return;
    
    if (n > images.length) {slideIndex = 1}
    if (n < 1) {slideIndex = images.length}
    
    // Update image source
    img.src = images[slideIndex - 1];
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
    }
}

// Initialize carousel when page loads
function initCarousel() {
    showSlide(slideIndex);
}

// Company Gallery functionality
let currentGallerySlide = 0;
const galleryData = [
    {
        image: 'assets/img/placeholder-1.svg',
        title: 'Advanced Manufacturing Facility',
        description: 'State-of-the-art production lines equipped with cutting-edge technology for sustainable energy solutions.'
    },
    {
        image: 'assets/img/charging-infrastructure.svg',
        title: 'Solar Power Installation',
        description: 'Large-scale solar energy projects delivering clean, renewable power to communities and industries.'
    },
    {
        image: 'assets/img/biomass-power.svg',
        title: 'Biomass Power Plant',
        description: 'Innovative biomass facilities converting organic waste into clean energy and valuable byproducts.'
    },
    {
        image: 'assets/img/electrification.svg',
        title: 'Vehicle Electrification Center',
        description: 'Advanced electrification systems transforming traditional vehicles into clean, efficient electric solutions.'
    },
    {
        image: 'assets/img/skd-assembly.svg',
        title: 'Research & Development Lab',
        description: 'Innovation hub where our expert teams develop next-generation sustainable energy technologies.'
    }
];

function changeGallerySlide(direction) {
    currentGallerySlide += direction;
    
    if (currentGallerySlide >= galleryData.length) {
        currentGallerySlide = 0;
    }
    if (currentGallerySlide < 0) {
        currentGallerySlide = galleryData.length - 1;
    }
    
    updateGallerySlide();
}

function goToGallerySlide(index) {
    currentGallerySlide = index;
    updateGallerySlide();
}

function updateGallerySlide() {
    const mainImage = document.getElementById('mainGalleryImage');
    const slideTitle = document.getElementById('slideTitle');
    const slideDescription = document.getElementById('slideDescription');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && slideTitle && slideDescription) {
        const currentData = galleryData[currentGallerySlide];
        
        // Update main image and content
        mainImage.src = currentData.image;
        slideTitle.textContent = currentData.title;
        slideDescription.textContent = currentData.description;
        
        // Update thumbnail active state
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentGallerySlide);
        });
    }
}

// Initialize gallery when page loads
function initGallery() {
    updateGallerySlide();
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        const gallery = document.querySelector('.company-gallery');
        if (gallery && isElementInViewport(gallery)) {
            if (e.key === 'ArrowLeft') {
                changeGallerySlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeGallerySlide(1);
            }
        }
    });
    
    // Auto-advance slides (optional)
    setInterval(() => {
        const gallery = document.querySelector('.company-gallery');
        if (gallery && isElementInViewport(gallery)) {
            changeGallerySlide(1);
        }
    }, 8000); // Change slide every 8 seconds
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}