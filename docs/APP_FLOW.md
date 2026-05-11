# Meeting Recall App Flow

## Purpose

This document maps the complete user experience flow for Meeting Recall, including primary flows, alternate flows, edge cases, and behavioral expectations.

The goal is to eliminate ambiguity during development and ensure the app remains simple, intuitive, and focused.

---

# Core Product Flow

The core experience is:

Home → Record → Save → Open NotebookLM → Upload Recording → Get Insights

The app should minimize thinking and make the NotebookLM handoff feel seamless.

---

# Navigation Structure

## Primary Screens

* Splash Screen
* Onboarding
* Permission States
* Home
* Recording
* Save Bottom Sheet
* Recording Detail
* Rename Modal
* NotebookLM Handoff Helper
* Settings

---

# Screen-by-Screen Flow

# 1. Splash Screen

## Purpose

Quick loading state before app initialization.

## Behavior

* Display Meeting Recall logo
* White background
* Minimal animation if desired
* Transition automatically to onboarding or home

## Routes

* First launch → Onboarding
* Returning user → Home

---

# 2. Onboarding Flow

## Screen 1

### Headline

Record meetings.
Recall everything.

### Purpose

Explain the core value of the app.

### CTA

Continue

---

## Screen 2

### Headline

Summaries,
your way.

### Purpose

Explain NotebookLM workflow.

### Key Message

Meeting Recall records meetings.
NotebookLM provides AI insights.

### CTA

Get Started

---

# 3. Permission Flows

# Microphone Permission

## Purpose

Required for recording.

## States

* Allowed
* Denied
* Permanently denied

## UX Rule

Permission language should feel calm and non-technical.

---

# Calendar Permission

## Purpose

Used for smart naming and Today’s Meetings.

## States

* Connected
* Denied
* Disconnected later

---

# Storage/File Permission

## Purpose

Ensure recordings save to accessible device storage.

## States

* Granted
* Denied
* Limited access

---

# 4. Home Screen

## Sections

* Header
* Today’s Meetings
* Record Button
* Recent Recordings

---

## Today’s Meetings

### Behavior

Display calendar events for current day.

### Interaction

Tap meeting → Start recording flow with pre-filled title.

---

## Record Button

### Interaction

Tap → Open Recording Screen

---

## Recent Recordings

### Display

* File title
* Duration
* Date/time

### Interaction

Tap recording → Open Recording Detail

---

# Empty States

# No Meetings Today

Display:
“No meetings today”

---

# No Recordings

Display:
“Your recordings will appear here.”

Subtext:
“Recordings stay on your device and save to your Meeting Recall folder.”

---

# 5. Recording Screen

## Purpose

Focused recording experience.

## UI Elements

* Timer
* Waveform
* Pause button
* Stop button
* Recording indicator

## UX Rules

* No Share
* No Rename
* No Delete
* No NotebookLM actions during recording

Recording state should feel calm and distraction-free.

---

## Recording States

### Active Recording

Timer running.

### Paused

Timer paused.

### Resumed

Continue recording same file.

### Interrupted

Incoming call or app interruption handling.

---

# 6. Stop Recording Flow

## Behavior

User taps Stop.

## Result

Open Save Bottom Sheet.

---

# 7. Save Bottom Sheet

## Purpose

Finalize recording before entering detail screen.

## Fields

* Recording title
* Duration
* File size

## Default Naming

YYYY-MM-DD – Meeting Name

## Buttons

* Save Recording
* Discard

---

## UX Rule

User should understand that recordings save locally to the Meeting Recall folder.

---

# 8. Recording Detail Screen

## Purpose

Main interaction screen after recording.

## UI Elements

* Title
* Metadata
* Playback controls
* Waveform scrubber
* Rewind/forward buttons

---

# Primary CTA

## Open NotebookLM

This is the hero action.

Purpose:
Guide user toward AI insights workflow.

---

# Secondary Actions

* Share
* Rename
* Delete

These should feel visually secondary.

---

# 9. Open NotebookLM Flow

## Purpose

Prepare user for upload process.

---

## Flow

User taps:
Open NotebookLM

↓

Show helper/interstitial screen

↓

Open NotebookLM app or browser

---

# NotebookLM Helper Screen

## Headline

Your recording is ready

## Instructions

1. Open NotebookLM
2. Tap Add Source
3. Upload your recording

---

## UX Goal

Reduce confusion and eliminate searching.

---

# 10. Old Recording Flow

## Purpose

Old recordings should feel just as easy to use as new recordings.

---

## Flow

Home

↓

Select old recording

↓

Recording Detail

↓

Open NotebookLM

↓

Upload recording

---

## Critical Requirement

The app should never imply NotebookLM export is only available immediately after recording.

---

# 11. Rename Flow

## Behavior

User renames recording.

## Critical Requirement

The actual device file name must also update.

---

## UX Copy

“This updates the file name on your device so it’s easier to find later.”

---

# 12. File System Behavior

## Requirements

* Recordings save locally
* Recordings save inside “Meeting Recall” folder
* Files visible to device file picker
* Files should appear in Recents after export prep

---

# 13. Error States

# Recording Failure

Display:
“Recording failed. Please try again.”

---

# Save Failure

Display:
“Unable to save recording.”

---

# Missing File

Display:
“Recording file could not be found.”

---

# Calendar Failure

Display:
“Unable to load calendar events.”

---

# NotebookLM Open Failure

Display:
“Unable to open NotebookLM.”

Fallback:
Open browser version if possible.

---

# 14. Settings Screen

## Sections

* Google Calendar connection
* Storage location
* Privacy
* Support
* Terms
* Privacy Policy

---

## Storage Display

Show:
Meeting Recall folder

Subtext:
“Recordings are stored locally on your device.”

---

# 15. UX Principles

## Principle 1

Reduce user thinking.

---

## Principle 2

NotebookLM is the main workflow.

---

## Principle 3

File visibility is critical UX.

---

## Principle 4

Recording experience should feel focused and calm.

---

## Principle 5

Typography and spacing should carry the visual hierarchy.

---

# Success Definition

The product succeeds when a non-technical user can:

1. Record a meeting
2. Save it
3. Open NotebookLM
4. Immediately find the recording
5. Upload it without confusion
6. Get insights with minimal friction
