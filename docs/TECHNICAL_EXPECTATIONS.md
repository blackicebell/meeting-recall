# Meeting Recall Technical Expectations

## Purpose

This document defines the expected technical behavior of Meeting Recall.

The goal is to:
- reduce implementation ambiguity
- align engineering decisions with product goals
- ensure consistency across platforms
- preserve the intended user experience

This document defines behavior expectations, not strict implementation details.

---

# Core Technical Philosophy

Meeting Recall should feel:
- lightweight
- stable
- local-first
- predictable
- fast

The app should avoid:
- unnecessary backend systems
- unnecessary cloud dependencies
- over-engineered architecture
- unnecessary AI processing

---

# Platform Targets

## Primary Platforms
- iOS
- Android

---

# Primary Technical Priorities

Priority order:

1. Recording reliability
2. File accessibility
3. UX clarity
4. Stability
5. Performance
6. Visual polish

---

# Audio Recording Expectations

## Core Requirement

Users must be able to reliably record meetings without worrying about:
- losing recordings
- corrupted files
- interrupted sessions
- confusing save behavior

---

# Recording Requirements

## Required Behaviors
- Fast recording start
- Stable long-form recording
- Pause/resume support
- Accurate timer updates
- Stable waveform rendering
- Playback support
- Scrubbing support

---

# Playback Expectations

Saved recordings should remain comfortable to listen to without the phone sleeping mid-playback.

While playback is actively running, the app should hold a screen wake lock so normal screen timeout does not interrupt listening.

Playback wake-lock behavior:
- enable keep-awake when playback starts
- keep keep-awake active while playback is playing
- release keep-awake when playback stops
- release keep-awake when leaving the Recording Detail screen
- do not keep the screen awake on idle detail screens

---

# Recording Persistence

Recording works best while Meeting Recall remains active.

True background recording is not part of the current MVP unless validated later with native support.

While a recording session is in progress, the app should hold a screen wake lock so normal screen timeout does not interrupt the recording.

Wake-lock behavior:
- enable keep-awake immediately when recording starts/prepares
- keep keep-awake active while recording is active
- keep keep-awake active while the recording is paused, because the session is still in progress
- release keep-awake only after final stop, save/discard, or Recording screen cleanup
- avoid status-transition cleanup races that deactivate the wake lock after activation
- show dev-only wake-lock status while validating the behavior

This reduces accidental interruptions from screen timeout, but it is not the same as true background recording.

When the app is minimized, locked, or interrupted during recording, the app should:
- detect the interruption when possible
- attempt to stop and preserve the current recording
- route the user into Save Recording when a recoverable file exists
- avoid silent failure
- avoid promising unsupported background recording

---

# Interruption Handling

Expected interruption scenarios:
- incoming phone calls
- audio interruptions
- app backgrounding
- headphones disconnecting

The app should fail gracefully and preserve recordings whenever possible.

Preferred user-facing copy:
“Recording was interrupted.”

Preferred recording guidance:
“For best recording results, keep Meeting Recall open while recording.”

---

# File Storage Expectations

## Core Philosophy

Files are part of the product experience.

Users should feel confident that recordings:
- exist
- are accessible
- are easy to find
- are not trapped inside the app

---

# Local Storage Rules

Recordings must:
- save locally
- persist after app restart
- remain accessible outside the app
- save to visible Meeting Recall folder

---

# Folder Expectations

Preferred folder naming:

Meeting Recall

Examples:
- iOS Files app
- Android Documents/Files

Platform-specific behavior:

- Android uses Storage Access Framework and asks the user to choose a visible Meeting Recall folder.
- iOS does not use Storage Access Framework because it is Android-only.
- iOS saves recordings inside Meeting Recall app document storage.
- iOS saves new recordings directly in the app document root to avoid a nested folder inside the visible Meeting Recall app location.
- App metadata should be stored separately from user-visible audio files.
- iOS enables document sharing with UIFileSharingEnabled and LSSupportsOpeningDocumentsInPlace.
- iOS users should still use Share for the most reliable NotebookLM handoff when file browsing is limited by sandboxing.

---

# File Naming Rules

All recordings should follow:

YYYY-MM-DD – Meeting Name.m4a

Examples:
2026-04-29 – Meeting Yoshi.m4a
2026-04-29 – Client Strategy Call.m4a

---

# Final Save Expectations

The preferred production save flow is:

1. Record to a temporary app-controlled URI.
2. User enters or accepts the title.
3. Sanitize the title.
4. Create the final filename:
YYYY-MM-DD – Meeting Name.m4a
5. Wait for the temporary recording file to finish finalizing.
6. Verify the temporary file exists, is readable, and has file size greater than 0.
7. Verify the temporary recording can initialize for playback when feasible.
8. Copy/write the audio into the platform recording location using that final filename.
9. Verify the final public file exists.
10. Verify the final public file size is greater than 0.
11. Verify the final public file can initialize for playback when feasible.
12. Save app metadata pointing to the final public file URI only after validation passes.
13. Delete the temporary file if safe.

If any finalization, export, readability, file-size, or playback-initialization validation fails, the app must not mark the recording as saved.

Preferred user-facing failure copy:

Recording could not be finalized.

Direct rename is unreliable on the tested Android setup, so the app should avoid needing to rename public files during the normal save flow.

