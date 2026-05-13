# Meeting Recall Component System

## Purpose

This document defines the reusable UI component system for Meeting Recall.

The goal is to:
- maintain visual consistency
- reduce UI drift
- simplify development
- create a calm, premium interface
- ensure predictable interaction patterns

The design system should feel:
- minimal
- typography-led
- spacious
- lightweight
- premium
- focused

---

# Core UI Philosophy

Meeting Recall should not feel:
- cluttered
- corporate
- dashboard-heavy
- overly decorative
- visually noisy

The UI should rely primarily on:
- typography
- spacing
- alignment
- hierarchy

not excessive visual effects.

---

# Color System

## Primary Blue
Use for:
- primary CTA
- active states
- important highlights

Color:
#4b7de6

---

## Recording Red
Use only for:
- active recording indicator
- recording states
- recording controls on the Recording screen
- direct trash icon or destructive confirmation when needed

Avoid using red elsewhere unnecessarily.
Blue remains reserved for NotebookLM, main navigation CTAs, and the Home record button.

---

## Background
Primary background:
- pure white or near-white

Avoid:
- dark mode for MVP
- textured backgrounds
- noisy gradients

---

# Icon System

Preferred icon style:
- Microsoft Fluent where available
- Google Material style when Fluent is not available

Icons should feel:
- modern
- familiar
- centered
- easy to recognize

Do not introduce a new icon package immediately before a dev build unless the build is being regenerated for that dependency.

Required icon behavior:
- Settings uses a clear gear icon
- Delete uses a direct Fluent-style trash icon with one confirmation
- Back uses a clear chevron-style icon
- Playback uses clear play/stop or play/pause states
- Home record uses a blue primary button
- Recording screen uses circular red microphone/stop controls
- Icon buttons maintain at least a 44px touch target

Destructive icon direction:
- use Fluent-style outline geometry where possible
- keep stroke weight clean and light
- use a subtle red tint only
- keep the icon visually quieter than Open NotebookLM, playback controls, and recording actions
- never make Delete feel like a primary CTA

---

# Home Recording CTA

The Home record action should feel clear and approachable.

Use:
- blue primary button
- thumb-friendly lower screen placement
- safe bottom spacing

Avoid:
- gradients
- placing the main record action high on the screen
- making Recent Recordings feel secondary to empty space

Recent Recordings should remain visible above the Home record button.

The actual Recording screen should use the red circular microphone/stop control so red is reserved for the live recording moment.

---

# Gradient Usage

Gradients should be used sparingly.

Allowed usage:
- primary NotebookLM CTA
- hero emphasis if needed

Avoid:
- gradient-heavy UI
- multiple gradients on same screen

---

# Typography System

## Typography Philosophy

Typography carries the hierarchy.

Use:
- large readable titles
- strong spacing
- calm rhythm
- clear hierarchy

Avoid:
- crowded labels
- overly small text
- decorative fonts

---

# Suggested Font Direction

Preferred:
- Inter
- SF Pro
- clean sans-serif system fonts

---

# Typography Hierarchy

## Display Title
Use for:
- major screens
- onboarding
- hero moments

Characteristics:
- large
- clean
- lightweight but readable

---

## Section Header
Use for:
- section titles
- grouped content

---

## Body Text
Use for:
- instructions
- helper text
- metadata

Should remain concise and readable.

---

## Metadata
Use for:
- durations
- dates
- timestamps
- file info

Should feel secondary.

---

# Spacing System

## Philosophy

Whitespace is a feature.

The app should feel breathable and calm.

Avoid:
- cramped layouts
- dense rows
- excessive nested containers

---

# Layout Rules

Prefer:
- vertical rhythm
- generous padding
- consistent spacing

Avoid:
- tight component stacking
- excessive nesting

---

# Divider System

Dividers are preferred over heavy cards.

Use dividers for:
- recording lists
- grouped sections
- settings sections

Avoid:
- thick borders
- noisy separators

---

# Button System

# Primary Button

## Purpose
Used for:
- Open NotebookLM
- Save Recording
- major confirmations

---

## Style
- dominant visually
- strong contrast
- larger touch target
- may use subtle gradient

Note:
Open NotebookLM uses blue.
Recording actions use recording red where appropriate.

---

# Secondary Button

## Purpose
Used for:
- Share
- Rename
- optional actions

---

## Style
- visually quieter
- lower emphasis
- should not compete with primary CTA

---

# Destructive Button

## Purpose
Used for:
- Delete

---

## Style
- subtle until selected
- avoid aggressive styling
- use red only for the trash icon or destructive confirmation

---

