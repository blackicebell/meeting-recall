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
- current display name
- actual file name
- prepared NotebookLM file URI
- prepare status
- rename status
- errors

Added actions:

- Copy to Meeting Recall Folder
- Share File
- Test Original File Exists
- Test Exported File Exists
- Test Rename Actual File
- Prepare for NotebookLM
- Test Prepared NotebookLM File Exists
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
4. Android Storage Access Framework asks the user to choose a folder, starting at Documents when possible.
5. App attempts to create a "Meeting Recall" folder inside the selected folder.
6. App creates a named audio file inside that folder.
7. App reads the app-local recording as base64 and writes it into the SAF-created file.
8. App displays the copied file URI.
9. App can test whether the exported file exists.
10. App can open the native share sheet.
11. App can open NotebookLM.

Important:

This requires real Android device testing. The implementation compiles, but file picker visibility and Recents behavior must be validated on device.

Real device observation:

- Android does not allow selecting the phone root, such as "Pixel 9", as the export destination.
- The system shows "Can't use this folder" at the root for privacy reasons.
- The spike should guide the user to choose a writable parent folder such as Documents.
- The app then attempts to create Meeting Recall inside that selected parent folder.
- A first implementation using StorageAccessFramework.copyAsync created a visible file that could not be played.
- The spike now uses base64 read/write for the SAF export path because Android SAF destinations are content URIs, not normal file paths.
- Real Android testing confirmed recordings can save to Documents / Meeting Recall.
- Real Android testing found the recording was not easy to find from NotebookLM's Recents/file picker.
- Recents visibility should not be treated as guaranteed.
- The reliable fallback is to show the exact filename and tell the user to look in Documents / Meeting Recall.

---

# Prepare for NotebookLM

Implemented behavior:

1. Verify a recording/export file exists.
2. Require a Meeting Recall folder URI from the copy/export step.
3. Preserve the product filename format:
YYYY-MM-DD – Meeting Name.m4a
4. Attempt to improve discoverability by creating a fresh export-ready copy in Documents / Meeting Recall.
5. Store and display the prepared file URI.
6. Verify the prepared file exists.
7. Open NotebookLM.

Important:

The spike does not claim it can force Android or NotebookLM Recents visibility.

If Recents does not show the file, the helper UX must tell users:

- the exact filename
- the save location: Documents / Meeting Recall
- to browse to that folder from the file picker

---

# Rename Validation

Implemented spike behavior:

1. Test action updates the app display name.
2. Test action creates a new actual file using the new display name.
3. Test action copies audio bytes into the new file.
4. Test action deletes the old exported file.
5. Test action verifies the new file exists.
6. Test action verifies the old file no longer exists if possible.
7. Invalid filename characters are sanitized.
8. Duplicate file creation is handled by adding a safe suffix when needed.

Required product behavior:

Renaming in the app must rename the actual file in Documents / Meeting Recall because NotebookLM upload happens through the system file picker.

Still needs real-device validation.

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
- Android SAF export uses binary-safe base64 read/write instead of copyAsync
- Prepare for NotebookLM creates a fresh export-ready copy
- Rename test updates display name and attempts actual file replacement

---

# What Does Not Work Yet

Not validated yet:

- whether Android copied file appears in the system file picker
- whether the file appears in Recents reliably
- whether NotebookLM can select the copied/prepared file during upload
- whether the file name is preserved exactly in all Android picker surfaces
- whether creating "Meeting Recall" inside every user-selected folder succeeds reliably
- whether base64 export produces a playable .m4a on every target Android document provider
- whether permissions persist after app restart
- whether duplicate filenames are handled correctly
- whether rename synchronization works across app restart
- iOS file accessibility

---

# File Picker Visibility

Status:

- Needs real Android testing.

The spike uses Android SAF so the exported file should be user-accessible in the selected location, but this must be proven by opening NotebookLM and selecting the file through the upload picker.

---

# Recents Visibility

Status:

- Real Android testing found Recents/file picker discoverability is not reliable yet.

The spike may or may not cause the exported/prepared file to appear in Android Recents. This depends on how Android indexes SAF-created files and how NotebookLM invokes the system picker.

This remains a product-critical question.

Do not claim Meeting Recall can force Recents visibility unless future testing proves it.

Reliable UX fallback:

- show exact filename
- show Documents / Meeting Recall as the location
- tell users to browse there from NotebookLM's picker

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
- Prepare for NotebookLM is implemented as a fresh export-ready copy.
- Uploading the prepared file into NotebookLM is not yet confirmed.

Required real-device test:

1. Record a short test file.
2. Copy it to the Meeting Recall folder.
3. Tap Prepare for NotebookLM.
4. Start source upload in NotebookLM.
5. Use the Android file picker.
6. If Recents fails, browse to Documents / Meeting Recall.
7. Confirm the prepared recording can be found by exact filename.
8. Confirm NotebookLM accepts the upload.

---

# Risks

## Folder Selection Friction

Android SAF requires user folder selection. This may feel less automatic than the desired final UX.

The phone root cannot be selected. Users must choose a writable parent folder such as Documents.

## Meeting Recall Folder Creation

The app attempts to create a Meeting Recall folder inside the selected parent folder.

If folder creation fails because the folder already exists, the spike falls back to the selected folder. This is acceptable for testing but not final product behavior.

## SAF Copy Method

StorageAccessFramework.copyAsync was not reliable for exporting from an app-local recording URI into an Android SAF content URI.

The spike now uses:

- readAsStringAsync with base64 encoding
- StorageAccessFramework.writeAsStringAsync with base64 encoding

This should preserve the audio bytes, but it still needs real-device validation by playing the exported file.

## Recents Is Unproven

Appearing in Recents is not guaranteed yet.

## Duplicate Filenames

The spike attempts to handle duplicate filenames by adding a safe suffix.

This still needs real Android validation.

## Rename Sync

Rename synchronization is now represented in the spike but still needs real Android validation.

The required final behavior is:

- app display name updates
- actual file name in Documents / Meeting Recall updates
- old file is removed
- new file remains playable
- NotebookLM can find the renamed file

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
4. Select Documents or another writable user-visible folder. Do not select the phone root.
5. Confirm a Meeting Recall folder is created or selected.
6. Confirm the exported file exists.
7. Open Android Files and find the recording.
8. Play the exported file from Android Files.
9. Tap Test Rename Actual File.
10. Confirm the renamed file exists.
11. Confirm the old file no longer exists if applicable.
12. Play the renamed file from Android Files.
13. Tap Prepare for NotebookLM.
14. Try uploading the prepared file from NotebookLM.
15. If Recents does not show the file, browse to Documents / Meeting Recall.
16. Confirm whether NotebookLM accepts the prepared file.
17. Confirm whether the filename is preserved.

After Android validation, update this document with actual device results.

Then run an iOS-specific file accessibility spike.
