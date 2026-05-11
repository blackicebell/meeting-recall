# Meeting Recall Screen State Matrix

## Purpose

This document defines every important screen state in Meeting Recall.

The goal is to:
- prevent undefined UI behavior
- eliminate edge-case ambiguity
- ensure UX consistency
- improve implementation quality
- improve QA coverage

Each major screen should define:
- default state
- loading states
- empty states
- success states
- error states
- interrupted states

This document should evolve throughout development.

---

# State Definitions

## Default State
Normal expected screen behavior.

---

## Loading State
Temporary loading or initialization state.

---

## Empty State
No data available.

---

## Success State
Positive completion feedback.

---

## Error State
Failure requiring user awareness or action.

---

## Interrupted State
Unexpected external interruption or partial failure.

---

# 1. Splash Screen

## Default
- App logo visible
- Clean white background
- Minimal loading feel

---

## Loading
- App initialization
- Settings loading
- Storage initialization

---

## Error
- App initialization failure
- Corrupted startup state

---

# 2. Onboarding Screen

## Default
- Clear onboarding copy
- CTA visible
- Smooth progression

---

## Interrupted
- App closed during onboarding
- Partial onboarding completion

---

# 3. Home Screen

# Default State
- Today’s Meetings visible
- Recent Recordings visible
- Record CTA visible

---

# Empty States

## No Meetings
Display:
“No meetings today.”

---

## No Recordings
Display:
“Your recordings will appear here.”

---

# Loading States

## Calendar Loading
- lightweight loading treatment
- maintain calm layout

---

## Recordings Loading
- avoid layout jumps
- preserve spacing

---

# Error States

## Calendar Failure
Display:
“Unable to load calendar events.”

Recording should still work.

---

## Missing Recording File
Recording exists in UI but file missing on device.

Display:
“Recording file could not be found.”

---

# Success States

## Recording Saved
Display:
“Saved to Meeting Recall folder.”

---

# 4. Recording Screen

# Default State
- Timer active
- Waveform active
- Stop available
- Pause available

---

# Loading States

## Preparing Microphone
- subtle loading state
- no UI freezing

---

# Paused State
- timer paused
- visual distinction visible
- Resume action available

---

# Error States

## Microphone Permission Denied
Display recovery guidance.

---

## Recording Start Failure
Display:
“Unable to start recording.”

---

## Low Storage Warning
Warn user before recording failure if possible.

---

# Interrupted States

## Incoming Call
- preserve recording if possible
- communicate interruption clearly

---

## App Backgrounded
Handle gracefully per platform limitations.

---

## App Crash Recovery
Attempt recovery if possible.

---

# Success States

## Recording Active Confirmation
User clearly understands recording is active.

---

# 5. Save Bottom Sheet

# Default State
- editable filename
- metadata visible
- Save CTA visible

---

# Loading State

## Saving Recording
Display lightweight saving progress.

---

# Error States

## Save Failure
Display:
“Unable to save recording.”

---

## Invalid Filename
Prevent invalid naming gracefully.

---

## Duplicate Filename
Prevent accidental overwrite.

---

# Interrupted States

## User Dismisses Sheet
Prompt if recording would be lost.

---

# Success States

## Save Successful
Display:
“Recording saved.”

---

# 6. Recording Detail Screen

# Default State
- playback available
- metadata visible
- NotebookLM CTA visible

---

# Loading States

## Audio Loading
Playback preparing.

---

## Waveform Loading
Waveform processing/loading.

---

# Error States

## Playback Failure
Display:
“Unable to play recording.”

---

## Missing File
Display:
“Recording file could not be found.”

---

## Share Failure
Display:
“Unable to share recording.”

---

# Success States

## Playback Active
Playback state visually obvious.

---

## NotebookLM Ready
Recording clearly upload-ready.

---

# 7. Rename Modal

# Default State
- current filename visible
- editable text field

---

# Error States

## Invalid Filename
Explain naming issue clearly.

---

## Duplicate Filename
Prevent overwrite.

---

## Rename Failure
Display:
“Unable to rename recording.”

---

# Success States

## Rename Successful
Filename updates:
- in app
- on actual device file

---

# 8. Delete Confirmation

# Default State
- calm confirmation
- avoid aggressive visuals

---

# Error States

## Delete Failure
Display:
“Unable to delete recording.”

---

# Success States

## Delete Successful
Recording removed:
- from UI
- from storage if intended

---

# 9. NotebookLM Helper Screen

# Default State
- short instructions
- filename visible
- Open NotebookLM CTA visible

---

# Error States

## NotebookLM Unavailable
Fallback to browser if possible.

---

## File Missing
Prevent NotebookLM flow if recording missing.

---

## Failed Open
Display:
“Unable to open NotebookLM.”

---

# Success States

## NotebookLM Opened
User transitions successfully.

---

# 10. Settings Screen

# Default State
- Calendar connection visible
- storage location visible
- support/legal links visible

---

# Loading States

## Calendar Sync Loading
Lightweight loading state.

---

# Error States

## Calendar Sync Failure
Display:
“Unable to sync calendar.”

---

## Storage Access Issue
Display clear recovery guidance.

---

# Success States

## Calendar Connected
Connected state clearly visible.

---

# 11. Permission States

# Microphone Permission

## Allowed
Recording available.

---

## Denied
Explain how to enable permission.

---

## Permanently Denied
Guide user to OS settings.

---

# Calendar Permission

## Allowed
Meetings visible.

---

## Denied
Recording still available manually.

---

# Storage/File Permission

## Allowed
Files accessible normally.

---

## Denied
Explain limited functionality clearly.

---

# 12. Global States

# Offline State

## Behavior
Recording and playback should still function.

Calendar and NotebookLM may require internet.

---

# App Restart State

## Behavior
Recordings persist correctly after restart.

---

# Long Recording State

## Behavior
App remains stable during extended recordings.

---

# Final State Consistency Rule

Every important screen should define:
- empty state
- loading state
- success state
- error state
- interrupted state if applicable

No screen should have undefined behavior.

---

# Final UX Success Definition

The product succeeds when:
- no state feels broken
- no transition feels confusing
- no error feels alarming
- recordings always feel safe
- NotebookLM workflow remains understandable
- users always know what to do next
