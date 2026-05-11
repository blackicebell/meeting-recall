# Meeting Recall Design Asset Index

## Purpose

This document tracks all UI/design assets used for Meeting Recall.

The goal is to:
- create a single source of truth for design assets
- reduce confusion during development
- organize finalized MVP screens
- support engineering implementation
- prevent outdated UI references from being used

This document should be updated whenever:
- new finalized screens are exported
- assets are replaced
- MVP screens change
- branding assets evolve

---

# Folder Structure

## /design/screenshots

Contains finalized UI screen exports used for implementation reference.

These should be:
- high fidelity
- development-ready
- visually approved
- current

Avoid placing exploratory concepts or outdated designs here.

---

## /design/exports

Contains exported production assets:
- logos
- app icons
- splash assets
- SVGs
- branding assets

---

## /design/references

Contains:
- visual inspiration
- style references
- UI references
- branding references

This folder is optional and should not override finalized UI decisions.

---

# MVP Screen Export List

The following screens are required for MVP implementation.

---

## onboarding_01.png

### Purpose
Introduce the app simply and clearly.

### Key Message
Record meetings.
Recall everything.

---

## onboarding_02.png

### Purpose
Explain NotebookLM workflow.

### Key Message
Summaries, your way.

---

## home.png

### Purpose
Primary navigation and recording hub.

### Required Elements
- Today’s Meetings
- Record button
- Recent Recordings
- Settings access

---

## recording.png

### Purpose
Focused recording experience.

### Required Elements
- Timer
- Waveform
- Pause
- Stop
- Recording indicator

---

## save_bottom_sheet.png

### Purpose
Finalize recording save flow.

### Required Elements
- Date-first title
- Save CTA
- File details

---

## recording_detail.png

### Purpose
Playback and NotebookLM handoff.

### Required Elements
- Playback controls
- Metadata
- Waveform scrubber
- Open NotebookLM CTA
- Secondary actions

---

## notebooklm_helper.png

### Purpose
Guide user into NotebookLM upload process.

### Required Elements
- Short instructions
- Open NotebookLM CTA
- Minimal cognitive load

---

## settings.png

### Purpose
Essential configuration and support.

### Required Elements
- Google Calendar
- Storage location
- Support
- Terms
- Privacy Policy

---

# Asset Naming Rules

## Screen Exports

Use lowercase snake_case:

Examples:
- onboarding_01.png
- recording_detail.png
- notebooklm_helper.png

---

## Logo Assets

Examples:
- logo_primary.svg
- logo_mark.svg
- app_icon.png

---

# Design Approval Rules

Only place screens in:
/design/screenshots

if they are:
- visually approved
- aligned with UX documentation
- aligned with COMPONENT_SYSTEM.md
- considered implementation-ready

---

# Important UX Reminder

The UI should reinforce:
- simplicity
- clarity
- calmness
- focused workflows

The product should NOT visually evolve into:
- a dashboard
- a productivity suite
- a feature-heavy SaaS platform

---

# Primary Workflow Reminder

The core workflow is:

Record

↓

Save

↓

Open NotebookLM

↓

Upload Recording

↓

Get Insights

All design decisions should support this flow.

---

# Source of Truth Rule

The finalized exports inside:
/design/screenshots

should be treated as the primary visual implementation reference for development.

Older explorations, temporary exports, or experimental concepts should not override these screens.

---

# Next Required Step

After exports are added:
- verify all MVP screens exist
- verify naming consistency
- verify screens match current UX documentation
- verify CTA hierarchy consistency
- verify NotebookLM flow consistency
