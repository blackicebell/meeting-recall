# Meeting Recall MVP Implementation Phases

## Goal

This document defines the production implementation roadmap for Meeting Recall now that the core technical workflow has been validated.

The MVP has successfully validated:

- audio recording
- playback
- local folder save
- Meeting Recall folder accessibility
- NotebookLM upload workflow

The product should now move from technical spikes into focused MVP implementation.

---

# What Ships In MVP

MVP includes:

- reliable audio recording
- playback
- save flow with clear naming
- local export to Meeting Recall folder
- file existence validation
- clear NotebookLM handoff
- Google Calendar naming support
- focused onboarding
- essential error states
- calm, polished production UI

---

# Phase 1 — Core Recording Flow

## Goal

Make recording, saving, finding, and playing back audio reliable.

## Implementation Scope

### Recording Screen

- start recording
- pause recording
- resume recording
- stop recording
- focused recording UI
- visible recording status
- timer
- simple waveform or activity indicator if waveform is not ready

### Stop / Save Flow

- stop recording opens Save Recording flow
- user can accept or edit title before final save
- save action feels clear and low-friction
- discard action requires confirmation

### Save Naming UX

- default title uses calendar meeting name when available
- fallback title uses simple meeting naming
- final filename follows:
YYYY-MM-DD – Meeting Name.m4a
- invalid filename characters are sanitized
- duplicate filenames handled safely

### Meeting Recall Folder Export

- save final audio file to visible Meeting Recall folder
- show clear confirmation:
Saved to Meeting Recall folder
- store app metadata pointing to saved file URI
- avoid memory-heavy file operations for long recordings

### Playback

- play recording
- pause playback
- stop playback
- show duration and basic metadata

### File Existence Validation

- verify saved file exists
- verify saved file size is greater than 0
- handle missing file state clearly
- never show a recording as safely saved until validation passes

---

# Phase 2 — NotebookLM Workflow

## Goal

Make the handoff from Meeting Recall to NotebookLM obvious and low-friction.

## Implementation Scope

### Helper Screen

- show short upload instructions
- keep instructions plain and minimal
- reinforce that the file is saved in Meeting Recall folder

### Upload Guidance

- guide user to open NotebookLM
- tell user to tap Add Source
- tell user to upload the saved recording

### Filename Clarity

- show exact filename before handoff
- show Meeting Recall folder as the location
- avoid relying on Recents as the only path

### Open NotebookLM Flow

- Open NotebookLM is the primary CTA
- open NotebookLM app/browser when possible
- keep Share visually secondary

### Fallback Guidance

- if NotebookLM does not open, show calm fallback copy
- if Recents does not show the file, tell user to browse to Meeting Recall folder
- if file is missing, stop the flow and explain clearly

---

# Phase 3 — Calendar Integration

## Goal

Reduce naming friction and help users start recordings from real meetings.

## Implementation Scope

### Google Sign-In

- support Google sign-in
- request only needed permissions
- keep permission copy clear and non-technical

### Read-Only Calendar Access

- request read-only calendar access
- fetch current-day meetings
- handle denied/disconnected states

### Prefilled Meeting Names

- tapping a calendar event starts recording with prefilled title
- saved filename uses the meeting title
- user can still edit title before saving

### Today’s Meetings

- show Today’s Meetings on Home
- show loading state
- show no-meetings state
- show calendar failure state without blocking manual recording

---

# Phase 4 — Production UX Polish

## Goal

Make the app feel calm, premium, obvious, and trustworthy.

## Implementation Scope

### Loading States

- recording initialization
- saving
- file validation
- calendar loading
- NotebookLM handoff prep

### Error States

- microphone denied
- recording failed
- save failed
- missing file
- playback failed
- NotebookLM open failed
- calendar failed

### Empty States

- no meetings today
- no recordings yet
- calendar disconnected

### Accessibility

- readable text sizes
- accessible touch targets
- screen reader labels for icon buttons
- sufficient contrast
- reduced motion where appropriate

### Onboarding

- explain core workflow quickly
- clarify Meeting Recall records and NotebookLM provides insights
- reinforce local-first storage

### Animations

- subtle transitions only
- no distracting motion
- recording feedback should feel calm

### Visual Polish

- light-only MVP
- primary blue #4b7de6
- red only for active recording
- typography-led hierarchy
- dividers over heavy cards
- one dominant CTA per screen

---

# Phase 5 — Reliability Hardening

## Goal

Make the app safe enough for real meetings.

## Implementation Scope

### Interruption Handling

- incoming call behavior
- app switch behavior
- screen lock behavior
- audio route changes
- interruption messaging

### Background Behavior Decisions

- MVP may require the app to stay open during recording unless background recording is validated
- if background recording is not supported, communicate that clearly before recording
- true background recording should not be promised until validated

### Low Storage Handling

- detect low storage where possible
- warn before recording failure
- handle save failure calmly

### File Corruption Prevention

- verify file exists after save
- verify file size greater than 0
- avoid unsafe memory-heavy copy behavior
- do not update metadata until file validation passes

### Crash Recovery

- attempt to detect unsaved recordings after restart
- recover temporary recordings where possible
- show clear recovery state

---

# Deferred Features

Do not include in MVP:

- cloud sync
- transcription
- built-in AI summaries
- collaboration
- bookmarks
- timestamp features
- advanced editing
- enterprise features
- complex dashboards
- aggressive Recents hacks
- true background recording unless validated later

---

# Implementation Priorities

Priority order:

1. Recording reliability
2. Save reliability
3. File visibility
4. Playback
5. NotebookLM handoff clarity
6. Calendar naming
7. Error handling
8. Accessibility
9. Visual polish

---

# Technical Priorities

Prioritize:

- stable audio recording
- safe file writing
- verified saved files
- simple state management
- platform-specific file behavior
- clear permission handling

Avoid:

- memory-heavy file operations
- unnecessary cloud systems
- premature rename complexity
- fake NotebookLM automation
- unsupported background promises

---

# UX Priorities

Prioritize:

- obvious next action
- confidence that recording saved
- exact filename visibility
- clear folder guidance
- calm errors
- minimal decisions

The user should never wonder:

- where the file is
- whether recording saved
- what to upload
- what to do next

---

# MVP Success Definition

Meeting Recall MVP succeeds when:

- users can reliably record meetings
- recordings save predictably
- recordings are easy to find
- NotebookLM upload feels understandable
- users can get AI insights without expensive subscriptions
