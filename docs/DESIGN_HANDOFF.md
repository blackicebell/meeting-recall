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
- Use a blue primary record button near the lower screen area
- Keep the record CTA thumb-friendly and clear
- Recent recordings scannable
- Use dividers over heavy cards
- Keep Recent Recordings visible above the floating record CTA
- Do not use gradients on the record CTA
- Reserve the red circular microphone/stop control for the actual Recording screen
- Show Today’s Meetings as a production section, not a debug/testing surface
- Meeting rows should use strong titles with quiet time metadata
- Do not show Calendar Fetch Debug or Google Sign-In diagnostic UI in the production Home screen

## Production Structure
- app header
- settings icon
- Today’s Meetings
- Recent Recordings
- lower thumb-friendly Record meeting CTA

## Calendar Behavior
- If meetings load, show meeting title and time
- If no meetings exist, show:
No meetings today.
- If calendar loading fails, show:
Unable to load calendar events.
- Tapping a meeting starts the recording flow with that meeting title as the suggested save title

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
- feel alive during active recording
- use microphone metering/amplitude input when available
- fall back to subtle simulated variance if true amplitude is unavailable
- use center-weighted vertical bars
- show soft breathing motion during silence
- move more during speech without feeling chaotic
- avoid perfect loops, equal bar movement, bright gradients, or music visualizer styling
- prioritize smooth interpolation and mobile performance

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
- Avoid explanatory paragraphs
- Use filename and location affordances instead:
  - final filename preview
  - "Saves to Meeting Recall folder"
- Reduce excessive vertical whitespace
- Keep the layout compact, calm, and visually balanced
- Group title, filename, location, duration, and actions clearly
- Keep Save Recording and Cancel visible without scrolling

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
- Share action
- direct trash-icon Delete access
- compact "Ready for NotebookLM" status chip
- exact filename
- Documents -> Meeting Recall location

These core actions should fit above the fold on a normal phone screen.

If space is tight:
- reduce helper copy first
- shorten metadata blocks
- reduce waveform height
- keep primary and secondary actions visible

Recording title should be the hero.
Avoid large redundant status headers such as:
- Ready
- Your recording is ready

NotebookLM guidance should be one short helper line on Recording Detail, not a numbered stepper.

Use:
When NotebookLM opens, tap Add Source and choose this file.

The Open NotebookLM button should open NotebookLM immediately after file validation passes.
Do not show a confirmation bottom sheet or compact modal in the normal flow.
Do not duplicate Recording Detail as a separate full-screen Recording Ready or NotebookLM helper screen.

Save location should stay fixed and predictable for MVP:
Documents -> Meeting Recall

---

# CTA Hierarchy

## Primary
Open NotebookLM

This should remain the dominant full-width CTA.

---

## Secondary
- Share
- Rename
- Delete

Share must remain visible near Open NotebookLM.

Delete should use a visible, quiet Fluent-style trash icon when it is the only overflow-style action.
Do not show a More menu unless there are multiple actions inside it.
The trash icon should open delete confirmation directly.
Destructive visual treatment should remain subtle until confirmation.
The delete icon should use clean outline geometry, a subtle red tint, and a comfortable touch target.
It should feel intentional without competing with Open NotebookLM, playback, or recording actions.

Back should use a clear chevron-style icon in the top-left and feel native.

Playback controls should use clear play/stop or play/pause icon states, stay centered, and maintain at least 44px touch targets.

---

# 6. NotebookLM Direct Handoff

## Goal
Reduce friction before NotebookLM upload.

---

## Rules
- One short helper line on Recording Detail
- Calm tone
- Minimal visual complexity
- Clear next step
- Open NotebookLM directly after file validation
- No confirmation modal for the normal flow
- Modals or alerts are reserved for errors and fallback states
- Avoid repeated workflow explanation

---

## Required Helper Copy
When NotebookLM opens, tap Add Source and choose this file.

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

Allowed recording-red uses:
- active recording indicator
- active recording controls
- floating Home record CTA
- circular red microphone/stop controls on the Recording screen
- destructive icon/confirmation when needed

Do not use red for general navigation, the Home record CTA, or NotebookLM actions.
Blue remains reserved for NotebookLM, main navigation CTAs, and the Home record button.

---

# Icon Direction

Preferred icon style:
- Microsoft Fluent where available
- Google Material style when Fluent is not available

Use recognizable icons for:
- Settings gear
- Fluent-style trash/delete
- back chevron
- play/stop or play/pause

Icons should be centered, balanced, and at least 44px touch targets.
Destructive icons should stay calm and visually lighter than primary CTAs.

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

---

# Home Screen Production Hierarchy

Home should feel calm, scannable, and recording-first.

Primary structure:
- header
- Today's Meetings
- Recent Recordings
- floating Record CTA

Today's Meetings rows should be lightweight:
- strong meeting title
- quiet time metadata
- subtle divider rhythm
- optional small provider indicator only if it does not add clutter

Recent Recordings rows should prioritize:
- recording title
- date/time metadata
- exact filename as subtle secondary text
- quiet duration on the trailing edge

The floating Record CTA should be centered near the bottom, thumb-friendly, circular, red, and emotionally clear without using gradients.

It should use the same shared recording CTA as the Recording screen:
- same diameter
- same icon size
- same red tone
- same shadow/elevation
- same press feedback

Home placement should be true screen center, not offset by content padding.

Home header alignment should feel precise:
- title and settings icon should align visually
- settings should feel attached to the header, not floating independently
- supporting copy should remain quiet

Recording entry behavior:
- floating Record CTA starts recording immediately
- Todayâ€™s Meetings rows open Recording with meeting context but do not auto-start
- calendar context should appear as quiet copy near the top of Recording
