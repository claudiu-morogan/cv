/**
 * Language Switching Module
 * 
 * Handles bilingual functionality (EN/RO) with:
 * - Automatic browser language detection
 * - localStorage persistence
 * - Dynamic UI updates
 * 
 * Future PHP Migration Notes:
 * - Replace localStorage with PHP sessions
 * - Add server-side language detection
 * - Keep the same UI update logic
 */

const LanguageManager = (function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        defaultLang: 'en',
        availableLangs: ['en', 'ro'],
        storageKey: 'cv_language',
        dataPath: 'data/'
    };
    
    // Static translations (not in JSON files)
    const STATIC_TRANSLATIONS = {
        en: {
            'cta.contact': 'Get in Touch',
            'cta.experience': 'View Experience',
            'section.contact': 'Contact',
            'footer.copyright': '© Claudiu Morogan',
            'footer.note': 'Built with care. No frameworks, just clean code.'
        },
        ro: {
            'cta.contact': 'Contactează-mă',
            'cta.experience': 'Vezi Experiența',
            'section.contact': 'Contact',
            'footer.copyright': '© Claudiu Morogan',
            'footer.note': 'Construit cu atenție. Fără framework-uri, doar cod curat.'
        }
    };
    
    let currentLang = CONFIG.defaultLang;
    let contentData = null;
    
    /**
     * Detect browser language
     * @returns {string} Language code (en or ro)
     */
    function detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.toLowerCase().split('-')[0];
        
        // Check if detected language is available
        if (CONFIG.availableLangs.includes(langCode)) {
            return langCode;
        }
        
        return CONFIG.defaultLang;
    }
    
    /**
     * Get stored language from localStorage
     * @returns {string|null} Stored language code or null
     */
    function getStoredLanguage() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            if (stored && CONFIG.availableLangs.includes(stored)) {
                return stored;
            }
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
        return null;
    }
    
    /**
     * Store language preference in localStorage
     * @param {string} lang - Language code to store
     */
    function storeLanguage(lang) {
        try {
            localStorage.setItem(CONFIG.storageKey, lang);
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
    }
    
    /**
     * Initialize language on page load
     * Priority: localStorage > browser detection > default
     */
    function initialize() {
        // Check localStorage first
        const storedLang = getStoredLanguage();
        if (storedLang) {
            currentLang = storedLang;
        } else {
            // Detect browser language
            currentLang = detectBrowserLanguage();
            storeLanguage(currentLang);
        }
        
        // Set initial language on body
        document.body.setAttribute('data-lang', currentLang);
        
        // Update page language attribute
        document.documentElement.lang = currentLang === 'ro' ? 'ro' : 'en';
    }
    
    /**
     * Load content data for current language
     * @returns {Promise<Object>} Content data
     */
    async function loadContentData() {
        try {
            const response = await fetch(`${CONFIG.dataPath}content-${currentLang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load content: ${response.status}`);
            }
            contentData = await response.json();
            return contentData;
        } catch (error) {
            console.error('Error loading content:', error);
            // Fallback to default language if current fails
            if (currentLang !== CONFIG.defaultLang) {
                currentLang = CONFIG.defaultLang;
                return loadContentData();
            }
            throw error;
        }
    }
    
    /**
     * Update page meta tags with current language content
     */
    function updateMetaTags() {
        if (!contentData || !contentData.meta) return;
        
        const meta = contentData.meta;
        
        // Update title
        document.title = meta.title || 'Claudiu Morogan';
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && meta.description) {
            metaDesc.setAttribute('content', meta.description);
        }
        
        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && meta.keywords) {
            metaKeywords.setAttribute('content', meta.keywords);
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && meta.title) {
            ogTitle.setAttribute('content', meta.title);
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && meta.description) {
            ogDesc.setAttribute('content', meta.description);
        }
    }
    
    /**
     * Update text content using data-key attributes
     */
    function updateTextContent() {
        if (!contentData) return;
        
        // Update all elements with data-key attribute
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-key');
            const value = getNestedValue(contentData, key);
            if (value) {
                element.textContent = value;
            }
        });
        
        // Update static translations
        const translationElements = document.querySelectorAll('[data-translate]');
        translationElements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = STATIC_TRANSLATIONS[currentLang][key];
            if (translation) {
                element.textContent = translation;
            }
        });
    }
    
    /**
     * Get nested object value using dot notation
     * @param {Object} obj - Object to search
     * @param {string} path - Dot notation path (e.g., 'hero.name')
     * @returns {*} Value at path or undefined
     */
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, prop) => 
            current ? current[prop] : undefined, obj);
    }
    
    /**
     * Switch to a different language
     * @param {string} newLang - Language code to switch to
     * @returns {Promise<void>}
     */
    async function switchLanguage(newLang) {
        if (!CONFIG.availableLangs.includes(newLang) || newLang === currentLang) {
            return;
        }
        
        currentLang = newLang;
        storeLanguage(currentLang);
        
        // Update body attribute
        document.body.setAttribute('data-lang', currentLang);
        document.documentElement.lang = currentLang === 'ro' ? 'ro' : 'en';
        
        // Reload content and update UI
        await loadContentData();
        updateMetaTags();
        updateTextContent();
        
        // Trigger custom event for other modules to respond
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: currentLang } 
        }));
    }
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    function getCurrentLanguage() {
        return currentLang;
    }
    
    /**
     * Get current content data
     * @returns {Object|null} Content data
     */
    function getContentData() {
        return contentData;
    }
    
    // Public API
    return {
        initialize,
        loadContentData,
        switchLanguage,
        getCurrentLanguage,
        getContentData,
        updateMetaTags,
        updateTextContent
    };
    
})();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.LanguageManager = LanguageManager;
}