Memory-heavy copy attempts that read the full audio file into JS memory caused low-memory warnings during Android testing. Meeting-length recordings must not be copied through JS memory.

Implementation preference:

- Prefer native, streaming, or platform-level file operations.
- If Expo cannot safely copy from a temporary recording URI into a public Android SAF destination, document the limitation and use a native storage module or different storage architecture.

The production requirement is:

The file created in the Meeting Recall folder or app recording storage must have the correct name users expect.

The final file must also be a valid audio file that can:
- play back inside Meeting Recall
- play back from device storage where supported
- upload into NotebookLM
- share successfully as an .m4a audio file

---

# File Naming Goals

File names should:
- sort naturally
- remain human-readable
- be recognizable in file pickers
- reduce upload confusion

---

# Rename Expectations

Renaming inside the app must:
- update UI state
- update actual device file name
- persist after app restart

This behavior is critical because NotebookLM upload uses the system file picker.

Implementation expectation:

- Do not rely on direct file rename as the primary strategy.
- Post-save rename may be deferred for MVP unless safe native file operations are validated.
- If rename is deferred, any display-title-only editing must be clearly communicated to the user.
- The preferred MVP behavior is correct filename at initial Save Recording.
- If post-save rename is later enabled, verify the replacement file exists and has size greater than 0 before updating app metadata.
- Attempt to delete the old file after replacement succeeds when platform behavior allows it.
- Old file deletion may be platform-limited and must be handled gracefully.

---

# File Accessibility Expectations

Users should be able to:
- locate recordings from device file browser
- share recordings externally
- upload recordings into NotebookLM easily

---

# “Recent Files” Optimization

When possible:
- prepared/exported recordings should appear near top of Recents
- file timestamps should support discoverability

This improves NotebookLM upload flow.

---

# NotebookLM Workflow Expectations

## Core Philosophy

Meeting Recall does not integrate directly with NotebookLM APIs.

The app should:
- prepare recordings cleanly
- guide users clearly
- reduce upload friction

---

# Open NotebookLM Behavior

When user taps:
Open NotebookLM

Expected behavior:
1. Ensure recording exists
2. Ensure recording accessible
3. Prepare file visibility if necessary
4. Open helper/interstitial
5. Open NotebookLM app or browser

---

# Browser Fallback

If NotebookLM app unavailable:
- fallback to browser version if possible
- communicate clearly to user

---

# Share Behavior

Share should:
- remain secondary to Open NotebookLM
- use native platform share sheets
- preserve clean file naming

---

# Google Calendar Expectations

## Core Purpose

Calendar integration exists to:
- reduce manual naming
- help organize meetings
- simplify recording workflows

---

# Google Sign-In Setup

The production Calendar integration is prepared to use:

@react-native-google-signin/google-signin

Current app identifiers:

- Android package: com.meetingrecall.app
- iOS bundle ID: com.meetingrecall.app

Because Google Sign-In uses native code, any dependency or config-plugin change requires a new Expo development build before testing.

Google Cloud Console setup is still required:

- Enable Google Calendar API
- Configure OAuth consent screen
- Create Android OAuth client
- Create iOS OAuth client
- Add the development-build SHA-1 fingerprint for Android
- Replace placeholder OAuth values in app config/constants

Do not hardcode private secrets in the app.

---

# Required Behaviors

- Google authentication support
- Calendar permission handling
- Fetch current-day meetings
- Pre-fill recording names
- Handle disconnected states gracefully

---

# Offline Expectations

The app should remain functional offline for:
- recording
- playback
- file access

Calendar syncing may require internet.

NotebookLM usage may require internet.

---

# Performance Expectations

The app should feel:
- responsive
- lightweight
- stable

---

# Performance Goals

- Fast app launch
- Fast recording start
- Smooth scrolling
- Responsive playback
- Stable long recordings

Avoid:
- frame drops
- heavy memory usage
- unnecessary animations

---

# UI Expectations

The UI should:
- prioritize clarity
- prioritize typography
- avoid clutter
- feel calm

---

# Visual Rules

Prefer:
- dividers
- spacing
- clean hierarchy

Avoid:
- heavy cards
- excessive shadows
- dashboard complexity

---

# Error Handling Expectations

Errors should:
- explain clearly
- reduce panic
- provide next-step guidance
- avoid technical jargon

---

# Important Error States

Handle gracefully:
- failed recording
- failed save
- missing files
- failed playback
- calendar loading failure
- NotebookLM open failure
- permission denial

---

# Permission Expectations

## Required Permissions
- microphone
- calendar (optional)
- file/storage access if needed

Permission messaging should:
- feel calm
- explain user benefit
- avoid technical language

---

# Architecture Expectations

Prefer:
- maintainable code
- modular UI components
- predictable state management
- reusable systems

Avoid:
- unnecessary abstraction
- unnecessary dependencies
- over-engineering

---

# Product Integrity Rule

Do not implement features that shift Meeting Recall into:
- AI meeting assistant
- transcription platform
- collaboration suite
- productivity dashboard

The product should remain intentionally focused.

---

# Technical Success Definition

The product succeeds technically when a non-technical user can:

1. Record a meeting
2. Save it safely
3. Find the file later
4. Open NotebookLM
5. Upload without confusion
6. Get insights quickly

without technical knowledge or troubleshooting.
