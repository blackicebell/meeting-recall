# Meeting Recall QA Test Plan

## Purpose

This document defines the testing plan for Meeting Recall before public launch.

The goal is to ensure the app is:
- stable
- understandable
- reliable
- easy to use
- ready for real users

Meeting Recall should not ship until the core recording, saving, file access, and NotebookLM handoff flows are tested thoroughly.

---

# Testing Philosophy

Test like a real user, not like a developer.

A successful test means:
- the user knows what to do
- the recording does not get lost
- the file is easy to find
- NotebookLM handoff feels clear
- no technical explanation is needed

---

# Current MVP Refactor Status

The spike phase has been completed enough to start production implementation.

QA should now focus first on the production recording flow:

Record → Stop → Save Recording → Verify file → Playback → Open NotebookLM

Rename for already-saved recordings is deferred unless a safe native file operation is validated later.

The correct filename should be created during initial Save Recording.

Recent Recordings flow is now testable:

- saved recording metadata persists locally
- saved recordings appear on Home
- tapping an old recording opens Recording Detail
- playback should work from the old recording detail screen

---

# Priority Testing Order

1. Recording reliability
2. File saving and access
3. Old recording NotebookLM handoff
4. Rename behavior
5. Playback
6. Google Calendar naming
7. Permissions
8. Error states
9. Visual polish

---

# Devices to Test

## iOS
- Latest iPhone model available
- Older iPhone if possible

## Android
- Samsung Galaxy device
- Google Pixel device if possible
- One older Android device if possible

---

# 1. First Launch Test

## Steps
1. Install app
2. Open app
3. View onboarding screen 1
4. Tap Continue through all three onboarding screens
5. Review microphone explainer
6. Accept microphone permission
7. Choose or confirm Meeting Recall folder

## Expected Result
- App opens without crash
- Onboarding has three readable screens
- Screen 1 says:
Record meetings. Recall everything.
- Screen 2 explains NotebookLM upload workflow
- Screen 3 explains local Meeting Recall folder storage
- Buttons are visible
- Permission copy is clear
- Folder setup recommends Documents / Meeting Recall
- User lands on Home screen
- On next app launch, user goes directly to Home

---

# 1A. Onboarding Skip Test

## Steps
1. Install app fresh
2. Open app
3. Tap Skip during onboarding

## Expected Result
- App skips the education screens
- App still shows microphone setup
- App still guides user to folder setup
- App does not mark setup complete until setup is finished

---

# 2. Microphone Permission Test

## Steps
1. Open app fresh
2. Complete or skip onboarding screens
3. Review microphone explainer
4. Tap Allow Microphone Access
5. Grant microphone permission

## Expected Result
- Explainer appears before OS prompt
- Permission prompt appears
- Folder setup appears after permission granted
- No crash or confusing state

---

# 3. Microphone Denied Test

## Steps
1. Open app fresh
2. Complete or skip onboarding screens
3. Tap Allow Microphone Access
4. Deny microphone permission

## Expected Result
- User sees:
Microphone access is off.
- User sees:
Turn it on in Settings to record meetings.
- Open Settings CTA appears
- App does not crash
- User knows how to re-enable permission

---

# 3A. Folder Setup Test

## Steps
1. Complete onboarding
2. Grant microphone permission
3. Tap Choose Folder
4. Select Documents / Meeting Recall or create/select an equivalent visible folder
5. Continue to Home
6. Close and reopen app

## Expected Result
- Folder picker appears
- Selected folder permission is persisted where supported
- User lands on Home after folder setup
- Returning user goes directly to Home

---

# 4. Basic Recording Test

## Steps
1. Tap Record
2. Record for 30 seconds
3. Pause
4. Resume
5. Stop

## Expected Result
- Timer works
- Waveform animates subtly and feels alive during active recording
- Waveform motion is not distracting
- Pause works
- Resume works
- Stop opens Save bottom sheet

---

# 5. Long Recording Test

