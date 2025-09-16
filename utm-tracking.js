/**
 * UTM Parameter Tracking Utility
 * Captures and stores UTM parameters for analytics and form submissions
 */

class UTMTracker {
    constructor() {
        this.utmParams = {};
        this.storageKey = 'utm_params';
        this.sessionKey = 'utm_session';
        this.init();
    }

    init() {
        this.captureUTMParams();
        this.storeUTMParams();
        this.attachToForms();
        this.trackPageView();
    }

    /**
     * Capture UTM parameters from URL
     */
    captureUTMParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmKeys = [
            'utm_source',
            'utm_medium', 
            'utm_campaign',
            'utm_term',
            'utm_content',
            'utm_id',
            'gclid', // Google Ads click ID
            'fbclid', // Facebook click ID
            'msclkid', // Microsoft Ads click ID
            'ttclid' // TikTok click ID
        ];

        utmKeys.forEach(key => {
            const value = urlParams.get(key);
            if (value) {
                this.utmParams[key] = value;
            }
        });

        // Also capture referrer and landing page
        this.utmParams.landing_page = window.location.href.split('?')[0];
        this.utmParams.referrer = document.referrer || 'direct';
        this.utmParams.timestamp = new Date().toISOString();
    }

    /**
     * Store UTM parameters in localStorage and sessionStorage
     */
    storeUTMParams() {
        if (Object.keys(this.utmParams).length > 0) {
            // Store in localStorage (persists across sessions)
            localStorage.setItem(this.storageKey, JSON.stringify(this.utmParams));
            
            // Store in sessionStorage (persists for session only)
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.utmParams));
            
            console.log('UTM parameters captured:', this.utmParams);
        }
    }

    /**
     * Get stored UTM parameters
     */
    getStoredUTMParams() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error retrieving UTM parameters:', e);
            return {};
        }
    }

    /**
     * Get session UTM parameters
     */
    getSessionUTMParams() {
        try {
            const stored = sessionStorage.getItem(this.sessionKey);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('Error retrieving session UTM parameters:', e);
            return {};
        }
    }

    /**
     * Attach UTM parameters to forms
     */
    attachToForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                this.addUTMToForm(form);
            });
        });

        // Also handle dynamically created forms
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'FORM') {
                            node.addEventListener('submit', (e) => {
                                this.addUTMToForm(node);
                            });
                        }
                        // Check for forms within added nodes
                        const forms = node.querySelectorAll && node.querySelectorAll('form');
                        if (forms) {
                            forms.forEach(form => {
                                form.addEventListener('submit', (e) => {
                                    this.addUTMToForm(form);
                                });
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Add UTM parameters to form data
     */
    addUTMToForm(form) {
        const utmParams = this.getStoredUTMParams();
        
        Object.keys(utmParams).forEach(key => {
            // Check if field already exists
            let existingField = form.querySelector(`input[name="${key}"]`);
            
            if (!existingField) {
                // Create hidden input field
                const hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = key;
                hiddenField.value = utmParams[key];
                form.appendChild(hiddenField);
            } else {
                // Update existing field value
                existingField.value = utmParams[key];
            }
        });
    }

    /**
     * Track page view with UTM parameters
     */
    trackPageView() {
        const utmParams = this.getStoredUTMParams();
        
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                ...utmParams
            });
        }

        // Send to Facebook Pixel if available
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView', utmParams);
        }

        // Custom analytics endpoint (you can modify this)
        this.sendToAnalytics('page_view', utmParams);
    }

    /**
     * Send UTM data to custom analytics endpoint
     */
    sendToAnalytics(event, data) {
        // Replace with your analytics endpoint
        const analyticsEndpoint = '/api/analytics'; // Modify this URL
        
        fetch(analyticsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event: event,
                data: data,
                timestamp: new Date().toISOString(),
                user_agent: navigator.userAgent,
                page_url: window.location.href
            })
        }).catch(error => {
            console.log('Analytics endpoint not available:', error);
        });
    }

    /**
     * Track custom events with UTM parameters
     */
    trackEvent(eventName, eventData = {}) {
        const utmParams = this.getStoredUTMParams();
        const eventPayload = {
            ...utmParams,
            ...eventData,
            event_name: eventName,
            timestamp: new Date().toISOString()
        };

        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventPayload);
        }

        // Send to Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventPayload);
        }

        // Send to custom analytics
        this.sendToAnalytics(eventName, eventPayload);

        console.log('Event tracked:', eventName, eventPayload);
    }

    /**
     * Get UTM parameters as URL string
     */
    getUTMAsURLString() {
        const utmParams = this.getStoredUTMParams();
        const params = new URLSearchParams();
        
        Object.keys(utmParams).forEach(key => {
            if (key.startsWith('utm_') || key === 'gclid' || key === 'fbclid' || key === 'msclkid' || key === 'ttclid') {
                params.append(key, utmParams[key]);
            }
        });

        return params.toString();
    }

    /**
     * Clear stored UTM parameters
     */
    clearUTMParams() {
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.sessionKey);
        console.log('UTM parameters cleared');
    }
}

// Initialize UTM tracking when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.utmTracker = new UTMTracker();
    
    // Make it globally available
    window.trackEvent = function(eventName, eventData) {
        if (window.utmTracker) {
            window.utmTracker.trackEvent(eventName, eventData);
        }
    };
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UTMTracker;
}