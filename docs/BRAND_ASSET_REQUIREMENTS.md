# Meeting Recall Brand Asset Requirements

## Purpose

This document defines the app icon and splash screen asset requirements for Meeting Recall.

The goal is to prepare the app for store readiness while keeping the brand clean, premium, and focused.

---

# Visual Direction

Meeting Recall brand assets should feel:
- minimal
- premium
- calm
- recorder-focused
- trustworthy

Use:
- primary blue #4b7de6
- recording red only as a small accent
- clean geometry
- strong small-size readability

Avoid:
- generic AI icons
- chat bubbles
- complex waveforms
- cluttered detail
- dark or noisy backgrounds
- overused gradients

---

# Current Integrated Assets

The project includes the provided Meeting Recall source logo assets and generated PNG exports for Expo configuration.

Source assets:
- /assets/brand/logo-primary.svg
- /assets/brand/logo-mark.svg
- /assets/brand/logo-primary.png
- /assets/brand/logo-mark.png
- /assets/brand/logo-primary-transparent.png

Integrated app assets:
- /assets/icons/app-icon.png
- /assets/icons/adaptive-icon-foreground.png
- /assets/splash/splash.png

Placeholder image files have been removed from the production asset folders.

---

# Branding Usage Rules

Use the provided logo artwork without distortion.

Rules:
- maintain aspect ratio
- avoid effects, filters, or added gradients
- keep in-app logo usage compact
- preserve generous spacing around the mark
- avoid placing the logo inside busy UI regions
- do not use the logo as a decorative pattern

Use the white-background-friendly transparent mark export for in-app branding, app icon, adaptive icon, and splash exports.

On light UI screens, use the logo sparingly and keep typography as the primary hierarchy.

---

# App Icon Requirements

## iOS

Required final source:
- 1024 x 1024 PNG
- no transparency
- no rounded corners baked into the file
- readable at small sizes
- simple silhouette

Recommended file:
- /assets/icons/app-icon.png

Current config points to:
- /assets/icons/app-icon.png

---

# Android Adaptive Icon Requirements

Android adaptive icons need:
- foreground image
- background color or background image

Recommended foreground:
- 1024 x 1024 PNG
- transparent background
- centered mark with safe padding

Recommended file:
- /assets/icons/adaptive-icon-foreground.png

Current config points to:
- /assets/icons/adaptive-icon-foreground.png

Current adaptive background:
- #ffffff

Important:
Keep the mark inside the adaptive icon safe zone so Android launcher masks do not crop it.

---

# Splash Screen Requirements

Recommended splash image:
- centered brand mark
- white or near-white background
- simple and quiet
- readable on small devices

Recommended file:
- /assets/splash/splash.png

Current config points to:
- /assets/splash/splash.png

Current splash background:
- #ffffff

---

# Export Sizes Needed

Final production exports should include:

- 1024 x 1024 app icon PNG
- 1024 x 1024 Android adaptive foreground PNG with transparency
- splash PNG, at least 1242 x 1242 or larger source
- brand mark SVG: /assets/brand/logo-mark.svg
- brand mark PNG
- wordmark / primary logo SVG: /assets/brand/logo-primary.svg
- social preview image

---

# App Config References

Expo config should reference:

- app icon
- Android adaptive icon foreground
- splash image
- splash background color

Current config paths now use the integrated Meeting Recall brand exports.

---

# Still Needed Before Store Submission

- final review of app icon readability on real devices
- final review of Android adaptive icon safe-zone cropping
- final review of splash image scale on real devices
- final PNG exports derived from /assets/brand/logo-primary.svg and /assets/brand/logo-mark.svg
- social preview image
- favicon for website

---

# Success Definition

Brand assets are ready when:
- the app icon is readable at small sizes
- the splash screen feels calm and premium
- Android adaptive icon crops safely
- iOS icon meets App Store requirements
- no placeholder artwork remains in app config
