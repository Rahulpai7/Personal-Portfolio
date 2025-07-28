// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
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
        const toggleLabel = document.querySelector('.toggle-label');
        if (toggleLabel) {
            toggleLabel.textContent = this.theme === 'light' ? 'Light Mode' : 'Dark Mode';
        }
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // Update toggle label
        this.updateToggleLabel();
        
        // Add smooth transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
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
        console.log('Loading screen initialized'); // Debug log
        this.typeMessages();
        this.updateProgress();
        setTimeout(() => this.hideLoading(), 4000);
    }

    typeMessages() {
        const typeMessage = (message, callback) => {
            let index = 0;
            this.loadingMessage.textContent = '';
            
            const typeInterval = setInterval(() => {
                this.loadingMessage.textContent += message[index];
                index++;
                
                if (index >= message.length) {
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
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 100) progress = 100;
            
            if (this.progressPercentage) {
                this.progressPercentage.textContent = Math.round(progress) + '%';
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 200);
    }

    hideLoading() {
        if (!this.loadingScreen) return;
        
        console.log('Hiding loading screen'); // Debug log
        this.loadingScreen.classList.add('hidden');
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 1000);
    }
}


// Navigation Manager - FIXED
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
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

        // Scroll event for navbar styling
        window.addEventListener('scroll', () => {
            this.handleScroll();
            this.setActiveLink();
        });
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
            const offsetTop = section.offsetTop - 80;
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

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Typing Effect Manager - FIXED
class TypingManager {
    constructor() {
        this.typedTextElement = document.getElementById('typed-text');
        
        // ✅ SAFETY CHECK ADDED
        if (!this.typedTextElement) {
            console.warn('Typed text element not found - skipping TypingManager');
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

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Animation Observer Manager - FIXED
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.createObserver();
        this.animateSkillBars();
    }

    createObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, this.observerOptions);

        // ✅ SAFETY CHECK ADDED
        const elementsWithAOS = document.querySelectorAll('[data-aos]');
        if (elementsWithAOS.length > 0) {
            elementsWithAOS.forEach(element => {
                observer.observe(element);
            });
        }
    }

    animateSkillBars() {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 200);
                    });
                }
            });
        }, this.observerOptions);

        // ✅ SAFETY CHECK ADDED
        const skillsSections = document.querySelectorAll('.skills');
        if (skillsSections.length > 0) {
            skillsSections.forEach(section => {
                skillObserver.observe(section);
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
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    setActiveFilter(activeButton) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
        });
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
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        // Show loading state
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
        } catch (error) {
            // Show error message
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}

// Enhanced Skills Animation
function initializeEnhancedSkills() {
    const skillBars = document.querySelectorAll('.skill-progress-enhanced');
    
    // ✅ SAFETY CHECK ADDED
    if (skillBars.length === 0) return;
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute('data-width');
                
                setTimeout(() => {
                    skillBar.style.width = width + '%';
                }, 200);
                
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
                setTimeout(() => {
                    item.style.transform = 'translateX(5px)';
                }, index * 100);
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
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const speed = scrolled * 0.5;
        heroBackground.style.transform = `translateY(${speed}px)`;
    });
}

// Add cursor trail effect (optional) - FIXED
class CursorTrail {
    constructor() {
        this.dots = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create trailing dots
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-dot';
            dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--accent-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: all 0.1s ease;
                opacity: ${1 - i * 0.1};
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

    animate() {
        let x = this.mouse.x;
        let y = this.mouse.y;

        this.dots.forEach((dot, index) => {
            dot.x += (x - dot.x) * 0.3;
            dot.y += (y - dot.y) * 0.3;
            
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            
            x = dot.x;
            y = dot.y;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize cursor trail on desktop devices
if (window.innerWidth > 768) {
    new CursorTrail();
}
