# Meeting Recall UI Gap Tracker

## Purpose

This document tracks missing UI states, UX gaps, edge cases, and polish items identified during the UI audit process.

The goal is to:
- prevent incomplete implementation
- track missing UX states
- improve reliability perception
- improve user confidence
- ensure the product feels production-ready

This document should be updated continuously throughout development.

---

# Priority Definitions

## P0
Critical for MVP launch.

Missing this creates:
- confusion
- broken trust
- workflow failure
- risk of lost recordings

---

## P1
Important for polish and confidence.

---

## P2
Nice-to-have improvements after launch.

---

# ONBOARDING

## P1 — Clarify AI Positioning

### Gap
Users may incorrectly assume Meeting Recall generates summaries directly.

### Requirement
Clarify:
- recordings happen in Meeting Recall
- insights happen in NotebookLM

---

## P1 — Local Privacy Messaging

### Gap
Local-first privacy benefit not emphasized enough.

### Requirement
Add:
“Recordings stay on your device.”

---

## P2 — Workflow Visualization

### Gap
Core flow could be more visually reinforced.

### Requirement
Visual:
Record → Save → Open NotebookLM → Upload

---

# HOME SCREEN

## P0 — No Meetings State

### Gap
No defined empty state when calendar has no events.

### Requirement
Show:
“No meetings today.”

---

## P0 — No Recordings State

### Gap
No first-run recordings empty state.

### Requirement
Show:
“Your recordings will appear here.”

---

## P1 — Calendar Disconnected State

### Gap
No clear disconnected state.

### Requirement
Show reconnect guidance.

---

## P1 — Calendar Loading State

### Gap
Loading behavior undefined.

### Requirement
Add lightweight loading treatment.

---

## P1 — Calendar Failure State

### Gap
No fallback messaging if calendar fails.

### Requirement
Explain failure without blocking recording.

---

## P1 — Recording Saved Feedback

### Gap
No confirmation after successful save.

### Requirement
Add:
“Saved to Meeting Recall folder.”

---

## P0 — Missing File Indicator

### Gap
Recording may exist in app list but missing on device.

### Requirement
Display missing-file state gracefully.

---

# RECORDING SCREEN

## P0 — Microphone Denied State

### Gap
Permission denial flow undefined.

### Requirement
Explain how to enable microphone access.

---

## P1 — Preparing Microphone State

### Gap
No loading state before recording initializes.

### Requirement
Add subtle loading state if needed.

---

## P0 — Recording Failure State

### Gap
No recording-start failure behavior defined.

### Requirement
Display calm recovery message.

---

## P1 — Pause State Clarity

### Gap
Paused state may not feel visually distinct enough.

### Requirement
Improve paused-state visibility.

---

## P0 — Recording Interruption Handling

### Gap
Incoming calls/background interruptions not clearly surfaced.

### Requirement
Protect recording and communicate state clearly.

---

## P1 — Low Storage Warning

### Gap
No storage capacity warning behavior defined.

### Requirement
Warn users before failures occur if possible.

---

## P0 — Unsaved Recording Recovery

### Gap
Potential recording loss risk.

### Requirement
Recover interrupted recordings when possible.

---

## P1 — Cancel Recording Confirmation

### Gap
Accidental recording discard risk.

### Requirement
Confirm before destructive loss.

---

# SAVE BOTTOM SHEET

## P1 — Editable Title State

### Gap
Rename/edit interaction not fully defined.

### Requirement
Support editable filename flow.

---

## P1 — Invalid Filename Handling

### Gap
No validation behavior defined.

### Requirement
Prevent invalid filenames gracefully.

---

## P1 — Duplicate Filename Handling

### Gap
Duplicate naming behavior undefined.

### Requirement
Prevent accidental overwrites.

---

## P1 — Save Loading State

### Gap
No loading feedback during save.

### Requirement
Show lightweight save progress state.

---

## P0 — Save Failure State

### Gap
Failure behavior undefined.

