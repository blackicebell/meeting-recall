# Meeting Recall Design Handoff

## Purpose

This document connects the Meeting Recall UI designs to engineering implementation.

The goal is to:
- establish a single source of truth for UI behavior
- reduce ambiguity during development
- maintain visual consistency
- preserve the intended product experience

This document should be used alongside:
- COMPONENT_SYSTEM.md
- UX_RULES.md
- APP_FLOW.md
- TECHNICAL_EXPECTATIONS.md

---

# Design Philosophy

Meeting Recall should feel:
- calm
- premium
- focused
- lightweight
- minimal
- obvious to use

The UI should reduce cognitive load and help users move naturally from:
recording → saving → NotebookLM upload.

---

# Core Design Principles

## Principle 1 — Reduce Thinking

The user should always know:
- what screen they are on
- what action to take next
- where their recording is

Avoid:
- clutter
- visual competition
- unclear hierarchy

---

## Principle 2 — NotebookLM Is the Hero Workflow

“Open NotebookLM” is the primary workflow action.

This action should:
- visually dominate
- feel intentional
- guide the user naturally

Share should remain secondary.

---

## Principle 3 — Typography Leads the Interface

The UI should rely on:
- typography
- spacing
- alignment
- hierarchy

instead of:
- heavy visual effects
- large card systems
- decorative UI

---

# Design File Structure

## Primary Design Sources

/design/screenshots
Contains finalized screen exports.

---

/design/exports
Contains:
- logos
- icons
- app assets
- splash assets

---

/design/references
Contains:
- inspiration references
- visual references
- branding references

---

# MVP Final Screens

The following screens are considered MVP-critical:

- onboarding_01
- onboarding_02
- home
- recording
- save_bottom_sheet
- recording_detail
- notebooklm_helper
- settings

These screens should remain visually stable unless major UX issues are discovered.

---

# Screen Behavior Expectations

# 1. Onboarding

## Goal
Communicate the product clearly in under 10 seconds.

---

## Rules
- Large typography
- Minimal copy
- Strong spacing
- Clean CTA hierarchy

Avoid:
- feature overload
- technical explanations

---

# 2. Home Screen

## Goal
Provide fast access to:
- recording
- meetings
- previous recordings

---

## Rules
- Keep layout breathable
- Recording CTA easy to locate
- Recent recordings scannable
- Use dividers over heavy cards

---

# 3. Recording Screen

## Goal
Create a focused recording experience.

---

## Rules
ONLY show:
- timer
- waveform
- pause
- stop
- recording state

Do NOT show:
- Share
- Rename
- Delete
- NotebookLM actions

The screen should feel calm and distraction-free.

---

# Timer Rules

- Large
- Centered
- Readable
- Font weight around 300
- Never ultra-thin

---

# Waveform Rules

Waveform should:
- animate smoothly
- remain minimal
- avoid excessive visual complexity

---

# 4. Save Bottom Sheet

## Goal
Help user finalize recording quickly.

---

## Rules
- Lightweight
- Minimal text
- Clear save action
- Date-first naming visible

---

# 5. Recording Detail Screen

## Goal
Provide playback and NotebookLM handoff.

---

## Required Elements
- title
- metadata
- waveform scrubber
- playback controls
- Open NotebookLM CTA

---

# CTA Hierarchy

## Primary
Open NotebookLM

---

## Secondary
- Share
- Rename
- Delete

Secondary actions must not visually compete with the primary CTA.

---

# 6. NotebookLM Helper Screen

## Goal
Reduce friction before NotebookLM upload.

---

## Rules
- Extremely short instructions
- Calm tone
- Minimal visual complexity
- Clear next step

---

## Required Instructions
1. Open NotebookLM
2. Tap Add Source
3. Upload your recording

---

# 7. Settings Screen

## Goal
Provide essential configuration only.

---

## Include
- Google Calendar
- Storage location
- Support
- Terms
- Privacy Policy

Avoid:
- advanced settings
- feature toggles
- excessive customization

---

# Layout Rules

## Preferred
- whitespace
- vertical rhythm
- consistent spacing
- clear hierarchy

---

## Avoid
- crowded layouts
- excessive nesting
- dashboard-style density

---

# Card Usage

Cards should be minimal.

Prefer:
- dividers
- spacing
- grouped typography

Avoid:
- stacked heavy cards
- deep shadow systems

---

# Button Rules

# Primary Buttons

Used for:
- Open NotebookLM
- Save Recording

Should:
- visually dominate
- have strong contrast
- maintain large touch targets

---

# Secondary Buttons

Used for:
- Share
- Rename
- optional actions

Should:
- remain visually quieter
- avoid competing with primary CTA

---

# Destructive Actions

Delete should:
- remain subtle until selected
- avoid aggressive visual styling

---

# Color Usage

## Primary Blue
#4b7de6

Used for:
- primary CTA
- active highlights
- selected states

---

## Recording Red
Use ONLY during active recording states.

---

# Gradient Usage

Gradients should be used sparingly.

Allowed:
- primary NotebookLM CTA
- occasional hero emphasis

Avoid:
- multiple gradients per screen
- decorative gradients

---

# Animation Rules

Animations should:
- feel subtle
- support clarity
- improve smoothness

Avoid:
- flashy transitions
- distracting motion
- excessive bounce effects

---

# Responsive Expectations

The UI should:
- scale gracefully across device sizes
- preserve spacing hierarchy
- preserve CTA hierarchy

Important:
- recording controls must remain accessible on smaller devices
- NotebookLM CTA must remain visually dominant

---

# Accessibility Expectations

Ensure:
- readable font sizes
- sufficient contrast
- accessible touch targets
- understandable hierarchy

Avoid:
- tiny tap targets
- low-contrast text
- visually hidden actions

---

# Product Integrity Rule

The UI should reinforce:
- simplicity
- calmness
- trust
- focus

Meeting Recall should never visually evolve into:
- a dashboard
- a productivity suite
- a feature-heavy enterprise app

The interface should always feel intentionally minimal.

---

# Final Design Success Definition

The design succeeds when a non-technical user can:

1. Understand the app immediately
2. Record a meeting confidently
3. Save the file without confusion
4. Open NotebookLM easily
5. Locate the recording quickly
6. Upload successfully
7. Feel calm and in control throughout the experience
