# Meeting Recall Feature Done Checklist

## Purpose
This document defines what “done” means for each major feature in Meeting Recall.

A feature is not complete when it merely exists visually.
A feature is complete only when:
- It works reliably
- Edge cases are handled
- UX expectations are met
- The behavior matches the product philosophy

This document should be used during development, QA, and pre-launch testing.

---

# 1. Audio Recording System

## Feature Goal
Allow users to reliably record meetings with minimal friction.

---

## Done Checklist

### Recording
- User can start recording instantly
- Recording begins without delay
- Timer updates correctly
- Waveform animates during recording
- Recording indicator is visible
- Pause works correctly
- Resume works correctly
- Stop works correctly

---

### Stability
- Recording does not pretend to support background recording for MVP
- Screen stays awake for the full recording session
- Screen stays awake while the recording is paused
- Screen sleep behavior is restored after final stop, save/discard, or Recording screen cleanup
- Recording interruption behavior is handled gracefully
- App backgrounding/screen lock attempts to preserve the recording when possible
- Incoming call/audio interruptions are communicated clearly when detectable
- Interrupted recordings route to Save Recording when a recoverable file exists
- App crash does not corrupt recording
- Long recordings remain stable

---

### Playback
- Recording plays correctly
- Pause/play works
- Screen stays awake during active playback
- Screen sleep behavior is restored after playback stops or Recording Detail closes
- Scrubbing works
- Rewind/forward works
- Playback state updates correctly

---

# 2. Local File Saving

## Feature Goal
Ensure recordings are easy to find and reliably stored.

---

## Current Status

The technical spike phase has been completed enough to begin production flow refactoring.

The production save flow should create the correct filename during initial Save Recording.

Rename for already-saved recordings is deferred unless a safe native operation is validated.

---

## Done Checklist
- Recordings save locally
- Recordings save inside visible “Meeting Recall” folder
- Files appear in device file browser
- File names follow:
YYYY-MM-DD – Meeting Name.m4a
- Normal save flow records to a temporary URI first
- Final public file is created only after the user confirms the recording title
- Final public file exists before app metadata points to it
- Final public file size is greater than 0
- Final save does not read meeting-length audio into JS memory
- Final save uses a proven safe native/platform file operation
- Temporary file is deleted after final save if safe
- Duplicate naming conflicts handled
- File save failures handled gracefully
- Files persist after app restart
- User can access files outside app

---

# 3. Rename Recording

## Feature Goal
Allow users to rename recordings clearly and safely.

---

## MVP Status

Rename for already-saved recordings is deferred.

The MVP should prioritize creating the correct filename during initial save.

---

## Done Checklist
- Rename updates UI title
- Rename updates actual device file name
- Rename updates the actual file in Documents / Meeting Recall on Android
- Rename does not rely on direct file rename when direct rename is unreliable
- Post-save rename is deferred unless safe native file operations are validated
- If rename is enabled, replacement file exists before metadata updates
- If rename is enabled, replacement file size is greater than 0
- If rename is enabled, old file deletion is attempted and failures are handled clearly
- If only display-title editing is supported, UI clearly explains that the visible file name does not change
- Invalid characters handled
- Rename conflicts handled
- Rename updates instantly
- Rename survives app restart

---

# 4. Google Calendar Integration

## Feature Goal
Help users organize recordings around meetings.

---

## Done Checklist
- Google sign-in works
- Google Sign-In access token is received before Calendar API calls
- Calendar permissions handled correctly
- Today's meetings load properly
- Today's meetings are fetched from Google Calendar primary events.list
- Calendar fetch uses timeMin/timeMax for the current day, singleEvents true, and orderBy startTime
- Meeting tap pre-fills recording title
- Meeting tap starts the recording flow with the meeting title as the suggested save title
- Calendar disconnect state handled
- Calendar loading failures handled gracefully
- Calendar empty state shows:
No meetings today.
- Calendar error state shows:
Unable to load calendar events.
- Manual recording remains available when Calendar is disconnected, empty, or failed

