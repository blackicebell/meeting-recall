# Meeting Recall Implementation Spikes

## Purpose

This document defines the highest-risk technical experiments ("spikes") that must be validated before full implementation begins.

The goal is to:
- reduce engineering uncertainty
- validate critical workflows early
- avoid building on unstable assumptions
- identify platform limitations quickly
- protect the MVP

These spikes should happen BEFORE major UI implementation.

---

# Core Product Risk Reminder

Meeting Recall succeeds or fails based on:

1. Recording reliability
2. File accessibility
3. NotebookLM upload discoverability

NOT visual polish.

---

# Spike Priority Order

1. Audio recording reliability
2. Local file accessibility
3. File rename behavior
4. NotebookLM upload flow
5. Calendar integration
6. Background/interruption behavior

---

# SPIKE 1 — Audio Recording Validation

## Goal
Validate stable recording behavior on iOS and Android.

---

## Requirements
Test:
- start recording
- stop recording
- pause/resume
- playback
- long recordings
- interruption behavior
- app backgrounding
- app minimize/restore
- file persistence

---

## Important Questions
- Are recordings stable?
- Are files corrupted?
- Does pause/resume work reliably?
- Does Expo support required behavior?
- Are development builds required?
- Are native modules required?

---

## Deliverable
Document findings and limitations.

---

# SPIKE 2 — Local File Accessibility

## Goal
Validate that recordings are genuinely accessible outside the app.

---

## Requirements
Test:
- Meeting Recall folder visibility
- file browser access
- Recents visibility
- file picker visibility
- NotebookLM upload discoverability
- filename readability

---

## Important Questions
- Can users easily locate recordings?
- Does Android scoped storage interfere?
- Does iOS sandboxing interfere?
- Are files visible where expected?
- Is the UX acceptable?

---

## Deliverable
Document platform-specific behavior.

---

# SPIKE 3 — Rename Validation

## Goal
Validate true filename synchronization.

---

## Requirements
Test:
- rename inside app
- actual device filename update
- duplicate filename handling
- invalid filename handling
- persistence after restart

---

## Important Questions
- Can actual device files be renamed reliably?
- Does rename propagate correctly?
- Are there platform-specific limitations?

---

## Deliverable
Document rename behavior reliability.

---

# SPIKE 4 — NotebookLM Handoff Flow

## Goal
Validate the core product workflow.

---

## Requirements
Test:
- opening NotebookLM
- browser fallback
- file upload flow
- locating old recordings
- upload discoverability
- filename clarity

---

## Important Questions
- Does the workflow feel smooth?
- Can non-technical users find files easily?
- Does the helper screen reduce confusion?
- Is the UX good enough to ship?

---

## Deliverable
Document friction points and UX risks.

---

# SPIKE 5 — Google Calendar Integration

## Goal
Validate lightweight calendar integration.

---

## Requirements
Test:
- Google sign-in
- permission handling
- event retrieval
- Today’s Meetings
- prefilled recording names

---

## Important Questions
- Is implementation complexity acceptable?
- Are permissions manageable?
- Are there App Store review concerns?

---

## Deliverable
Document auth and calendar limitations.

---

# SPIKE 6 — Background + Interruption Behavior

## Goal
Understand recording resilience.

---

## Requirements
Test:
- incoming calls
- app minimize
- app switching
- headphones disconnect
- low memory situations
- app crash recovery

---

## Important Questions
- How fragile is recording?
- Can interrupted recordings recover?
- What user messaging is needed?

---

## Deliverable
Document failure scenarios and recovery behavior.

---

# Spike Rules

## Rule 1
Use real devices whenever possible.

---

## Rule 2
Do not trust simulator-only behavior.

---

## Rule 3
Document platform differences clearly.

---

## Rule 4
Validate the hardest risks BEFORE polishing UI.

---

# Important Product Rule

If:
- recordings are unreliable
OR
- files are difficult to locate

the product fails regardless of visual quality.

---

# Success Definition

The spikes succeed when we have confidence that:

- recordings are stable
- files are accessible
- NotebookLM workflow feels smooth
- platform limitations are understood
- the MVP is technically achievable