# Recording Controls

## Philosophy

Recording controls should feel:
- simple
- focused
- reliable
- obvious

---

# Required Controls

- Record
- Pause
- Resume
- Stop

Avoid:
- extra floating controls
- unnecessary overlays
- excessive toolbars

---

# Timer Component

## Rules
- large
- centered
- highly readable
- weight around 300
- not ultra-thin

The timer should feel calm and premium.

---

# Waveform Component

## Purpose
Provide visual recording feedback.

Should:
- animate smoothly
- remain minimal
- avoid excessive visual complexity
- feel alive during active recording
- prefer microphone metering/amplitude input when available
- fall back to believable simulated variance if metering is unavailable
- use vertical bars with center-weighted movement
- keep silence as subtle breathing motion
- respond more visibly during speech without becoming chaotic
- animate with smooth interpolation rather than hard jumps
- stay lightweight enough to avoid hurting recording performance
- use calm neutral color treatment instead of bright gradients or music-visualizer effects

Waveform should support:
- recording state
- playback scrubbing

---

# List Row Component

Used for:
- recordings
- meetings
- settings rows

---

# Recording Row Structure

Should include:
- recording title
- duration
- date/time
- optional helper metadata

Avoid:
- excessive icons
- visual clutter

---

# Recording Detail Screen Rules

This screen is one of the most important in the app.

Must include:
- title
- playback controls
- waveform scrubber
- metadata
- Open NotebookLM CTA
- compact "Ready for NotebookLM" status chip
- exact filename
- save location:
Documents -> Meeting Recall

Core detail actions should fit above the fold on a normal phone screen:
- playback
- Open NotebookLM
- Share
- direct trash-icon Delete access

Reduce vertical height before adding scroll.
Use tighter metadata, shorter waveform space, and minimal helper copy.

Recording title is the hero.
Avoid oversized "Ready" headings that compete with the recording title.

NotebookLM guidance should be a short helper blurb, not a stepper:
When NotebookLM opens, tap Add Source and choose this recording.

Save location should remain predictable for MVP:
Documents -> Meeting Recall

---

# CTA Hierarchy

## Primary CTA
Open NotebookLM

Must visually dominate as the full-width primary action.

---

## Secondary Actions
- Share
- Rename
- Delete

Share must remain visible near the primary CTA.

Delete should not sit in the main action flow.
Use a visible, quiet Fluent-style trash icon in the top-right of Recording Detail when Delete is the only destructive overflow action.
Do not use a More menu unless there are multiple actions inside it.
The trash icon opens the delete confirmation directly.
Destructive styling should remain subtle on the main screen and become explicit only in the confirmation step.

Back controls should use a clear chevron-style icon, sit top-left, and feel native.

Playback controls should use clear play/stop or play/pause icon states, stay visually balanced, and maintain at least a 44px touch target.

---

# Modal / Bottom Sheet Rules

Use bottom sheets for:
- save recording
- rename
- confirmations

Should feel:
- lightweight
- quick
- focused
- compact and visually balanced

Avoid:
- large complex forms
- long paragraphs
- giant empty gaps

Save Recording should:
- reduce vertical whitespace
- group title, filename, location, and duration clearly
- keep Save Recording and Cancel visible without scrolling
- use filename/location affordances instead of explanatory paragraphs

---

# Empty State Rules

Empty states should:
- reduce anxiety
- explain clearly
- remain visually calm

Example:
“Your recordings will appear here.”

---

# Error State Rules

Errors should:
- explain clearly
- avoid technical language
- provide next-step guidance

Good:
“Unable to save recording.”

Bad:
“Unhandled write exception.”

---

# Settings Screen Rules

Settings should remain minimal.

Include:
- Google Calendar
- Storage location
- Support
- Privacy Policy
- Terms

Avoid:
- advanced technical settings
- unnecessary customization

---

# Animation Rules

Animations should:
- feel subtle
- improve clarity
- improve smoothness

Avoid:
- flashy transitions
- excessive motion
- distracting effects

---

# Interaction Philosophy

Every interaction should feel:
- immediate
- predictable
- lightweight

The user should always feel:
- confident
- oriented
- in control

---

# Component Consistency Rule

If a UI pattern already exists:
reuse it.

Avoid creating:
- multiple button styles
- inconsistent list patterns
- different modal behaviors
- conflicting interaction rules

---

# Product Integrity Rule

The UI should reinforce:
- simplicity
- calmness
- focus
- trust

Avoid turning the product into:
- a dashboard
- a productivity suite
- a feature-heavy enterprise tool

Meeting Recall should feel intentionally minimal.
