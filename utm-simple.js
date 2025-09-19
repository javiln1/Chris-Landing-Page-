// Simple UTM Capture & Persistence Utility (Based on Ason's working approach)
// Framework-agnostic, minimal, and safe
(function () {
  const KEY = "utm_params";
  
  function getUTMsFromURL() {
    const p = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_id","gclid","fbclid","msclkid","ttclid"];
    const out = {};
    let found = false;
    keys.forEach(k => {
      const v = p.get(k);
      if (v) { out[k] = v; found = true; }
    });
    
    // Also capture referrer and landing page
    if (found) {
      out.landing_page = window.location.href.split('?')[0];
      out.referrer = document.referrer || 'direct';
      out.timestamp = new Date().toISOString();
    }
    
    return found ? out : null;
  }
  
  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  }
  
  function write(obj) {
    if (!obj) return;
    const current = read();
    const merged = { ...current, ...obj };
    localStorage.setItem(KEY, JSON.stringify(merged));
  }
  
  // 1) Capture on first hit
  const fromURL = getUTMsFromURL();
  if (fromURL) {
    write({ ...fromURL, first_touch: Date.now() });
    console.info("[UTM] Captured from URL:", fromURL);
  } else {
    console.info("[UTM] No UTMs in URL; using stored:", read());
  }

  // 2) Populate hidden inputs on DOM ready
  function populateHiddenInputs(root=document) {
    const data = read();
    const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_id","gclid","fbclid","msclkid","ttclid","landing_page","referrer"];
    keys.forEach(k => {
      const inputs = root.querySelectorAll(`input[name="${k}"]`);
      inputs.forEach(inp => { if (data[k]) inp.value = data[k]; });
    });
    console.info("[UTM] Populated hidden inputs:", data);
  }

  // 3) Append UTMs to iframe src (Typeform/others) - Ason's approach
  function appendUTMsToIframes(root=document) {
    const data = read();
    const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_id","gclid","fbclid","msclkid","ttclid"];
    const q = keys.filter(k => data[k]).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join("&");
    if (!q) return;
    
    root.querySelectorAll("iframe[src]").forEach(ifr => {
      const src = new URL(ifr.src, window.location.origin);
      // Only append if not already present
      let changed = false;
      keys.forEach(k => {
        if (data[k] && !src.searchParams.get(k)) {
          src.searchParams.set(k, data[k]);
          changed = true;
        }
      });
      if (changed) {
        ifr.src = src.toString();
        console.info("[UTM] Appended to iframe:", ifr, ifr.src);
      }
    });
  }

  // 4) Track events with UTM data
  function trackEvent(eventName, eventData = {}) {
    const utmData = read();
    const eventPayload = {
      ...utmData,
      ...eventData,
      event_name: eventName,
      timestamp: new Date().toISOString()
    };

    // Send to Google Analytics if available
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventPayload);
    }

    // Send to Facebook Pixel if available
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, eventPayload);
    }

    console.log('Event tracked:', eventName, eventPayload);
  }

  // Expose API
  window.__UTM__ = { 
    read, 
    populateHiddenInputs, 
    appendUTMsToIframes, 
    trackEvent 
  };
  
  // Make it compatible with our existing system
  window.utmTracker = {
    getStoredUTMParams: read,
    getUTMAsURLString: function() {
      const data = read();
      const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","utm_id","gclid","fbclid","msclkid","ttclid"];
      return keys.filter(k => data[k]).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join("&");
    },
    trackEvent: trackEvent
  };
  
  // Auto-run on DOM ready
  document.addEventListener("DOMContentLoaded", function() {
    window.__UTM__.populateHiddenInputs();
    window.__UTM__.appendUTMsToIframes();
    
    // Re-run iframe updates when new iframes are added
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          window.__UTM__.appendUTMsToIframes();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
})();
