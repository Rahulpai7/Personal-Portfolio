// Theme Management
class ThemeManager {
    constructor() {
        try {
            this.theme = localStorage.getItem('theme') || 'dark';
        } catch (error) {
            this.theme = 'dark';
        }
        this.init();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateToggleLabel();
        this.bindEvents();
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    updateToggleLabel() {
        // No label to update since toggle is now in navbar
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        
        try {
            localStorage.setItem('theme', this.theme);
        } catch (error) {
            console.warn('Failed to save theme preference');
        }
        
        this.updateToggleLabel();
    }
}

// Loading Screen Manager - CORRECTED
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.loadingMessage = document.getElementById('loading-message');
        this.progressPercentage = document.querySelector('.progress-percentage');
        
        // Safety check
        if (!this.loadingScreen || !this.loadingMessage) {
            console.warn('Loading elements not found');
            return;
        }
        
        this.messages = [
            'Initializing quantum portfolio...',
            'Loading backend systems...',
            'Compiling experiences...',
            'Optimizing user interface...',
            'Deploying awesome content...'
        ];
        this.currentMessage = 0;
        this.init();
    }

    init() {
        this.typeMessages();
        this.updateProgress();
        
        // Wait for actual content to load
        Promise.all([
            new Promise(resolve => setTimeout(resolve, 3000)),
            document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => window.addEventListener('load', resolve))
        ]).then(() => this.hideLoading());
    }

    typeMessages() {
        const typeMessage = (message, callback) => {
            if (!this.loadingMessage) return callback();
            
            let index = 0;
            this.loadingMessage.textContent = '';
            
            const typeInterval = setInterval(() => {
                if (index < message.length) {
                    this.loadingMessage.textContent = message.substring(0, index + 1);
                    index++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(callback, 800);
                }
            }, 50);
        };

        const nextMessage = () => {
            if (this.currentMessage < this.messages.length) {
                typeMessage(this.messages[this.currentMessage], () => {
                    this.currentMessage++;
                    if (this.currentMessage < this.messages.length) {
                        setTimeout(nextMessage, 200);
                    }
                });
            }
        };

        nextMessage();
    }

    updateProgress() {
        let progress = 0;
        const updateFrame = () => {
            progress += Math.random() * 2;
            if (progress > 100) progress = 100;
            
            if (this.progressPercentage) {
                this.progressPercentage.textContent = Math.round(progress) + '%';
            }
            
            if (progress < 100) {
                requestAnimationFrame(updateFrame);
            }
        };
        requestAnimationFrame(updateFrame);
    }

    hideLoading() {
        if (!this.loadingScreen) return;
        
        try {
            this.loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.style.display = 'none';
                }
            }, 1000);
        } catch (error) {
            console.warn('Error hiding loading screen:', error);
        }
    }
}


