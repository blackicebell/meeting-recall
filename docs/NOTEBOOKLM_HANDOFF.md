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

Helper / Instruction Screen

↓

Open NotebookLM

↓

User uploads recording

---

# Open NotebookLM CTA

## Priority

“Open NotebookLM” is the primary CTA on the Recording Detail screen.

It should:
- Be visually dominant
- Be easier to access than Share
- Clearly communicate the next step

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
4. Open helper screen
5. Open NotebookLM app or browser

---

# NotebookLM Helper Screen

## Purpose

Reduce user hesitation and confusion before entering NotebookLM.

---

# Helper Copy

## Headline
Your recording is ready

## Body
“We saved your recording to the Meeting Recall folder so it’s easy to find when uploading to NotebookLM.”

---

# Instructions

1. Open NotebookLM
2. Tap Add Source
3. Upload your recording

---

# UX Goals

The helper screen should:
- Reduce cognitive load
- Explain only what is necessary
- Avoid technical wording
- Keep instructions extremely short

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