---

# 5. Home Screen

## Feature Goal
Provide fast access to recording and previous meetings.

---

## Current Status

Recent Recordings flow has started.

Saved recording metadata is persisted locally so old recordings can appear on Home and reopen Recording Detail.

Metadata persistence should include:

- id
- title
- filename
- file URI
- duration
- created date
- folder/location

---

## Done Checklist
- Today’s Meetings displays correctly
- Recent Recordings displays correctly
- Recent Recordings loads from local metadata persistence
- Saved recordings appear after Save Recording
- Empty states exist
- Scroll performance smooth
- Recording list updates after save
- Deleted recordings disappear correctly
- Recording tap opens detail screen
- Old recording playback works from detail screen
- Actual filename remains visible on detail screen

---

# 6. Recording Detail Screen

## Feature Goal
Make playback and NotebookLM handoff effortless.

---

## Done Checklist
- Metadata displays correctly
- Playback controls work
- Waveform scrubber works
- Open NotebookLM button visible
- Share action works
- Share verifies the recording file exists before opening the native share sheet
- Share verifies file size is greater than 0 when available
- Share verifies or prepares a filename ending in .m4a before opening the native share sheet
- Shared recordings use audio/mp4 as the preferred MIME type, with audio/x-m4a as fallback if needed
- Share preserves the recording filename and .m4a extension
- Share opens the native OS share sheet for email, messaging, Drive, AirDrop on iOS later, and file sharing apps
- Unsupported content type failures on common share targets are launch blockers
- If share validation fails, user sees:
Recording file could not be found.
- If native share fails, user sees:
Unable to share recording.
- Post-save rename is not exposed unless a safe native file operation is validated
- Delete works
- Delete requires confirmation before removing anything
- Delete removes local metadata so the recording disappears from Recent Recordings
- Delete attempts to remove the actual audio file from the device
- If file deletion fails, user sees:
Recording removed from the app, but the file may still remain in your Meeting Recall folder.
- If the file is already missing, metadata cleanup still works
- Missing file state handled
- Playback errors handled gracefully

---

# 7. NotebookLM Handoff Flow

## Feature Goal
Make recordings extremely easy to upload into NotebookLM.

---

## Done Checklist
- Open NotebookLM CTA works
- Open NotebookLM validates the file before opening NotebookLM
- Recording file size is verified as greater than 0 when available
- Missing files block NotebookLM opening and show:
Recording file could not be found.
- Browser fallback works if app unavailable
- Open NotebookLM opens directly without a normal confirmation modal
- Recording Detail is the instructional source of truth
- Modals or alerts are reserved for missing file, empty file, open failure, or browser fallback
- Recording easy to find in Recents if platform behavior allows it
- Recording Detail provides fallback guidance when Recents does not show the file
- Recording Detail shows exact filename
- Recording Detail tells users to browse to Documents / Meeting Recall
- Recording accessible from file picker
- File naming easy to identify
- Flow works for both new and old recordings

---

# 8. File Accessibility

## Feature Goal
Prevent users from losing recordings or struggling to locate them.

---

## Done Checklist
- Files visible in Files/Documents app
- Documents / Meeting Recall folder exists on Android
- Folder persists
- File export prep works
- Storage permissions handled
- File picker access tested

---

# 9. Permissions

## Feature Goal
Handle permissions gracefully and clearly.

---

## Done Checklist

### Microphone
- Request appears correctly
- Permission explainer appears before OS prompt
- Explainer copy says:
Meeting Recall needs microphone access to record your meetings.
- Denied state handled
- Permanently denied state handled
- Denied recovery includes:
Microphone access is off.
- Denied recovery CTA opens OS Settings

---

### Calendar
- Permission request works
- Denied state handled
- Re-enable guidance exists

---

