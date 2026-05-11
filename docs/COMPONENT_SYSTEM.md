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

Avoid using red elsewhere unnecessarily.

---

## Background
Primary background:
- pure white or near-white

Avoid:
- dark mode for MVP
- textured backgrounds
- noisy gradients

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

---

# CTA Hierarchy

## Primary CTA
Open NotebookLM

Must visually dominate.

---

## Secondary Actions
- Share
- Rename
- Delete

These should remain visually secondary.

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

Avoid:
- large complex forms
- long paragraphs

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