## Steps
1. Start recording
2. Record for 30–60 minutes
3. Stop
4. Save
5. Play back

## Expected Result
- Recording does not fail
- File saves correctly
- Playback works
- App remains responsive

---

# 6. Background Recording Test

## Steps
1. Start recording
2. Minimize app
3. Wait 2–5 minutes
4. Return to app
5. Stop and save

## Expected Result
- For MVP, recording may stop because true background recording is not currently supported
- App handles background state gracefully
- File is not corrupted
- If recording is interrupted, the app attempts to stop and preserve the recording
- User is taken to Save Recording when a recoverable recording file exists
- Message is calm:
“Recording was interrupted.”

---

# 6A. Screen Lock Recording Test

## Steps
1. Start recording
2. Lock the phone screen
3. Wait 1-2 minutes
4. Unlock the phone
5. Return to Meeting Recall
6. Stop and save if recording is still active

## Expected Result
- For MVP, user-facing copy clearly warns that recordings require the app to stay open.
- If recording stops, the app explains what happened calmly.
- App does not crash.
- Any partial recording is preserved if possible.

---

# 6B. App Switching Recording Test

## Steps
1. Start recording
2. Switch to another app
3. Wait 1-2 minutes
4. Return to Meeting Recall
5. Stop and save if recording is still active

## Expected Result
- For MVP, user-facing copy clearly warns that switching apps may stop recording.
- If recording stops, the app explains what happened calmly.
- App does not crash.
- Any partial recording is preserved if possible.

---

# 6C. Recording Limitation Copy Test

## Steps
1. Start a recording
2. Review visible recording guidance
3. Attempt to lock the screen or switch apps

## Expected Result
- App includes clear copy such as:
"For best recording results, keep Meeting Recall open while recording."
- Copy is calm, short, and visible before users accidentally lose recording time.

---

# 7. Save Recording Test

## Steps
1. Stop recording
2. Review Save bottom sheet
3. Save with default name

## Expected Result
- Default name follows:
YYYY-MM-DD – Meeting Name.m4a
- Save screen uses filename/location affordances instead of a long explanatory paragraph
- Final filename is clearly visible
- "Saves to Meeting Recall folder" is visible as a small location row or metadata chip
- App creates the final public file only after Save Recording is confirmed
- Final file is created in Documents / Meeting Recall
- Final file exists
- Final file size is greater than 0
- App metadata points to the final public file URI
- Save does not trigger low-memory warnings
- Save does not use JS/base64 copy for meeting-length recordings
- Temporary recording file is deleted if safe
- Recording appears in Recent Recordings
- File saves locally

---

# 8. File Location Test

## Steps
1. Save a recording
2. Open device file browser
3. Find Documents / Meeting Recall folder on Android
4. Locate recording

## Expected Result
- Documents / Meeting Recall folder exists on Android
- Recording is visible
- File name is readable
- File is accessible outside the app

---

# 9. Rename Test

## Steps
1. Open recording detail
2. Rename recording
3. Save new name
4. Check app UI
5. Check file browser

## Expected Result
- UI title updates
- Actual file name updates in Documents / Meeting Recall
- If post-save rename is enabled, it uses a proven safe native file operation
- If post-save rename is enabled, replacement file exists
- If post-save rename is enabled, replacement file size is greater than 0
- If post-save rename is enabled, app metadata points to the replacement file URI
- If post-save rename is enabled, old filename no longer exists if platform behavior allows verification
- If post-save rename is deferred for MVP, the app clearly communicates that only the display title changes
- Rename/copy attempts do not trigger low-memory warnings
- Rename persists after app restart

---

# 10. Duplicate Filename Test

## Steps
1. Create two recordings with same meeting title and date
2. Save both

## Expected Result
- App handles duplicate names safely
- No file is overwritten unintentionally
- Both recordings remain accessible

---

# 11. Playback Test

## Steps
1. Open saved recording
2. Play
3. Pause
4. Scrub waveform
5. Use rewind/forward

