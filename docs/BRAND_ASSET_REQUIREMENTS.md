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

# Current Placeholder Assets

The project currently includes placeholder assets so Expo has valid app store configuration paths.

These are not final artwork.

Current placeholders:
- /assets/icons/app-icon-placeholder.png
- /assets/icons/adaptive-icon-foreground-placeholder.png
- /assets/splash/splash-placeholder.png
- /assets/brand/brand-mark-placeholder.png

Replace before public submission.

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
- /assets/icons/app-icon-placeholder.png

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
- /assets/icons/adaptive-icon-foreground-placeholder.png

Current adaptive background:
- #ffffff

Important:
Keep the mark inside the adaptive icon safe zone so Android launcher masks do not crop it.

---

# Splash Screen Requirements

Recommended splash image:
- centered brand mark or compact lockup
- transparent or white background
- simple and quiet
- readable on small devices

Recommended file:
- /assets/splash/splash.png

Current config points to:
- /assets/splash/splash-placeholder.png

Current splash background:
- #ffffff

---

# Export Sizes Needed

Final production exports should include:

- 1024 x 1024 app icon PNG
- 1024 x 1024 Android adaptive foreground PNG with transparency
- splash PNG, at least 1242 x 1242 or larger source
- brand mark SVG
- brand mark PNG
- wordmark SVG if used
- social preview image

---

# App Config References

Expo config should reference:

- app icon
- Android adaptive icon foreground
- splash image
- splash background color

Current placeholder paths are valid for development builds but should be renamed/replaced when final artwork is ready.

---

# Still Needed Before Store Submission

- final app icon
- final Android adaptive icon foreground
- final splash screen artwork
- final primary logo / brand mark SVG
- final wordmark if used
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
