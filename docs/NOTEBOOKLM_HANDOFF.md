# Meeting Recall NotebookLM Handoff System

## Purpose

This document defines the NotebookLM workflow inside Meeting Recall.

NotebookLM integration is the core differentiator of the app.
Because NotebookLM does not currently provide a direct upload API, the user experience must focus on making recordings extremely easy to find and upload manually.

The goal is not automation.
The goal is reducing friction.

---

# Core Product Philosophy

Meeting Recall records meetings.

NotebookLM provides AI insights.

Meeting Recall should guide users smoothly from:
recording → saving → locating → uploading.

The app should never imply that Meeting Recall itself generates summaries or AI analysis.

---

# Primary User Goal

After recording a meeting, the user should be able to:

1. Open NotebookLM
2. Tap Add Source
3. Upload their recording immediately
4. Find the file without confusion
5. Begin using AI insights quickly

---

# Main UX Principle

The user should never wonder:
- Where is my recording?
- Which file do I upload?
- Why can’t I find my recording?

The handoff experience should feel calm, obvious, and predictable.

---

# Core Handoff Flow

Home

↓

Record Meeting

↓

Stop Recording

↓

Save Recording

↓

Recording Detail Screen

↓

Tap “Open NotebookLM”

↓

Validate recording file

↓

Open NotebookLM immediately

↓

User uploads recording

---

# Open NotebookLM CTA

## Priority

“Open NotebookLM” is the primary CTA on the Recording Detail screen.

Recording Detail is the single source of truth after save.
Do not create a separate full-screen Recording Ready or NotebookLM helper screen that repeats the same title, filename, location, playback, and CTA content.
Do not show a confirmation bottom sheet or modal during the normal Open NotebookLM flow.

It should:
- Be visually dominant
- Be easier to access than Share
- Clearly communicate the next step
- Open NotebookLM immediately after file validation succeeds

---

# Secondary Actions

Secondary actions:
- Share
- Rename
- Delete

These should not visually compete with the NotebookLM action.

---

# File Accessibility Requirements

## Critical Requirement

Files must be easy to locate from the device file picker.

---

# Local Storage Rules

Recordings must:
- Save locally
- Save inside visible “Meeting Recall” folder
- Be accessible from Files/Documents app
- Remain accessible outside the app

---

# File Naming Rules

All recordings must use:
YYYY-MM-DD – Meeting Name.m4a

Examples:
2026-04-29 – Meeting Yoshi.m4a
2026-04-29 – Client Strategy Call.m4a

---

# Naming Goals

File names should:
- Be human-readable
- Sort naturally by date
- Be easy to recognize inside NotebookLM upload flow
- Reduce searching and confusion

---

# Rename Behavior

If a user renames a recording:
- The app UI title must update
- The actual device file name must also update

This is critical because users upload from the system file picker, not from inside Meeting Recall.

Direct rename is unreliable on the tested Android setup.

Production approach:

- Avoid needing to rename public files during the normal save flow.
- Record to a temporary app-controlled file first.
- After the user confirms Save Recording, create the final public file in Documents / Meeting Recall with the correct title-based filename.
- Post-save rename may be deferred for MVP unless safe native file operations are validated.
- Memory-heavy copy-and-replace should not be used for meeting-length recordings.
- If post-save rename is enabled later, attempt to delete the old file after the replacement file is verified.
- Old file deletion may be platform-limited and should be handled gracefully.

---

# “Recent Files” Optimization

## Goal

When possible, exported/prepared recordings should appear near the top of the device’s Recent files list.

This improves discoverability during NotebookLM upload.

---

# Export Preparation Behavior

When user taps:
Open NotebookLM

The app should:
1. Ensure recording exists
2. Ensure recording is accessible
3. Prepare file for sharing/file picker visibility
4. Open NotebookLM app or browser immediately

Before this flow, the saved recording should already exist as a final public file in Documents / Meeting Recall with the expected filename:
YYYY-MM-DD – Meeting Name.m4a

The normal save flow should create this file after the user confirms the title, rather than saving publicly first and renaming later.

---

# NotebookLM Direct Handoff

## Purpose

Reduce friction before entering NotebookLM.

---

# Current Production Behavior

When the user taps Open NotebookLM from Recording Detail:
- verify the recording file exists
- verify file size is greater than 0 when available
- open NotebookLM immediately when validation passes
- do not open NotebookLM if the file is missing
- do not show a confirmation modal during the normal flow

If the file is missing, display:
Recording file could not be found.

If the file is empty, display:
Recording file is not ready yet.

---

# UX Goals

The direct handoff should:
- feel fast and confident
- avoid non-destructive confirmation steps
- avoid repeated workflow explanation
- rely on Recording Detail as the instructional source of truth

Recording Detail may show one short helper line:
When NotebookLM opens, tap Add Source and choose this file.

---

# Browser Fallback

If NotebookLM app cannot open:
- Open NotebookLM web version if possible
- Inform user gracefully

Example:
“Opening NotebookLM in your browser.”

---

# Old Recording Requirement

Old recordings must feel just as easy to use as newly recorded files.

The app should never imply:
- Upload only happens immediately after recording
- Older recordings are less accessible

Users should be able to:
- Open any old recording
- Tap Open NotebookLM
- Upload easily

---

# What the App Should NOT Do

Meeting Recall should NOT:
- Pretend to directly integrate with NotebookLM APIs
- Promise automatic uploads
- Promise automatic AI summaries
- Create confusing cloud sync systems
- Require complex setup

---

# Technical Expectations

# Android File Picker Reality

Android MVP save location:

Documents / Meeting Recall

Open NotebookLM should prepare the file before opening NotebookLM.

Preparation should:
- verify the file exists
- use the latest display name
- preserve the filename format:
YYYY-MM-DD – Meeting Name.m4a
- create or refresh an export-ready copy when timestamp refresh is unreliable
- make the file as discoverable as platform rules allow

Important:

NotebookLM Recents visibility may not be guaranteed.

Do not claim Meeting Recall can force Recents visibility unless real-device testing proves it.

Reliable UX fallback:
- show the exact filename
- tell users the file is in Documents / Meeting Recall
- tell users to browse to that folder from NotebookLM's file picker

Renaming in the app must rename the actual file in Documents / Meeting Recall unless rename is explicitly deferred for MVP.

If rename is deferred, the app must communicate clearly when only the display title changes.

---

## Required Behaviors

- Local file storage
- User-accessible files
- Stable file paths
- Proper MIME/file handling
- Rename synchronization
- File picker compatibility
- Browser fallback support

---

# UX Success Definition

The NotebookLM workflow succeeds when a non-technical user can:

1. Record a meeting
2. Save the recording
3. Open NotebookLM
4. Immediately locate the recording
5. Upload it without confusion
6. Start using AI insights quickly

---

# Product Positioning Reminder

Meeting Recall is not trying to replace AI tools.

Meeting Recall exists to create the smoothest possible bridge between:
meeting recordings → AI understanding.
