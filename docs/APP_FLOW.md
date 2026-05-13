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

The first-run flow has three onboarding screens, then setup.
Onboarding completion is persisted locally.
Returning users go directly to Home.

## Screen 1

### Headline

Record meetings.
Recall everything.

### Subtext

Capture important conversations with a simple recorder built for meetings.

### CTA

Continue

### Secondary CTA

Skip

---

## Screen 2

### Headline

Use NotebookLM for insights

### Subtext

Save your recording, open NotebookLM, and upload the file to get summaries, answers, and action items.

### CTA

Continue

### Secondary CTA

Skip

---

## Screen 3

### Headline

Your recordings stay with you

### Subtext

Files save locally to your Meeting Recall folder, so you can find and upload them when you need them.

### CTA

Continue

### Secondary CTA

Skip

---

## Setup Flow

After onboarding:

1. Show microphone permission explainer
2. Request microphone access
3. If allowed, show folder setup
4. Choose or confirm Meeting Recall folder
5. Persist onboarding completion
6. Go to Home

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

## Explainer Copy

Headline:
Enable microphone access

Subtext:
Meeting Recall needs microphone access to record your meetings.

CTA:
Allow Microphone Access

## Denied Recovery

Display:
Microphone access is off.

Subtext:
Turn it on in Settings to record meetings.

CTA:
Open Settings

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

## Folder Setup Copy

Headline:
Choose where recordings are saved

Subtext:
We recommend Documents - Meeting Recall so your files are easy to find when uploading to NotebookLM.

CTA:
Choose Folder

If a Meeting Recall folder is already stored, show that the folder is ready and allow the user to continue.

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

Recording Detail is the single source of truth after save.
Do not duplicate this screen with a separate Recording Ready screen.

## UI Elements

* Title
* Metadata
* Exact filename
* Folder location
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

Validate file exists and is ready

↓

Open NotebookLM app or browser

---

# NotebookLM Direct Handoff

## Behavior

Open NotebookLM immediately after file validation succeeds.

## Recording Detail Helper Copy

When NotebookLM opens, tap Add Source and choose this file.

---

## UX Goal

Reduce confusion and eliminate searching.

Do not show a confirmation modal for this non-destructive action.
Recording Detail should provide the filename, folder location, and helper guidance before the user taps Open NotebookLM.

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

---

# Recording Entry Modes

Meeting Recall supports two recording entry modes.

## Fast Capture

From Home:

Tap the centered floating red record button

â†“

Open Recording screen

â†“

Start recording immediately

Use this for quick capture when the user wants to record now.

---

## Intentional Meeting Capture

From Todayâ€™s Meetings:

Tap a meeting

â†“

Open Recording screen with meeting context

â†“

User starts recording when ready

Do not auto-start recordings from calendar meeting taps.

Reason:
Users may tap a meeting before it begins and need time to prepare.
