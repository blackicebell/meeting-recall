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
3. View splash screen
4. Complete onboarding
5. Accept or deny permissions

## Expected Result
- App opens without crash
- Onboarding is readable
- Buttons are visible
- Permission copy is clear
- User lands on Home screen

---

# 2. Microphone Permission Test

## Steps
1. Open app fresh
2. Attempt to record
3. Grant microphone permission

## Expected Result
- Permission prompt appears
- Recording starts after permission granted
- No crash or confusing state

---

# 3. Microphone Denied Test

## Steps
1. Deny microphone permission
2. Try to record

## Expected Result
- User sees clear explanation
- App does not crash
- User knows how to re-enable permission

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
- Waveform animates
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
"Keep Meeting Recall open while recording."
- Supporting copy explains:
"Locking your screen or switching apps may stop the recording."
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
- Old filename no longer exists if platform behavior allows verification
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
4. Confirm the app prepares the file first
5. Follow helper screen
6. Upload file in NotebookLM

## Expected Result
- NotebookLM opens
- User understands what to do
- Helper shows exact filename
- Helper tells user to look in Documents / Meeting Recall if Recents does not show the file
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
6. Confirm the app prepares the file first
7. Upload file in NotebookLM

## Expected Result
- Old recording is just as easy to use
- File is accessible
- File name is recognizable
- Helper shows exact filename and Documents / Meeting Recall fallback
- User does not need to search extensively if Recents fails

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
3. Share to email or Drive

## Expected Result
- Native share sheet opens
- Correct file attaches
- File name is preserved

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

---

# 16. Calendar Recording Test

## Steps
1. Tap a calendar event
2. Record meeting
3. Stop and save

## Expected Result
- Recording title uses calendar event name
- File name follows date-first format
- Recording appears in Recent Recordings

---

# 17. Calendar Failure Test

## Steps
1. Disconnect internet
2. Open Home
3. Try to load calendar events

## Expected Result
- App does not crash
- Clear message appears
- Manual recording still works

---

# 18. Delete Test

## Steps
1. Open recording detail
2. Tap Delete
3. Confirm deletion

## Expected Result
- Confirmation appears
- Recording removed from app
- File removed from device if intended
- Recent Recordings updates

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

# 21. Visual QA Test

## Check
- Typography hierarchy
- Spacing consistency
- Button visibility
- Recording screen clarity
- CTA hierarchy
- Empty states
- Error states

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