// Navigation Manager - FIXED
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.NAVBAR_OFFSET = 80;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
        this.setActiveLink();
    }

    bindEvents() {
        // ✅ SAFETY CHECK ADDED
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                this.closeMobileMenu();
            });
        });

        // Debounced scroll event for navbar styling
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
            this.setActiveLink();
        }, 10));
    }

    toggleMobileMenu() {
        // ✅ SAFETY CHECK ADDED
        if (this.hamburger && this.navMenu) {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        // ✅ SAFETY CHECK ADDED
        if (this.hamburger && this.navMenu) {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('active');
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - this.NAVBAR_OFFSET;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        if (this.navbar) {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
    }

    setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 200;
        let activeSection = null;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });

        if (activeSection) {
            this.navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${activeSection}`);
            });
        }
    }

    debounce(func, wait) {
        return (...args) => {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

// Typing Effect Manager - FIXED
class TypingManager {
    constructor() {
        this.typedTextElement = document.getElementById('typed-text');
        
        if (!this.typedTextElement) {
            return;
        }
        
        this.texts = [
            'Software Development Engineer',
            'Backend Systems Architect',
            'Spring Boot Developer',
            'C++ Enthusiast',
            'Problem Solver'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.animationId = null;
        this.init();
    }

    init() {
        if (!this.typedTextElement) return;
        setTimeout(() => this.type(), 2000);
    }

    type() {
        if (!this.typedTextElement) return;
        
        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.typedTextElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.typedTextElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        this.animationId = setTimeout(() => this.type(), typeSpeed);
    }

    destroy() {
        if (this.animationId) {
            clearTimeout(this.animationId);
        }
    }
}

// Animation Observer Manager - FIXED
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = null;
        this.skillObserver = null;
        this.init();
    }

    init() {
        this.createObserver();
        this.animateSkillBars();
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, this.observerOptions);

        const elementsWithAOS = document.querySelectorAll('[data-aos]');
        if (elementsWithAOS.length > 0) {
            elementsWithAOS.forEach(element => {
                this.observer.observe(element);
            });
        }
    }

    animateSkillBars() {
        this.skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        const width = bar.getAttribute('data-width');
                        requestAnimationFrame(() => {
                            setTimeout(() => {
                                bar.style.width = width + '%';
                            }, index * 100);
                        });
                    });
                }
            });
        }, this.observerOptions);

        const skillsSections = document.querySelectorAll('.skills');
        if (skillsSections.length > 0) {
            skillsSections.forEach(section => {
                this.skillObserver.observe(section);
            });
        }
    }
}

// Project Filter Manager - FIXED
class ProjectFilterManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        
        // ✅ SAFETY CHECK ADDED
        if (this.filterButtons.length > 0 && this.projectCards.length > 0) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterProjects(filter);
                this.setActiveFilter(button);
            });
        });
    }

    filterProjects(filter) {
        // Sanitize filter input
        const sanitizedFilter = filter.replace(/[^a-zA-Z0-9-_]/g, '');
        
        this.projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            if (sanitizedFilter === 'all' || category === sanitizedFilter) {
                card.style.display = 'block';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                });
            }
        });
    }

    setActiveFilter(activeButton) {
        this.filterButtons.forEach(button => button.classList.remove('active'));
        activeButton.classList.add('active');
    }
}

// Contact Form Manager - FIXED
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        
        // ✅ SAFETY CHECK ADDED
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add floating label functionality
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check if input has value on page load
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });
    }

    async handleSubmit() {
        if (!this.validateForm()) return;
        
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Sanitize form data
            const sanitizedData = {
                name: this.sanitizeInput(formData.get('name')),
                email: this.sanitizeInput(formData.get('email')),
                message: this.sanitizeInput(formData.get('message'))
            };
            
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    validateForm() {
        const name = this.form.querySelector('input[name="name"]')?.value.trim();
        const email = this.form.querySelector('input[name="email"]')?.value.trim();
        const message = this.form.querySelector('textarea[name="message"]')?.value.trim();
        
        if (!name || !email || !message) {
            this.showMessage('Please fill in all fields.', 'error');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        return true;
    }

    sanitizeInput(input) {
        if (!input) return '';
        return input.toString().replace(/<script[^>]*>.*?<\/script>/gi, '').trim();
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = this.form.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        const timeout = type === 'error' ? 7000 : 5000;
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, timeout);
    }
}

// Enhanced Skills Animation
function initializeEnhancedSkills() {
    const skillBars = document.querySelectorAll('.skill-progress-enhanced');
    
    if (skillBars.length === 0) return;
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                if (width && !isNaN(width)) {
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            skillBar.style.width = Math.min(100, Math.max(0, parseInt(width))) + '%';
                        }, 200);
                    });
                }
                
                skillObserver.unobserve(skillBar);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
    
    // Enhanced hover effects for skill categories
    const skillCategories = document.querySelectorAll('.skill-category-enhanced');
    
    skillCategories.forEach(category => {
        category.addEventListener('mouseenter', () => {
            const skillItems = category.querySelectorAll('.skill-item-enhanced');
            skillItems.forEach((item, index) => {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        item.style.transform = 'translateX(5px)';
                    }, index * 50);
                });
            });
        });
        
        category.addEventListener('mouseleave', () => {
            const skillItems = category.querySelectorAll('.skill-item-enhanced');
            skillItems.forEach(item => {
                item.style.transform = 'translateX(0)';
            });
        });
    });
}

// Initialize all managers when DOM is loaded - FIXED
document.addEventListener('DOMContentLoaded', () => {
    // ✅ FIXED - Initialize all classes (they now have internal safety checks)
    new LoadingManager();
    new ThemeManager();
    new NavigationManager();
    new TypingManager();
    new AnimationManager();
    new ProjectFilterManager();
    new ContactFormManager();
    initializeEnhancedSkills();
});

// Add smooth scrolling for all anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add parallax effect to hero section - FIXED
const heroBackground = document.querySelector('.hero-background');
if (heroBackground) {
    let ticking = false;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const speed = scrolled * 0.3;
        heroBackground.style.transform = `translate3d(0, ${speed}px, 0)`;
        ticking = false;
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Add cursor trail effect (optional) - FIXED
class CursorTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.lastTime = 0;
        this.FPS_LIMIT = 60;
        this.init();
    }

    init() {
        // Create fewer trailing dots for better performance
        for (let i = 0; i < 6; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${Math.max(0.1, 1 - i * 0.15)};
                will-change: transform;
            `;
            document.body.appendChild(dot);
            this.dots.push({ element: dot, x: 0, y: 0 });
        }

        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    animate(currentTime = 0) {
        // Limit frame rate
        if (currentTime - this.lastTime < 1000 / this.FPS_LIMIT) {
            this.animationId = requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        this.lastTime = currentTime;
        
        let x = this.mouse.x;
        let y = this.mouse.y;
        
        const SMOOTHING = 0.2;

        this.dots.forEach((dot) => {
            dot.x += (x - dot.x) * SMOOTHING;
            dot.y += (y - dot.y) * SMOOTHING;
            
            dot.element.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
            
            x = dot.x;
            y = dot.y;
        });

        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.dots.forEach(dot => {
            if (dot.element.parentNode) {
                dot.element.parentNode.removeChild(dot.element);
            }
        });
    }
}

// Initialize cursor trail on desktop devices
if (window.innerWidth > 768 && !('ontouchstart' in window)) {
    new CursorTrail();
}
