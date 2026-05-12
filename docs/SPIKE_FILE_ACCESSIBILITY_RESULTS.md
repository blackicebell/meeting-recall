# Meeting Recall File Accessibility Spike Results

## Purpose

This document captures results from SPIKE 2: Local File Accessibility.

The goal is to validate whether recorded audio files can be saved or copied to a user-accessible "Meeting Recall" folder and found later from the device file picker for NotebookLM upload.

This spike is critical because Meeting Recall succeeds only if users can find recordings after saving them.

---

# Library / System Used

Used:

- expo-file-system
- expo-file-system Storage Access Framework on Android
- expo-sharing
- React Native Linking for opening NotebookLM

Versions:

- expo-file-system ~19.0.22
- expo-sharing ~14.0.8

Reason:

- Android Storage Access Framework is the clearest Expo-supported way to ask the user for access to a user-visible folder.
- expo-sharing validates native share-sheet behavior.
- React Native Linking validates opening NotebookLM in app/browser.

---

# What Was Implemented

The existing technical RecordingScreen now includes file accessibility spike actions.

After recording stops, the screen can show:

- original recording URI
- exported/copied file URI
- Meeting Recall folder URI
- file name
- original file existence status
- exported file existence status
- copy/export status
- share status
- NotebookLM open status
- errors

Added actions:

- Copy to Meeting Recall Folder
- Share File
- Test Original File Exists
- Test Exported File Exists
- Open NotebookLM

---

# File Naming

The spike uses:

YYYY-MM-DD – Test Recording.m4a

This matches the product file naming rule.

---

# Android Behavior

Implemented Android-first behavior:

1. Record audio with expo-audio.
2. Stop recording and capture the original app-local file URI.
3. User taps "Copy to Meeting Recall Folder".
4. Android Storage Access Framework asks the user to choose a folder.
5. App attempts to create a "Meeting Recall" folder inside the selected folder.
6. App creates a named audio file inside that folder.
7. App copies the recorded audio into the SAF-created file.
8. App displays the copied file URI.
9. App can test whether the exported file exists.
10. App can open the native share sheet.
11. App can open NotebookLM.

Important:

This requires real Android device testing. The implementation compiles, but file picker visibility and Recents behavior must be validated on device.

---

# iOS Behavior

Untested.

This spike is Android-first.

iOS still needs separate validation for:

- Files app visibility
- app sandbox limitations
- share-sheet behavior
- export/copy behavior
- NotebookLM upload discoverability

---

# What Works

Confirmed in code/typecheck:

- expo-file-system installed with Expo SDK 54-compatible version
- expo-sharing installed with Expo SDK 54-compatible version
- TypeScript compiles successfully
- Original recording URI can be checked with FileSystem.getInfoAsync
- Android SAF APIs are available
- Exported/copied file URI can be displayed
- Exported/copied file existence can be checked
- Native share sheet API is available
- NotebookLM can be opened with Linking

---

# What Does Not Work Yet

Not validated yet:

- whether Android copied file appears in the system file picker
- whether the file appears in Recents
- whether NotebookLM can select the copied file during upload
- whether the file name is preserved exactly in all Android picker surfaces
- whether creating "Meeting Recall" inside every user-selected folder succeeds reliably
- whether permissions persist after app restart
- whether duplicate filenames are handled correctly
- iOS file accessibility

---

# File Picker Visibility

Status:

- Needs real Android testing.

The spike uses Android SAF so the exported file should be user-accessible in the selected location, but this must be proven by opening NotebookLM and selecting the file through the upload picker.

---

# Recents Visibility

Status:

- Needs real Android testing.

The spike may or may not cause the exported file to appear in Android Recents. This depends on how Android indexes SAF-created files and how NotebookLM invokes the system picker.

This remains a product-critical question.

---

# File Naming Preservation

Status:

- Implemented in code.
- Needs real Android verification.

Expected filename:

YYYY-MM-DD – Test Recording.m4a

Risk:

Some Android document providers may display or encode names differently.

---

# NotebookLM Upload

Status:

- Opening NotebookLM is implemented.
- Uploading the exported file into NotebookLM is not yet confirmed.

Required real-device test:

1. Record a short test file.
2. Copy it to the Meeting Recall folder.
3. Tap Open NotebookLM.
4. Start source upload in NotebookLM.
5. Use the Android file picker.
6. Confirm the copied recording can be found.
7. Confirm the copied recording can be selected.
8. Confirm NotebookLM accepts the upload.

---

# Risks

## Folder Selection Friction

Android SAF requires user folder selection. This may feel less automatic than the desired final UX.

## Meeting Recall Folder Creation

The app attempts to create a Meeting Recall folder inside the selected parent folder.

If folder creation fails because the folder already exists, the spike falls back to the selected folder. This is acceptable for testing but not final product behavior.

## Recents Is Unproven

Appearing in Recents is not guaranteed yet.

## Duplicate Filenames

The spike does not handle duplicate filenames yet.

## iOS Is Untested

iOS file accessibility remains a separate high-risk area.

## App-Local URI Is Not Enough

The original recording URI is app-local. The product cannot rely only on that URI because users need to find recordings from outside the app.

---

# Recommended Next Step

Run this spike on a real Android device.

Test:

1. Record a short file.
2. Confirm original file exists.
3. Tap "Copy to Meeting Recall Folder".
4. Select a user-visible folder such as Documents.
5. Confirm a Meeting Recall folder is created or selected.
6. Confirm the exported file exists.
7. Open Android Files and find the recording.
8. Tap Share File and confirm the native share sheet attaches the recording.
9. Tap Open NotebookLM.
10. Try uploading the file from NotebookLM.
11. Confirm whether the file appears in Recents.
12. Confirm whether the filename is preserved.

After Android validation, update this document with actual device results.

Then run an iOS-specific file accessibility spike.
