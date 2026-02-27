# Specification

## Summary
**Goal:** Optimize the PHC Nepal Health app as a PWA for Android Google Play Store packaging via PWABuilder/Bubblewrap.

**Planned changes:**
- Create `manifest.json` in `frontend/public` with app name, short name, description, standalone display mode, earthy green/saffron theme/background colors, and a full icon set (72x72 through 512x512)
- Add a `sw.js` service worker in `frontend/public` implementing cache-first for static assets and network-first for API calls, registered on app load
- Add all required PWA meta tags to `index.html` (theme-color, Apple PWA tags, viewport, manifest link)
- Place PWA icon files in `frontend/public/icons` at all sizes referenced in the manifest
- Add a dismissible "Add to Home Screen" install prompt banner on the dashboard/login page that detects `beforeinstallprompt`, respects the active language, and does not appear when already installed in standalone mode

**User-visible outcome:** The app can be installed as a standalone PWA on Android, works offline for previously visited pages, and can be packaged for the Google Play Store using PWABuilder or Bubblewrap.