## Expected Result
- Audio plays correctly
- Controls respond correctly
- Scrubbing works
- UI stays in sync

---

# 12. New Recording NotebookLM Flow

## Steps
1. Record meeting
2. Save
3. Tap Open NotebookLM
4. Confirm the app verifies the file exists
5. Confirm Meeting Recall opens https://notebooklm.google.com directly
6. Confirm Android opens the NotebookLM app if the OS supports that app link, or opens the browser otherwise
7. Confirm NotebookLM opens immediately without a confirmation modal
8. Upload file in NotebookLM

## Expected Result
- NotebookLM app opens only when the OS routes the NotebookLM URL to the installed app
- NotebookLM website/browser fallback is acceptable
- The button label is “Open NotebookLM,” not “Open NotebookLM app”
- User understands what to do
- Recording Detail shows exact filename
- Recording Detail uses short guidance:
When NotebookLM opens, tap Add Source and choose this file.
- Recording Detail tells user the file is in Documents / Meeting Recall
- Recording is easy to find by browsing to Documents / Meeting Recall
- Upload works

---

# 13. Old Recording NotebookLM Flow

## Steps
1. Save a recording
2. Close app
3. Return later
4. Open old recording
5. Tap Open NotebookLM
6. Confirm the app verifies the file exists
7. Confirm Meeting Recall opens https://notebooklm.google.com directly
8. Confirm Android opens the NotebookLM app if the OS supports that app link, or opens the browser otherwise
9. Confirm NotebookLM opens immediately without a confirmation modal
10. Upload file in NotebookLM

## Expected Result
- Old recording is just as easy to use
- NotebookLM app opening works for old recordings only if OS app-link routing supports it
- Website/browser fallback works for old recordings
- File is accessible
- File name is recognizable
- Recording Detail shows exact filename and Documents / Meeting Recall fallback
- User does not need to search extensively if Recents fails

---

# 13B. NotebookLM Missing File Block Test

## Steps
1. Save a recording
2. Delete the audio file from device storage if possible
3. Return to the app
4. Open the recording detail screen
5. Tap Open NotebookLM

## Expected Result
- App does not open NotebookLM
- Message appears:
Recording file could not be found.
- User remains in the app
- App does not crash

---

# 13A. NotebookLM Recents Fallback Test

## Steps
1. Save a recording to Documents / Meeting Recall
2. Tap Open NotebookLM
3. Attempt upload from NotebookLM
4. Check whether file appears in Recents
5. If it does not appear, browse to Documents / Meeting Recall
6. Select the exact filename shown in the helper

## Expected Result
- App does not promise Recents visibility
- User has exact filename
- User has clear folder fallback
- Upload succeeds from Documents / Meeting Recall

---

# 14. Share Test

## Steps
1. Open recording detail
2. Tap Share
3. Confirm native OS share sheet opens
4. Share to email, messaging app, Google Drive, or another file-sharing target
5. Confirm the shared attachment uses the .m4a extension
6. Confirm the shared content type is treated as audio/mp4 when visible

## Expected Result
- Native share sheet opens
- Correct file attaches
- File name is preserved
- .m4a extension is preserved
- File size is greater than 0
- Common share targets do not report unsupported content type
- Open NotebookLM remains the primary visible action
- Share remains a secondary visible action

---

# 6D. Unexpected Recording Stop Test

## Steps
1. Start recording
2. Trigger an interruption if possible:
   - incoming call
   - screen lock
   - app switch
   - OS audio interruption
3. Return to Meeting Recall

## Expected Result
- User sees calm interruption messaging if detectable:
“Recording was interrupted.”
- App attempts to preserve the recording
- If a file exists, user can save it
- If save preparation fails, app explains clearly without technical language
- No silent failure occurs

---

# 14C. Share Content Type Test

