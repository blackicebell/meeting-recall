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
- Recording survives app minimize/backgrounding
- Recording interruption behavior is handled
- Incoming call interruptions handled gracefully
- App crash does not corrupt recording
- Long recordings remain stable

---

### Playback
- Recording plays correctly
- Pause/play works
- Scrubbing works
- Rewind/forward works
- Playback state updates correctly

---

# 2. Local File Saving

## Feature Goal
Ensure recordings are easy to find and reliably stored.

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
- Calendar permissions handled correctly
- Today's meetings load properly
- Meeting tap pre-fills recording title
- Calendar disconnect state handled
- Calendar loading failures handled gracefully

---

# 5. Home Screen

## Feature Goal
Provide fast access to recording and previous meetings.

---

## Done Checklist
- Today’s Meetings displays correctly
- Recent Recordings displays correctly
- Empty states exist
- Scroll performance smooth
- Recording list updates after save
- Deleted recordings disappear correctly
- Recording tap opens detail screen

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
- Rename works
- Delete works
- Missing file state handled
- Playback errors handled gracefully

---

# 7. NotebookLM Handoff Flow

## Feature Goal
Make recordings extremely easy to upload into NotebookLM.

---

## Done Checklist
- Open NotebookLM CTA works
- Open NotebookLM prepares the file before opening NotebookLM
- Browser fallback works if app unavailable
- Helper/interstitial screen appears
- Recording easy to find in Recents if platform behavior allows it
- Helper provides fallback guidance when Recents does not show the file
- Helper shows exact filename
- Helper tells users to browse to Documents / Meeting Recall
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
- Denied state handled
- Permanently denied state handled

---

### Calendar
- Permission request works
- Denied state handled
- Re-enable guidance exists

---

### Files/Storage
- Permission request works
- Denied state handled
- Limited access handled

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

# Final Success Definition

Meeting Recall is considered ready when a non-technical user can:

1. Open the app
2. Record a meeting
3. Save it
4. Find it later
5. Open NotebookLM
6. Upload the recording without confusion
7. Get AI insights with minimal friction
