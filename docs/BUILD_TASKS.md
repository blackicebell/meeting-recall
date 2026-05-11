# Meeting Recall Build Tasks

## Purpose
This document breaks the Meeting Recall implementation into small, focused build tasks.

Codex and developers should work through these tasks in order.

Do not skip ahead.
Do not combine large phases.
Do not add future features unless explicitly requested.

---

# Task 1 — Project Audit

## Goal
Understand the current project state.

## Instructions
Review the project structure, package files, existing screens, components, and docs.

Do not change code yet.

## Output
Create a short summary of:
- current tech stack
- current folder structure
- existing screens
- existing components
- missing pieces
- risks

---

# Task 2 — App Shell

## Goal
Create or clean up the base app structure.

## Requirements
- navigation works
- main screens exist
- folder structure is clean
- app can run locally
- no broken imports

## Screens
- Onboarding
- Home
- Recording
- Save Sheet
- Recording Detail
- NotebookLM Helper
- Settings

---

# Task 3 — Theme System

## Goal
Create shared visual tokens.

## Requirements
- primary blue: #4b7de6
- recording red
- typography scale
- spacing scale
- button styles
- divider styles

## Rule
UI should follow COMPONENT_SYSTEM.md.

---

# Task 4 — Core Components

## Goal
Build reusable UI components.

## Components
- PrimaryButton
- SecondaryButton
- IconButton
- RecordingRow
- MeetingRow
- Waveform
- Timer
- BottomSheet
- EmptyState
- SettingsRow

---

# Task 5 — Home Screen

## Goal
Build the main hub.

## Requirements
- Today’s Meetings section
- Record CTA
- Recent Recordings
- Empty states
- Settings access

## Data
Use mock data first if real systems are not ready.

---

# Task 6 — Recording Screen UI

## Goal
Build focused recording interface.

## Requirements
- large timer
- waveform
- pause button
- stop button
- recording indicator

## Rule
No Share, Rename, Delete, or NotebookLM actions during recording.

---

# Task 7 — Recording Engine

## Goal
Implement real recording behavior.

## Requirements
- start recording
- pause recording
- resume recording
- stop recording
- create .m4a file if platform supports
- handle permission states

---

# Task 8 — Save Bottom Sheet

## Goal
Finalize recording after stop.

## Requirements
- editable title
- date-first default naming
- duration
- file size if available
- Save Recording CTA
- Discard action

---

# Task 9 — Local File Storage

## Goal
Make recordings accessible and persistent.

## Requirements
- save to visible Meeting Recall folder where platform allows
- persist recordings after restart
- expose files to system picker where possible
- preserve clean filename

## Naming Format
YYYY-MM-DD – Meeting Name.m4a

---

# Task 10 — Recording Detail Screen

## Goal
Build playback and handoff screen.

## Requirements
- title
- metadata
- playback controls
- waveform scrubber
- Open NotebookLM primary CTA
- Share secondary action
- Rename
- Delete

---

# Task 11 — Playback System

## Goal
Implement playback.

## Requirements
- play
- pause
- seek/scrub
- rewind 15 seconds
- forward 15 seconds
- playback state sync

---

# Task 12 — Rename System

## Goal
Rename recordings correctly.

## Requirements
- update UI name
- update actual device filename
- persist rename after restart
- handle duplicate names
- handle invalid characters

---

# Task 13 — Delete System

## Goal
Delete recordings safely.

## Requirements
- confirmation
- remove from UI
- remove file from device if intended
- handle missing file case

---

# Task 14 — NotebookLM Helper Flow

## Goal
Make NotebookLM handoff understandable.

## Requirements
- Open NotebookLM CTA opens helper
- helper explains upload steps
- open NotebookLM app/browser
- fallback if unavailable

## Copy
Your recording is ready.
Open NotebookLM, tap Add Source, then upload your recording.

---

# Task 15 — NotebookLM File Prep

## Goal
Make files easy to find when uploading.

## Requirements
- ensure file exists
- ensure file is accessible
- update timestamp or prepare export copy if needed
- support old recordings
- preserve clean filename

---

# Task 16 — Native Share

## Goal
Allow standard sharing.

## Requirements
- native share sheet
- correct file attached
- filename preserved
- Share remains secondary to Open NotebookLM

---

# Task 17 — Google Calendar Integration

## Goal
Use calendar events for naming.

## Requirements
- Google sign-in
- read-only calendar access
- Today’s Meetings feed
- tap event → prefilled recording title
- disconnected state
- permission denial state

---

# Task 18 — Permission States

## Goal
Handle permission issues clearly.

## Requirements
- microphone denied
- calendar denied
- storage/file access denied if relevant
- clear non-technical copy
- no dead ends

---

# Task 19 — Error States

## Goal
Handle failures gracefully.

## Required Error States
- recording failed
- save failed
- missing file
- playback failed
- calendar failed
- NotebookLM failed to open

---

# Task 20 — Settings Screen

## Goal
Build essential settings.

## Requirements
- Google Calendar connection
- storage location display
- support link
- privacy policy link
- terms link

---

# Task 21 — Visual Polish Pass

## Goal
Bring UI to production quality.

## Requirements
- spacing consistency
- typography consistency
- CTA hierarchy
- light-only aesthetic
- dividers over cards
- minimal gradients

---

# Task 22 — QA Pass

## Goal
Run QA_TEST_PLAN.md.

## Requirements
Test:
- new recording flow
- old recording flow
- rename
- playback
- calendar naming
- NotebookLM handoff
- file accessibility

---

# Task 23 — Launch Prep

## Goal
Prepare stores.

## Requirements
- screenshots
- app icon
- splash screen
- privacy URL
- support URL
- terms URL
- store copy
- internal testing

---

# Done Rule
A task is not done until:
- it works
- it matches docs
- obvious edge cases are handled
- UX remains simple
- no unrelated features are added
