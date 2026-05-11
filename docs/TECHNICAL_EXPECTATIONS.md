# Meeting Recall Technical Expectations

## Purpose

This document defines the expected technical behavior of Meeting Recall.

The goal is to:
- reduce implementation ambiguity
- align engineering decisions with product goals
- ensure consistency across platforms
- preserve the intended user experience

This document defines behavior expectations, not strict implementation details.

---

# Core Technical Philosophy

Meeting Recall should feel:
- lightweight
- stable
- local-first
- predictable
- fast

The app should avoid:
- unnecessary backend systems
- unnecessary cloud dependencies
- over-engineered architecture
- unnecessary AI processing

---

# Platform Targets

## Primary Platforms
- iOS
- Android

---

# Primary Technical Priorities

Priority order:

1. Recording reliability
2. File accessibility
3. UX clarity
4. Stability
5. Performance
6. Visual polish

---

# Audio Recording Expectations

## Core Requirement

Users must be able to reliably record meetings without worrying about:
- losing recordings
- corrupted files
- interrupted sessions
- confusing save behavior

---

# Recording Requirements

## Required Behaviors
- Fast recording start
- Stable long-form recording
- Pause/resume support
- Accurate timer updates
- Stable waveform rendering
- Playback support
- Scrubbing support

---

# Recording Persistence

Recording sessions should survive:
- app minimization
- temporary backgrounding
- short interruptions if platform allows

---

# Interruption Handling

Expected interruption scenarios:
- incoming phone calls
- audio interruptions
- app backgrounding
- headphones disconnecting

The app should fail gracefully and preserve recordings whenever possible.

---

# File Storage Expectations

## Core Philosophy

Files are part of the product experience.

Users should feel confident that recordings:
- exist
- are accessible
- are easy to find
- are not trapped inside the app

---

# Local Storage Rules

Recordings must:
- save locally
- persist after app restart
- remain accessible outside the app
- save to visible Meeting Recall folder

---

# Folder Expectations

Preferred folder naming:

Meeting Recall

Examples:
- iOS Files app
- Android Documents/Files

---

# File Naming Rules

All recordings should follow:

YYYY-MM-DD – Meeting Name.m4a

Examples:
2026-04-29 – Meeting Yoshi.m4a
2026-04-29 – Client Strategy Call.m4a

---

# File Naming Goals

File names should:
- sort naturally
- remain human-readable
- be recognizable in file pickers
- reduce upload confusion

---

# Rename Expectations

Renaming inside the app must:
- update UI state
- update actual device file name
- persist after app restart

This behavior is critical because NotebookLM upload uses the system file picker.

---

# File Accessibility Expectations

Users should be able to:
- locate recordings from device file browser
- share recordings externally
- upload recordings into NotebookLM easily

---

# “Recent Files” Optimization

When possible:
- prepared/exported recordings should appear near top of Recents
- file timestamps should support discoverability

This improves NotebookLM upload flow.

---

# NotebookLM Workflow Expectations

## Core Philosophy

Meeting Recall does not integrate directly with NotebookLM APIs.

The app should:
- prepare recordings cleanly
- guide users clearly
- reduce upload friction

---

# Open NotebookLM Behavior

When user taps:
Open NotebookLM

Expected behavior:
1. Ensure recording exists
2. Ensure recording accessible
3. Prepare file visibility if necessary
4. Open helper/interstitial
5. Open NotebookLM app or browser

---

# Browser Fallback

If NotebookLM app unavailable:
- fallback to browser version if possible
- communicate clearly to user

---

# Share Behavior

Share should:
- remain secondary to Open NotebookLM
- use native platform share sheets
- preserve clean file naming

---

# Google Calendar Expectations

## Core Purpose

Calendar integration exists to:
- reduce manual naming
- help organize meetings
- simplify recording workflows

---

# Required Behaviors

- Google authentication support
- Calendar permission handling
- Fetch current-day meetings
- Pre-fill recording names
- Handle disconnected states gracefully

---

# Offline Expectations

The app should remain functional offline for:
- recording
- playback
- file access

Calendar syncing may require internet.

NotebookLM usage may require internet.

---

# Performance Expectations

The app should feel:
- responsive
- lightweight
- stable

---

# Performance Goals

- Fast app launch
- Fast recording start
- Smooth scrolling
- Responsive playback
- Stable long recordings

Avoid:
- frame drops
- heavy memory usage
- unnecessary animations

---

# UI Expectations

The UI should:
- prioritize clarity
- prioritize typography
- avoid clutter
- feel calm

---

# Visual Rules

Prefer:
- dividers
- spacing
- clean hierarchy

Avoid:
- heavy cards
- excessive shadows
- dashboard complexity

---

# Error Handling Expectations

Errors should:
- explain clearly
- reduce panic
- provide next-step guidance
- avoid technical jargon

---

# Important Error States

Handle gracefully:
- failed recording
- failed save
- missing files
- failed playback
- calendar loading failure
- NotebookLM open failure
- permission denial

---

# Permission Expectations

## Required Permissions
- microphone
- calendar (optional)
- file/storage access if needed

Permission messaging should:
- feel calm
- explain user benefit
- avoid technical language

---

# Architecture Expectations

Prefer:
- maintainable code
- modular UI components
- predictable state management
- reusable systems

Avoid:
- unnecessary abstraction
- unnecessary dependencies
- over-engineering

---

# Product Integrity Rule

Do not implement features that shift Meeting Recall into:
- AI meeting assistant
- transcription platform
- collaboration suite
- productivity dashboard

The product should remain intentionally focused.

---

# Technical Success Definition

The product succeeds technically when a non-technical user can:

1. Record a meeting
2. Save it safely
3. Find the file later
4. Open NotebookLM
5. Upload without confusion
6. Get insights quickly

without technical knowledge or troubleshooting.