### Requirement
Clear recovery messaging.

---

## P0 — Discard Confirmation

### Gap
Potential accidental data loss.

### Requirement
Confirm discard action.

---

## P1 — Save Success Feedback

### Gap
Save completion feedback weak.

### Requirement
Confirm successful save.

---

# RECORDING DETAIL SCREEN

## P1 — Rename Modal

### Gap
Rename UI undefined.

### Requirement
Define modal/sheet behavior.

---

## P0 — Delete Confirmation

### Gap
Accidental deletion risk.

### Requirement
Require confirmation before delete.

---

## P0 — Missing File State

### Gap
Broken recordings not handled clearly.

### Requirement
Display recovery/failure messaging.

---

## P1 — Playback Failure State

### Gap
Playback issues undefined.

### Requirement
Graceful playback failure handling.

---

## P1 — Audio Loading State

### Gap
Loading behavior unclear.

### Requirement
Add lightweight loading feedback.

---

## P1 — Share Failure State

### Gap
Share failures undefined.

### Requirement
Graceful fallback/error handling.

---

## P1 — File Location Visibility

### Gap
File location confidence too weak.

### Requirement
Show:
“Saved in Meeting Recall folder.”

---

## P0 — Old Recording Confidence

### Gap
Old recordings may feel secondary.

### Requirement
Old recordings must fully support NotebookLM workflow.

---

# NOTEBOOKLM HELPER

## P1 — App Unavailable State

### Gap
NotebookLM app missing behavior undefined.

### Requirement
Fallback to browser version.

---

## P1 — Failed Open State

### Gap
Open failure handling undefined.

### Requirement
Explain fallback clearly.

---

## P0 — File Missing Before Open

### Gap
Potential broken workflow.

### Requirement
Verify file before NotebookLM opens.

---

## P1 — Filename Visibility

### Gap
User may not know which file to upload.

### Requirement
Display exact filename.

---

## P1 — Folder Reminder

### Gap
Folder discoverability could improve.

### Requirement
Mention Meeting Recall folder.

---

# SETTINGS

## P1 — Calendar Connected State

### Gap
Connected/disconnected status unclear.

### Requirement
Show active status clearly.

---

## P1 — Calendar Sync Failure

### Gap
Sync issues undefined.

### Requirement
Graceful recovery messaging.

---

## P1 — Storage Access Issues

### Gap
Limited/unavailable storage handling undefined.

### Requirement
Clear messaging.

---

## P1 — Permission Recovery Guidance

### Gap
Settings recovery flows weak.

### Requirement
Guide users back to OS settings.

---

# ACCESSIBILITY

## P1 — Minimum Touch Targets

### Requirement
Ensure accessible control sizing.

---

## P1 — Dynamic Text Support

### Requirement
Support larger text scaling.

---

## P1 — Screen Reader Labels

### Requirement
Label icon-only controls.

---

## P1 — Color Contrast Validation

### Requirement
Verify accessibility compliance.

---

## P2 — Reduced Motion Support

### Requirement
Respect reduced motion settings if feasible.

---

# VISUAL POLISH

## P1 — Remove Prototype Text

### Gap
“View empty state” placeholder visible.

### Requirement
Remove prototype/debug language.

---

## P1 — Delete Color Hierarchy

### Gap
Delete red may compete with recording red.

### Requirement
Reduce destructive emphasis until confirmation.

---

## P1 — Clean NotebookLM Export

### Gap
Browser chrome visible in export.

### Requirement
Use clean app-only export.

---

## P1 — Button Shape Consistency

### Gap
Too many pill-shaped actions may reduce hierarchy.

### Requirement
Refine CTA consistency.

---

# FINAL UX SUCCESS DEFINITION

Meeting Recall UI succeeds when:
- recordings feel safe
- files feel accessible
- NotebookLM workflow feels obvious
- users never feel lost
- destructive actions feel safe
- the interface feels calm and trustworthy
