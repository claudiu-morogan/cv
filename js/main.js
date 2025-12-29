/**
 * Main Application Script
 * 
 * Handles:
 * - Dynamic content rendering from JSON
 * - Theme switching (light/dark)
 * - Scroll animations
 * - Navigation interactions
 * - Language switching UI
 * 
 * Future PHP Migration Notes:
 * - Replace JSON loading with AJAX calls to PHP endpoints
 * - Keep the same rendering functions
 * - Add CSRF tokens for any form submissions
 */

(function() {
    'use strict';
    
    // ===================================
    // STATE MANAGEMENT
    // ===================================
    
    const APP_STATE = {
        isLoaded: false,
        currentTheme: 'light',
        scrollPosition: 0
    };
    
    // ===================================
    // THEME MANAGEMENT
    // ===================================
    
    const ThemeManager = {
        storageKey: 'cv_theme',
        
        initialize() {
            // Get stored theme or use system preference
            const storedTheme = this.getStoredTheme();
            const systemTheme = this.getSystemTheme();
            const initialTheme = storedTheme || systemTheme;
            
            this.setTheme(initialTheme, false);
            this.setupListeners();
        },
        
        getStoredTheme() {
            try {
                return localStorage.getItem(this.storageKey);
            } catch (e) {
                return null;
            }
        },
        
        getSystemTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        },
        
        setTheme(theme, store = true) {
            document.body.setAttribute('data-theme', theme);
            APP_STATE.currentTheme = theme;
            
            if (store) {
                try {
                    localStorage.setItem(this.storageKey, theme);
                } catch (e) {
                    console.warn('localStorage not available');
                }
            }
        },
        
        toggleTheme() {
            const newTheme = APP_STATE.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        },
        
        setupListeners() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }
            
            // Listen for system theme changes
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    if (!this.getStoredTheme()) {
                        this.setTheme(e.matches ? 'dark' : 'light', false);
                    }
                });
            }
        }
    };
    
    // ===================================
    // CONTENT RENDERING
    // ===================================
    
    const ContentRenderer = {
        
        /**
         * Render all sections with current content data
         */
        renderAll(data) {
            if (!data) return;
            
            this.renderSkills(data.skills);
            this.renderExperience(data.experience);
            this.renderProjects(data.projects);
            this.renderEducation(data.education);
            this.renderCertifications(data.certifications);
            this.renderLanguages(data.languages);
        },
        
        /**
         * Render skills grid
         */
        renderSkills(skillsData) {
            if (!skillsData || !skillsData.categories) return;
            
            const container = document.getElementById('skillsGrid');
            if (!container) return;
            
            container.innerHTML = skillsData.categories.map(category => `
                <div class="skill-category scroll-reveal">
                    <h3 class="skill-category-name">${this.escapeHtml(category.name)}</h3>
                    <div class="skill-list">
                        ${category.items.map(item => `
                            <div class="skill-item">${this.escapeHtml(item)}</div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        },
        
        /**
         * Render experience timeline
         */
        renderExperience(experienceData) {
            if (!experienceData || !experienceData.positions) return;
            
            const container = document.getElementById('experienceTimeline');
            if (!container) return;
            
            container.innerHTML = experienceData.positions.map(position => `
                <div class="timeline-item scroll-reveal">
                    <div class="timeline-header">
                        <h3 class="timeline-company">${this.escapeHtml(position.company)}</h3>
                        <div class="timeline-title">${this.escapeHtml(position.title)}</div>
                        <div class="timeline-meta">
                            <span class="timeline-period">${this.escapeHtml(position.period)}</span>
                            <span class="timeline-location">${this.escapeHtml(position.location)}</span>
                        </div>
                    </div>
                    <p class="timeline-description">${this.escapeHtml(position.description)}</p>
                    ${position.achievements ? `
                        <ul class="timeline-achievements">
                            ${position.achievements.map(achievement => `
                                <li>${this.escapeHtml(achievement)}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
        },
        
        /**
         * Render projects grid
         */
        renderProjects(projectsData) {
            if (!projectsData || !projectsData.items) return;
            
            const container = document.getElementById('projectsGrid');
            if (!container) return;
            
            container.innerHTML = projectsData.items.map(project => `
                <div class="project-card scroll-reveal">
                    <h3 class="project-name">${this.escapeHtml(project.name)}</h3>
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                    ${project.technologies ? `
                        <div class="project-technologies">
                            ${project.technologies.map(tech => `
                                <span class="project-tech">${this.escapeHtml(tech)}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    ${project.highlights ? `
                        <ul class="project-highlights">
                            ${project.highlights.map(highlight => `
                                <li>${this.escapeHtml(highlight)}</li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('');
        },
        
        /**
         * Render education list
         */
        renderEducation(educationData) {
            if (!educationData || !educationData.degrees) return;
            
            const container = document.getElementById('educationList');
            if (!container) return;
            
            container.innerHTML = educationData.degrees.map(degree => `
                <div class="education-item scroll-reveal">
                    <h3 class="education-degree">${this.escapeHtml(degree.degree)}</h3>
                    <div class="education-institution">${this.escapeHtml(degree.institution)}</div>
                    <div class="education-period">${this.escapeHtml(degree.period)}</div>
                    ${degree.description ? `
                        <p class="education-description">${this.escapeHtml(degree.description)}</p>
                    ` : ''}
                </div>
            `).join('');
        },
        
        /**
         * Render certifications
         */
        renderCertifications(certificationsData) {
            if (!certificationsData || !certificationsData.items) return;
            
            const container = document.getElementById('certificationsList');
            if (!container) return;
            
            container.innerHTML = certificationsData.items.map(cert => `
                <div class="credential-item scroll-reveal">
                    <div class="credential-name">${this.escapeHtml(cert.name)}</div>
                    ${cert.issuer ? `
                        <div class="credential-issuer">${this.escapeHtml(cert.issuer)}</div>
                    ` : ''}
                    ${cert.description ? `
                        <div class="credential-description">${this.escapeHtml(cert.description)}</div>
                    ` : ''}
                </div>
            `).join('');
        },
        
        /**
         * Render languages
         */
        renderLanguages(languagesData) {
            if (!languagesData || !languagesData.items) return;
            
            const container = document.getElementById('languagesList');
            if (!container) return;
            
            container.innerHTML = languagesData.items.map(lang => `
                <div class="credential-item scroll-reveal">
                    <div class="credential-name">${this.escapeHtml(lang.language)}</div>
                    <div class="credential-level">${this.escapeHtml(lang.level)}</div>
                </div>
            `).join('');
        },
        
        /**
         * Escape HTML to prevent XSS
         */
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };
    
    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    
    const ScrollAnimations = {
        
        initialize() {
            this.setupObserver();
            this.setupNavScroll();
        },
        
        setupObserver() {
            // Intersection Observer for scroll-triggered animations
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            }, options);
            
            // Observe all elements with scroll-reveal class
            const observeElements = () => {
                document.querySelectorAll('.scroll-reveal').forEach(element => {
                    observer.observe(element);
                });
            };
            
            // Initial observation
            observeElements();
            
            // Re-observe after content changes
            window.addEventListener('languageChanged', () => {
                setTimeout(observeElements, 100);
            });
        },
        
        setupNavScroll() {
            // Add scrolled class to nav on scroll
            const nav = document.getElementById('mainNav');
            if (!nav) return;
            
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                
                lastScroll = currentScroll;
            });
        }
    };
    
    // ===================================
    // LANGUAGE SWITCHING UI
    // ===================================
    
    const LanguageUI = {
        
        initialize() {
            const langToggle = document.getElementById('langToggle');
            if (!langToggle) return;
            
            langToggle.addEventListener('click', async () => {
                const currentLang = LanguageManager.getCurrentLanguage();
                const newLang = currentLang === 'en' ? 'ro' : 'en';
                
                try {
                    await LanguageManager.switchLanguage(newLang);
                    this.onLanguageChanged();
                } catch (error) {
                    console.error('Error switching language:', error);
                }
            });
            
            // Listen for language change events
            window.addEventListener('languageChanged', () => {
                this.onLanguageChanged();
            });
        },
        
        onLanguageChanged() {
            // Re-render dynamic content
            const data = LanguageManager.getContentData();
            if (data) {
                ContentRenderer.renderAll(data);
            }
        }
    };
    
    // ===================================
    // UTILITY FUNCTIONS
    // ===================================
    
    function updateFooterYear() {
        const yearElement = document.querySelector('.footer-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 400);
            }, 500);
        }
    }
    
    // ===================================
    // INITIALIZATION
    // ===================================
    
    async function initializeApp() {
        try {
            // Initialize language manager
            LanguageManager.initialize();
            
            // Load content data
            await LanguageManager.loadContentData();
            
            // Update meta tags and text content
            LanguageManager.updateMetaTags();
            LanguageManager.updateTextContent();
            
            // Render dynamic sections
            const data = LanguageManager.getContentData();
            ContentRenderer.renderAll(data);
            
            // Initialize theme
            ThemeManager.initialize();
            
            // Initialize scroll animations
            ScrollAnimations.initialize();
            
            // Initialize language UI
            LanguageUI.initialize();
            
            // Update footer year
            updateFooterYear();
            
            // Hide loading screen
            hideLoadingScreen();
            
            APP_STATE.isLoaded = true;
            
        } catch (error) {
            console.error('Error initializing app:', error);
            hideLoadingScreen();
        }
    }
    
    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        
        e.preventDefault();
        const id = target.getAttribute('href');
        if (id === '#') return;
        
        const element = document.querySelector(id);
        if (element) {
            const navHeight = document.getElementById('mainNav')?.offsetHeight || 0;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navHeight - 20;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
    
})();
