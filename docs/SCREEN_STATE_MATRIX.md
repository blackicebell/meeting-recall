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
- Three onboarding screens
- Screen 1:
Record meetings. Recall everything.
- Screen 2:
Use NotebookLM for insights
- Screen 3:
Your recordings stay with you
- CTA visible
- Skip visible
- Smooth progression

---

## Microphone Explainer
- appears after onboarding screens
- title:
Enable microphone access
- body:
Meeting Recall needs microphone access to record your meetings.
- CTA:
Allow Microphone Access

---

## Microphone Denied
- title:
Microphone access is off.
- body:
Turn it on in Settings to record meetings.
- CTA:
Open Settings

---

## Folder Setup
- appears after microphone permission is granted
- title:
Choose where recordings are saved
- body recommends Documents / Meeting Recall
- CTA:
Choose Folder
- if folder is already stored, show folder ready state and Continue CTA

---

## Success
- onboarding completion persists locally after setup
- returning users go directly to Home

---

## Interrupted
- App closed during onboarding
- Partial onboarding completion
- Returning before setup completion resumes setup instead of going Home

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

## Calendar Connected
- Today’s Meetings section visible
- Events loaded from Google Calendar primary events.list
- Each meeting shows title and time
- Tapping a meeting starts Recording with that meeting title as the suggested save title
- No Calendar Fetch Debug panel is visible
- No temporary Google Sign-In diagnostic controls are visible

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
- Screen wake lock active while status is recording

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
- screen wake lock released so normal device sleep behavior can resume

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
- if recording stops, display:
Recording was interrupted.
- attempt to route user into Save Recording when a recoverable file exists

---

## App Backgrounded
Handle gracefully per platform limitations.
- true background recording is not supported for MVP
- active recording uses keep-awake to reduce accidental screen-timeout interruptions
- if app leaves active state while recording, attempt to stop and preserve the recording
- on return, continue into Save Recording when possible

---

## Screen Locked
- treat as an interruption for MVP
- normal screen timeout should be prevented while recording is active
- attempt to preserve the recording if platform behavior allows
- avoid promising background recording support

---

## Recording Unexpectedly Stopped
- user should not be left in a silent failed state
- show calm interruption messaging
- preserve and save the partial recording when possible

---

## App Crash Recovery
Attempt recovery if possible.

---

# Success States

## Recording Active Confirmation
User clearly understands recording is active.
- timer remains highly visible
- waveform remains active
- red recording indicator remains visible
- helper copy says:
For best recording results, keep Meeting Recall open while recording.

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
- compact status chip visible:
Ready for NotebookLM
- recording title is the visual hero
- exact filename visible
- save location visible:
Documents -> Meeting Recall
- NotebookLM handoff opens NotebookLM directly after file validation
- Recording Detail provides the helper guidance:
When NotebookLM opens, tap Add Source and choose this file.
- Share visible near NotebookLM CTA
- top-left Back uses a clear chevron-style icon
- top-right Delete uses a quiet trash icon with accessible label:
Delete recording
- no More menu should appear unless it contains multiple actions
- playback controls use clear icon states and at least 44px touch targets

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

## Share Missing File
Display:
Recording file could not be found.

Native share sheet should not open.

---

# Success States

## Playback Active
Playback state visually obvious.

---

## NotebookLM Ready
Recording clearly upload-ready.
- Open NotebookLM validates file, then opens https://notebooklm.google.com directly.
- If the OS routes the URL to the NotebookLM app, the app may open.
- Browser opening is acceptable because NotebookLM may not expose a reliable third-party app deep link.

---

## Share Ready
Native OS share sheet opens after file existence and file size validation pass.

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
- title:
Delete recording?
- body:
This removes the recording from Meeting Recall. If possible, the audio file will also be deleted from your device.
- buttons:
Delete Recording
Cancel

---

# Error States

## Delete Failure
Display:
“Unable to delete recording.”

## File Delete Failure
Display:
Recording removed from the app, but the file may still remain in your Meeting Recall folder.

Metadata should be removed when the user has confirmed deletion and the app record can be cleaned up safely.

## File Already Missing
Display a calm cleanup confirmation.

Metadata cleanup should still be allowed.

---

# Success States

## Delete Successful
Recording removed:
- from UI
- from Recent Recordings
- from storage if platform file deletion succeeds

---

# 9. NotebookLM Direct Handoff

# Default State
- starts when user taps Open NotebookLM from Recording Detail
- validates the recording file exists
- validates file size is greater than 0 when possible
- opens https://notebooklm.google.com immediately after validation succeeds
- may open the NotebookLM app if the OS routes the URL to the installed app
- may open the browser if app-link routing is unavailable
- does not show a confirmation modal in the normal flow

---

# Error States

## NotebookLM Unavailable
Show an error only if https://notebooklm.google.com cannot open.

App link routing may not be reliable across platforms.

---

## File Missing
Prevent NotebookLM flow if recording missing.

---

## File Empty
Display:
Recording file is not ready yet.

Prevent NotebookLM flow.

---

## Browser Fallback
Display:
Opening NotebookLM in your browser.

Only show this if the app intentionally surfaces fallback messaging. The normal MVP flow may open the browser without an extra modal.

---

## Failed Open
Display:
“Unable to open NotebookLM.”

Only show this if the NotebookLM URL cannot open.

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
