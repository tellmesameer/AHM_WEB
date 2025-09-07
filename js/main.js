/* ========================================
   MAIN JAVASCRIPT - Phase 1
   ======================================== */

// ===== RESPONSIVE NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.navbar-nav .nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll event for performance
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // ===== RESPONSIVE IMAGE LOADING =====
    // Lazy loading for images with intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('loading');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
    
    // ===== RESPONSIVE CARD ANIMATIONS =====
    // Animate cards on scroll
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    const cards = document.querySelectorAll('.service-card, .solution-card, .testimonial-card');
    cards.forEach(card => {
        cardObserver.observe(card);
    });
    
    // ===== ENHANCED FORM HANDLING =====
    // Secure form validation and submission with Formspree integration
    const forms = document.querySelectorAll('.secure-form');
    
    forms.forEach(form => {
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // Real-time validation on input
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            // Validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Form submission handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = validateForm(form);
            
            if (isValid) {
                submitForm(form);
            } else {
                // Focus first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });
    
    // ===== FORM VALIDATION FUNCTIONS =====
    function validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');
        
        // Skip validation for empty non-required fields
        if (!required && !value) {
            return true;
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (required && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(field)} is required.`;
        }
        
        // Type-specific validation
        if (value && isValid) {
            switch (type) {
                case 'email':
                    if (!isValidEmail(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                case 'tel':
                    if (!isValidPhone(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                case 'text':
                    if (field.name === 'firstName' || field.name === 'lastName') {
                        if (value.length < 2) {
                            isValid = false;
                            errorMessage = 'Name must be at least 2 characters.';
                        }
                    }
                    break;
            }
            
            // Textarea validation
            if (field.tagName === 'TEXTAREA' && field.name === 'message') {
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters.';
                }
            }
        }
        
        // Apply validation classes
        if (isValid) {
            field.classList.add('is-valid');
        } else {
            field.classList.add('is-invalid');
        }
        
        return isValid;
    }
    
    function validateForm(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        if (btnText && btnLoading) {
            btnText.classList.add('d-none');
            btnLoading.classList.remove('d-none');
        } else {
            submitBtn.textContent = 'Sending...';
        }
        
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Create FormData
        const formData = new FormData(form);
        
        // Add timestamp for tracking
        formData.append('_timestamp', new Date().toISOString());
        formData.append('_user_agent', navigator.userAgent);
        formData.append('_referrer', document.referrer);
        
        // Submit to Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showFormSuccess(form);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            showFormError(form, 'There was an error sending your message. Please try again.');
        })
        .finally(() => {
            // Reset button state
            if (btnText && btnLoading) {
                btnText.classList.remove('d-none');
                btnLoading.classList.add('d-none');
            } else {
                submitBtn.textContent = 'Send Message';
            }
            
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        });
    }
    
    function showFormSuccess(form) {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-check-circle me-2"></i>
                <div>
                    <strong>Thank you!</strong> Your message has been sent successfully. 
                    We'll get back to you within 24 hours.
                </div>
            </div>
        `;
        
        // Insert success message
        form.parentNode.insertBefore(successDiv, form);
        
        // Hide form
        form.style.display = 'none';
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove success message after 10 seconds
        setTimeout(() => {
            successDiv.remove();
            form.style.display = 'block';
            form.reset();
            
            // Clear validation classes
            const fields = form.querySelectorAll('.is-valid, .is-invalid');
            fields.forEach(field => {
                field.classList.remove('is-valid', 'is-invalid');
            });
        }, 10000);
    }
    
    function showFormError(form, message) {
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <div>
                    <strong>Error:</strong> ${message}
                </div>
            </div>
        `;
        
        // Insert error message
        form.parentNode.insertBefore(errorDiv, form);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // ===== VALIDATION UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Remove all non-digit characters
        const digits = phone.replace(/\D/g, '');
        // Check if it has 10-15 digits (international format)
        return digits.length >= 10 && digits.length <= 15;
    }
    
    function getFieldLabel(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : 'This field';
    }
    
    // ===== RESPONSIVE UTILITIES =====
    // Handle window resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate any size-dependent elements
            updateActiveNav();
        }, 250);
    });
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    // Keyboard navigation for dropdowns
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Skip to main content link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Preload critical resources
    function preloadCriticalResources() {
        const criticalImages = [
            'https://via.placeholder.com/600x400/0066cc/ffffff?text=Data+Visualization'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    preloadCriticalResources();
    
    // ===== RESPONSIVE BREAKPOINT DETECTION =====
    // Utility function to detect current breakpoint
    function getCurrentBreakpoint() {
        const width = window.innerWidth;
        if (width >= 1400) return 'xxl';
        if (width >= 1200) return 'xl';
        if (width >= 992) return 'lg';
        if (width >= 768) return 'md';
        if (width >= 576) return 'sm';
        return 'xs';
    }
    
    // Add breakpoint class to body for CSS targeting
    function updateBreakpointClass() {
        const breakpoint = getCurrentBreakpoint();
        document.body.className = document.body.className.replace(/breakpoint-\w+/g, '');
        document.body.classList.add(`breakpoint-${breakpoint}`);
    }
    
    updateBreakpointClass();
    window.addEventListener('resize', updateBreakpointClass);
    
    // ===== CUMULATIVE LAYOUT SHIFT (CLS) PREVENTION =====
    // Reserve space for dynamic content to prevent layout shifts
    function preventLayoutShift() {
        // Reserve space for images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.style.aspectRatio) {
                img.style.aspectRatio = '16/9'; // Default aspect ratio
            }
        });
        
        // Reserve space for dynamic content
        const dynamicElements = document.querySelectorAll('.dynamic-content');
        dynamicElements.forEach(element => {
            if (!element.style.minHeight) {
                element.style.minHeight = '200px';
            }
        });
    }
    
    preventLayoutShift();
    
    // ===== RESPONSIVE TESTING UTILITIES =====
    // Development helper to test different breakpoints
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Responsive utilities loaded');
        console.log('Current breakpoint:', getCurrentBreakpoint());
        
        // Add breakpoint indicator in development
        const indicator = document.createElement('div');
        indicator.id = 'breakpoint-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            font-family: monospace;
        `;
        indicator.textContent = getCurrentBreakpoint();
        document.body.appendChild(indicator);
        
        window.addEventListener('resize', () => {
            indicator.textContent = getCurrentBreakpoint();
        });
    }
});

// ===== UTILITY FUNCTIONS =====
// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
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
    };
}

// ===== EXPORT FOR MODULE USAGE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle
    };
}
