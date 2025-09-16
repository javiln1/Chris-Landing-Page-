# UTM Parameter Tracking System

This comprehensive UTM tracking system has been implemented across all HTML files in your project to capture, store, and utilize UTM parameters for analytics and marketing attribution.

## 🚀 What's Been Implemented

### 1. Core UTM Tracking Utility (`utm-tracking.js`)
- **Automatic UTM Parameter Capture**: Captures all standard UTM parameters from URL
- **Persistent Storage**: Stores UTM data in localStorage and sessionStorage
- **Form Integration**: Automatically adds UTM parameters to form submissions
- **Analytics Integration**: Sends data to Google Analytics, Facebook Pixel, and custom endpoints
- **Event Tracking**: Comprehensive event tracking system

### 2. Enhanced Tracking Per Page

#### Main Landing Page (`index.html`)
- Video interaction tracking (play, complete)
- CTA button click tracking
- Form overlay open/close tracking
- Scroll depth tracking (25%, 50%, 75%, 90%)
- Time on page tracking

## 📊 UTM Parameters Captured

### Standard UTM Parameters
- `utm_source` - Traffic source (google, facebook, email, etc.)
- `utm_medium` - Marketing medium (cpc, social, email, etc.)
- `utm_campaign` - Campaign name
- `utm_term` - Paid search keywords
- `utm_content` - Ad content identifier
- `utm_id` - Campaign ID

### Platform-Specific Click IDs
- `gclid` - Google Ads click ID
- `fbclid` - Facebook click ID
- `msclkid` - Microsoft Ads click ID
- `ttclid` - TikTok click ID

### Additional Data
- `landing_page` - First page visited
- `referrer` - Referring website
- `timestamp` - When UTM was first captured

## 🛠️ How to Use

### 1. Testing the System
Open `utm-test.html` in your browser to test the UTM tracking functionality:
```bash
# Open the test page
open utm-test.html
```

### 2. Testing with UTM Parameters
Add UTM parameters to your URLs to test:
```
https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_term=dropshipping&utm_content=ad1
```

### 3. Viewing Captured Data
The system automatically stores UTM data. You can access it via:
```javascript
// Get stored UTM parameters
const utmData = window.utmTracker.getStoredUTMParams();
console.log(utmData);

// Get session UTM parameters
const sessionData = window.utmTracker.getSessionUTMParams();
console.log(sessionData);
```

### 4. Tracking Custom Events
```javascript
// Track custom events with UTM data
window.trackEvent('custom_event', {
    event_property: 'value',
    additional_data: 'more info'
});
```

## 📈 Analytics Integration

### Google Analytics 4
The system automatically sends UTM data to Google Analytics if `gtag` is available:
```javascript
gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    utm_source: 'google',
    utm_medium: 'cpc',
    // ... other UTM parameters
});
```

### Facebook Pixel
UTM data is sent to Facebook Pixel if `fbq` is available:
```javascript
fbq('track', 'PageView', {
    utm_source: 'facebook',
    utm_medium: 'social',
    // ... other UTM parameters
});
```

### Custom Analytics Endpoint
The system attempts to send data to `/api/analytics` (modify this URL in `utm-tracking.js`):
```javascript
fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        event: 'page_view',
        data: utmData,
        timestamp: new Date().toISOString()
    })
});
```

## 🔧 Configuration

### Modifying Analytics Endpoint
Edit the `analyticsEndpoint` variable in `utm-tracking.js`:
```javascript
const analyticsEndpoint = '/your-custom-analytics-endpoint';
```

### Adding Custom UTM Parameters
Modify the `utmKeys` array in `utm-tracking.js`:
```javascript
const utmKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_id',
    'your_custom_param' // Add your custom parameters here
];
```

## 📋 Files Modified

1. **`utm-tracking.js`** - Core tracking utility (NEW)
2. **`index.html`** - Main landing page with enhanced tracking
3. **`utm-test.html`** - Test page for UTM functionality (NEW)
4. **`UTM_TRACKING_README.md`** - This documentation (NEW)

## 🎯 Marketing Use Cases

### Campaign Attribution
Track which campaigns drive the most valuable traffic:
```
?utm_source=google&utm_medium=cpc&utm_campaign=summer_sale&utm_content=ad1
```

### Social Media Tracking
Monitor social media campaign performance:
```
?utm_source=instagram&utm_medium=social&utm_campaign=influencer&utm_content=story
```

### Email Marketing
Track email campaign effectiveness:
```
?utm_source=email&utm_medium=newsletter&utm_campaign=weekly_update&utm_content=header_cta
```

### A/B Testing
Test different ad creatives and landing pages:
```
?utm_source=facebook&utm_medium=cpc&utm_campaign=ab_test&utm_content=variant_a
```

## 🔍 Debugging

### Console Logs
The system logs all UTM activity to the browser console:
```javascript
console.log('UTM parameters captured:', utmParams);
console.log('Event tracked:', eventName, eventPayload);
```

### Browser Storage
Check localStorage and sessionStorage for stored UTM data:
```javascript
// In browser console
localStorage.getItem('utm_params');
sessionStorage.getItem('utm_session');
```

### Test Page
Use `utm-test.html` to verify functionality and view captured data.

## 🚨 Important Notes

1. **Privacy Compliance**: Ensure your UTM tracking complies with GDPR, CCPA, and other privacy regulations
2. **Data Retention**: UTM data is stored in browser storage - consider implementing server-side storage for long-term retention
3. **Analytics Setup**: Configure your Google Analytics and Facebook Pixel accounts to receive the UTM data
4. **Custom Endpoint**: Set up your custom analytics endpoint to receive and process UTM data

## 📞 Support

If you need to modify the UTM tracking system or add additional functionality, the code is well-documented and modular. Key areas to modify:

- `utm-tracking.js` - Core functionality
- Individual HTML files - Page-specific tracking
- Analytics endpoints - Data processing

The system is designed to be easily extensible and customizable for your specific needs.