## Steps
1. Save a short recording
2. Open recording detail
3. Tap Share
4. Share to email
5. Share to Google Drive
6. Share to laptop/nearby share if available
7. Share to a messaging app if available

## Expected Result
- Shared file keeps the expected YYYY-MM-DD - Meeting Name.m4a filename
- Shared MIME/content type is audio/mp4 where the target exposes it
- The receiving app/device can recognize the file as audio
- Unsupported content type errors do not occur on common share targets

---

# 14A. Share Missing File Test

## Steps
1. Save a recording
2. Delete the audio file from device storage if possible
3. Return to Meeting Recall
4. Open the old recording detail
5. Tap Share

## Expected Result
- Native share sheet does not open
- Message appears:
Recording file could not be found.
- App does not crash

---

# 14B. Share Failure Test

## Steps
1. Open recording detail
2. Tap Share
3. Simulate or observe native share failure if possible

## Expected Result
- Message appears:
Unable to share recording.
- User remains on Recording Detail

---

# 15. Google Calendar Connect Test

## Steps
1. Open Settings
2. Connect Google Calendar
3. Grant permission
4. Return to Home

## Expected Result
- Calendar connects successfully
- Today’s meetings appear
- App does not request unnecessary permissions
- Access token is received before Calendar API fetch
- No temporary Google Sign-In debug controls are visible
- No Calendar Fetch Debug panel is visible on Home
- If no events exist, Home shows:
No meetings today.

---

# 16. Calendar Recording Test

## Steps
1. Connect Google Calendar
2. Confirm Today’s Meetings appears on Home
3. Tap a calendar event
4. Record meeting
5. Stop and save

## Expected Result
- Recording title uses calendar event name
- File name follows date-first format
- Recording appears in Recent Recordings
- Calendar meeting title remains editable before save
- Final filename remains:
YYYY-MM-DD – Meeting Name.m4a

---

# 17. Calendar Failure Test

## Steps
1. Disconnect internet
2. Open Home
3. Try to load calendar events

## Expected Result
- App does not crash
- Clear message appears
- Message appears:
Unable to load calendar events.
- Manual recording still works

---

# 17A. No Meetings Today Test

## Steps
1. Connect Google Calendar using an account with no events today
2. Return to Home

## Expected Result
- Today’s Meetings section remains calm
- Message appears:
No meetings today.
- Manual recording still works

---

# 18. Delete Test

## Steps
1. Open recording detail
2. Confirm Open NotebookLM, Share, playback controls, and trash-icon delete access are visible without scrolling
3. Tap the trash icon
4. Confirm the dialog says:
Delete recording?
5. Confirm the body says:
This removes the recording from Meeting Recall. If possible, the audio file will also be deleted from your device.
6. Tap Cancel
7. Confirm the recording remains
8. Tap the trash icon again
9. Tap Delete Recording in the confirmation

## Expected Result
- Delete is available through a quiet top-right trash icon
- No More menu appears when Delete is the only item
- Confirmation appears
- Recording removed from app
- App attempts to remove the audio file from device storage
- Recent Recordings updates
- User returns to Home

---

# 18C. Recording Detail Above-Fold Test

## Steps
1. Open a saved recording detail screen
2. Check the first visible screen without scrolling

## Expected Result
- Compact "Ready for NotebookLM" status chip is visible
- Recording title is the hero
- Duration/metadata is visible
- Playback controls are visible
- Waveform/progress area is visible if present
- Open NotebookLM is visible as the primary full-width CTA
- Share is visible near Open NotebookLM
- Exact filename is visible
- Save location remains Documents / Meeting Recall
- NotebookLM guidance appears as one short line on Recording Detail
- Open NotebookLM opens directly after file validation without a confirmation modal
- Trash-icon delete access is visible
- Delete is not visually dominant on the main screen
- Back uses a clear top-left chevron-style icon
- Playback controls use clear play and stop/pause icon states with at least 44px touch targets

---

# 18D. Small Device Recording Detail Test

