document.title = 'KaloudasDev';

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
    
    document.querySelectorAll('.loading-screen, .loading-content, .progress-bar, .progress-fill, .loading-percentage').forEach(el => {
        el.remove();
    });

    const header = document.querySelector('header');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
            e.preventDefault();
        }
    });

    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });

    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        
        localStorage.setItem('theme', newTheme);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }

    async function getGitHubRepos() {
        try {
            const response = await fetch('https://api.github.com/users/KaloudasDev/repos');
            const repos = await response.json();
            
            if (Array.isArray(repos)) {
                const completedProjectsElement = document.querySelector('[data-count="50"]');
                if (completedProjectsElement) {
                    completedProjectsElement.setAttribute('data-count', repos.length);
                    startCounterAnimation(completedProjectsElement, repos.length);
                }
            }
        } catch (error) {
            console.log('Could not fetch GitHub repos, using default count');
        }
    }

    function startCounterAnimation(target, count) {
        const duration = 2000;
        const step = count / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= count) {
                current = count;
                clearInterval(timer);
            }
            target.textContent = Math.floor(current);
        }, 16);
    }

    getGitHubRepos();

    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#5865F2" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#5865F2",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            }
        }
    });

    const skillLevels = document.querySelectorAll('.level-progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.width = level + '%';
            }
        });
    }, observerOptions);
    
    skillLevels.forEach(level => {
        observer.observe(level);
    });

    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const count = parseInt(target.getAttribute('data-count'));
                startCounterAnimation(target, count);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                setTimeout(() => {
                    navLinks.style.opacity = '1';
                    navLinks.style.transform = 'translateY(0)';
                }, 10);
            } else {
                navLinks.style.opacity = '0';
                navLinks.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    navLinks.style.display = 'none';
                }, 300);
            }
        });
    }

    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    navLinksItems.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.setProperty('--underline-width', '50%');
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.setProperty('--underline-width', '0%');
        });
    });

    const sections = document.querySelectorAll('section');
    
    function updateActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
        
        if (window.scrollY < 100) {
            document.title = 'KaloudasDev';
            navLinksItems[0].classList.add('active');
        }
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.style.opacity = '0';
                    navLinks.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        navLinks.classList.remove('active');
                        navLinks.style.display = 'none';
                    }, 300);
                }
            }
        });
    });

    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const originalText = this.querySelector('span').textContent;
            this.querySelector('span').textContent = 'Preparing CV';
            this.disabled = true;
            
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = './assets/resume/KaloudasDev_CV.pdf';
                link.download = 'KaloudasDev_CV.pdf';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                this.querySelector('span').textContent = originalText;
                this.disabled = false;
                
            }, 1500);
        });
    }

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const name = this.querySelector('#fullName').value.trim().toLowerCase();
            const email = this.querySelector('#email').value.trim().toLowerCase();
            
            const blockedNames = ['kaloudas', 'kaloudasdev'];
            const blockedEmails = ['kaloudasdev@gmail.com', 'kaloudasdev', 'kaloudas'];
            
            const isBlockedName = blockedNames.some(blocked => name.includes(blocked));
            const isBlockedEmail = blockedEmails.some(blocked => email.includes(blocked));
            
            if (isBlockedName || isBlockedEmail) {
                e.preventDefault();
                alert('Please use your own name and email address to contact me.');
                return false;
            }
        });
    }

    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .feature, .stat-card, .experience-card');
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    const emailElement = document.querySelector('.contact-method:nth-child(2) .contact-details p');
    if (emailElement) {
        emailElement.style.cursor = 'pointer';
        emailElement.addEventListener('click', function() {
            window.location.href = 'mailto:kaloudasdev@gmail.com';
        });
    }
    
});

const style = document.createElement('style');
style.textContent = `
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 10, 18, 0.95);
        backdrop-filter: blur(20px);
        padding: 30px;
        box-shadow: var(--shadow);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    
    [data-theme="light"] .nav-links.active {
        background: rgba(255, 255, 255, 0.95);
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
    
    .nav-links a.active {
        color: var(--primary);
    }
    
    .nav-links a::before,
    .nav-links a::after {
        width: var(--underline-width, 0%);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
    
    /* ENSURE NO LOADING SCREEN STYLES */
    .loading-screen {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
    }
`;
document.head.appendChild(style);