### Files/Storage
- Permission request works
- First-run folder setup appears after microphone permission
- Folder setup recommends Documents / Meeting Recall
- Selected folder permission is persisted where supported
- Denied state handled
- Limited access handled

---

# 9A. Onboarding

## Feature Goal
Help new users understand the product before setup.

---

## Done Checklist
- Three onboarding screens exist
- Screen 1 explains recording meetings
- Screen 2 explains NotebookLM workflow without claiming built-in AI
- Screen 3 explains local files and Meeting Recall folder
- Continue advances the flow
- Skip bypasses education screens and continues setup
- Onboarding completion persists locally
- Returning users go directly to Home

---

# 10. Settings Screen

## Feature Goal
Provide access to configuration and support.

---

## Done Checklist
- Calendar connection status visible
- Storage path visible
- Support link works
- Privacy Policy link works
- Terms link works
- Settings persist after restart

---

# 11. Error Handling

## Feature Goal
Ensure failures feel understandable and recoverable.

---

## Done Checklist
- Recording failure handled
- Save failure handled
- Missing file handled
- Playback failure handled
- Calendar failure handled
- NotebookLM open failure handled
- User receives clear next-step guidance

---

# 12. Performance

## Feature Goal
App should feel fast and stable.

---

## Done Checklist
- App launches quickly
- Recording starts quickly
- Playback responsive
- No UI freezing
- Long recording handling stable
- Memory usage reasonable

---

# 13. UX Quality Standard

## Feature Goal
App should feel calm, premium, and obvious to use.

---

## Done Checklist
- Typography hierarchy consistent
- Spacing consistent
- Only one dominant CTA per screen
- No unnecessary clutter
- Visual hierarchy clear
- Primary blue used consistently
- Recording state visually clear

---

# 14. Launch Readiness

## Feature Goal
App ready for public release.

---

## Done Checklist
- App icon complete
- Splash screen complete
- App Store screenshots complete
- App Store copy complete
- Privacy Policy hosted
- Terms hosted
- Support page hosted
- Analytics configured if applicable
- TestFlight/internal testing complete
- Android testing complete
- iOS testing complete

---

# 15. Internal Beta Readiness

## Feature Goal
Make the app safe and clear enough for real external testers.

---

## Done Checklist
- No production-facing debug panels are visible
- No spike buttons, test-file actions, or raw diagnostic output are visible
- Core flows remain available:
  - record
  - save
  - playback
  - open NotebookLM
  - share
  - delete
  - Google Calendar Today’s Meetings
- Onboarding explains the app without claiming built-in AI
- Empty states exist for no meetings and no recordings
- Calendar failures do not block manual recording
- Missing-file states block unsafe NotebookLM/share actions
- User-facing errors avoid stack traces and technical details
- Dev-only logging stays behind `__DEV__`
- Screenshot/sample data mode stays gated behind `EXPO_PUBLIC_SCREENSHOT_MODE`

---

## Tester Observation Goals
- Do testers understand that Meeting Recall records, while NotebookLM creates insights?
- Do testers trust that their recording saved?
- Can testers find the file in Documents / Meeting Recall?
- Do testers understand what to do after tapping Open NotebookLM?
- Does the floating record CTA feel obvious and thumb-friendly?
- Do any screens feel unfinished, crowded, or confusing?

---

## Known MVP Limitations
- Recording works best while Meeting Recall stays open and active.
- True background recording is not supported until native background behavior is validated.
- Post-save file rename is deferred; the correct filename should be created during initial save.
- NotebookLM app opening depends on Android/iOS URL routing. Browser fallback is acceptable.
- File picker Recents visibility is not guaranteed. Users should browse to Documents / Meeting Recall.
- iOS file and background behavior still require real-device validation before public launch.

---

# Final Success Definition

Meeting Recall is considered ready when a non-technical user can:

1. Open the app
2. Record a meeting
3. Save it
4. Find it later
5. Open NotebookLM
6. Upload the recording without confusion
7. Get AI insights with minimal friction