## Steps
1. Open a saved recording detail screen on a small Android device or narrow emulator
2. Check whether core actions remain visible without scrolling

## Expected Result
- Open NotebookLM remains visible
- Share remains visible
- Trash-icon delete access remains visible
- Only non-core helper text may be lost or require scrolling

---

# 18A. Delete File Failure Test

## Steps
1. Open recording detail
2. Tap the trash icon
3. Confirm deletion
4. Simulate or observe a failed device file deletion if possible

## Expected Result
- Recording metadata is removed from Meeting Recall
- Recording disappears from Recent Recordings
- User sees:
Recording removed from the app, but the file may still remain in your Meeting Recall folder.

---

# 18B. Delete Missing File Cleanup Test

## Steps
1. Save a recording
2. Delete the audio file from Android Files if possible
3. Return to Meeting Recall
4. Open the old recording detail
5. Tap the trash icon
6. Confirm deletion

## Expected Result
- Metadata cleanup still works
- Recording disappears from Recent Recordings
- App explains the audio file was already missing
- App does not crash

---

# 19. Missing File Test

## Steps
1. Delete a recording file from device file browser
2. Open app
3. Tap that recording if still listed

## Expected Result
- App handles missing file gracefully
- Message appears:
“Recording file could not be found.”
- App does not crash

---

# 20. App Restart Test

## Steps
1. Create recordings
2. Rename one
3. Close app completely
4. Reopen app

## Expected Result
- Recordings remain listed
- Renamed title persists
- Files remain accessible

---

# 20A. Recent Recordings Persistence Test

## Steps
1. Record a short test recording
2. Save it
3. Return Home
4. Confirm it appears under Recent Recordings
5. Close and reopen app
6. Return Home
7. Tap the saved recording
8. Play it from Recording Detail

## Expected Result
- Recording appears on Home after save
- Recording remains listed after app restart
- Tapping the row opens Recording Detail
- Actual filename is visible
- Folder location is visible
- Playback works

---

# 21. Visual QA Test

## Check
- Typography hierarchy
- Spacing consistency
- Button visibility
- Recording screen clarity
- CTA hierarchy
- Empty states
- Error states
- Settings uses a clear gear icon
- Delete uses a direct trash icon with one confirmation
- Playback controls use clear, centered icons
- Preferred icon direction remains Microsoft Fluent where available, otherwise Google Material style
- Save Recording avoids wordy helper copy
- Active recording waveform animation is smooth and premium
- Recording Detail uses compact status chip instead of large redundant ready headings
- NotebookLM handoff opens directly, with modals or alerts reserved for errors and fallback states
- Exact filename remains visible before opening NotebookLM

## Expected Result
- App feels calm and premium
- Open NotebookLM is clearly primary
- Share does not compete visually
- No clutter

---

# 22. Non-Technical User Test

## Steps
Give app to someone unfamiliar with it.

Ask them to:
1. Record a meeting
2. Save it
3. Open NotebookLM
4. Find and upload recording

## Expected Result
They should complete the task without explanation.

If they ask:
- “Where is the file?”
- “What do I do next?”
- “Which button do I press?”
then the UX needs improvement.

---

# Launch Blockers

The app should not launch if:

- Recordings fail or corrupt
- Files cannot be found outside app
- Rename does not update actual file
- Old recordings cannot be uploaded easily
- NotebookLM handoff confuses users
- Permissions cause dead ends
- App crashes during core flows

---

# Future Enhancement Notes

## True Background Recording

Real Android device testing confirmed the current spike does not continue recording when the screen is locked or when switching apps.

For MVP, this is a known limitation that must be communicated clearly.

Future enhancement:
- investigate native background recording support
- validate iOS background audio requirements
- validate Android foreground service requirements
- test lock screen and app switching behavior across real devices

---

# Final QA Success Definition

Meeting Recall is ready when:

A non-technical user can record a meeting, save it, return later, open NotebookLM, find the correct recording, and upload it without help.
