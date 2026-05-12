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
- rename input
- old rename filename
- new rename filename
- old rename URI/path
- new rename URI/path
- storage method used
- app documentDirectory
- app cacheDirectory
- selected SAF folder URI
- SAF usage status
- folder persistence status
- errors

Added actions:

- Copy to Meeting Recall Folder
- Choose Meeting Recall Folder
- Share File
- Test Original File Exists
- Test Exported File Exists
- Test Rename Actual File
- Rename text input
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
- Real Android testing found the Meeting Recall folder was not easy to find manually in Android Files/Documents after the app reported a save.
- This means the save location may be app-internal, hidden by Android scoped storage, provider-specific, or not user-obvious enough.
- Recents visibility should not be treated as guaranteed.
- The reliable fallback is to show the exact filename and tell the user to look in Documents / Meeting Recall.

---

# Current Android Visibility Issue

Observed result:

- The app says it saves to Documents / Meeting Recall.
- The folder was not findable manually in Android Files/Documents.

Conclusion:

Do not claim the file is saved to a user-accessible Documents folder unless it is actually visible in Android Files and selectable from NotebookLM upload.

The spike now displays the exact storage method and URI so we can tell the difference between:

- app internal directory
- cache directory
- documentDirectory
- Storage Access Framework URI
- public/shared folder behavior

---

# Storage Method Debugging

The spike now shows:

- original storage method
- app documentDirectory
- app cacheDirectory
- selected SAF folder URI
- selected folder storage method
- saved/exported file URI
- prepared NotebookLM file URI
- SAF used true/false
- file exists result
- copy success/failure

This is meant to prevent a false positive where the app has a valid URI but the user cannot locate the file.

---

# Choose Meeting Recall Folder

The spike now includes a separate:

Choose Meeting Recall Folder

action.

This uses Android Storage Access Framework and asks the user to select a real visible folder.

Recommended test behavior:

1. In Android Files, create or select a visible Meeting Recall folder under Documents.
2. Use the app's Choose Meeting Recall Folder action.
3. Select that exact visible folder.
4. Copy the recording into the selected folder.
5. Confirm the file is visible manually in Android Files.
6. Confirm the same file can be selected from NotebookLM upload.

Important:

User-selected SAF folder access is currently more reliable for validation than automatic folder creation.

The spike attempts to persist the selected SAF folder URI in app documentDirectory.

Persistence still needs real-device validation because Android document provider grants may not behave identically across devices or restarts.

---

# Prepare for NotebookLM

Implemented behavior:

1. Verify a recording/export file exists.
2. Require a selected SAF Meeting Recall folder URI.
3. Preserve the product filename format:
YYYY-MM-DD – Meeting Name.m4a
4. Attempt to improve discoverability by creating a fresh export-ready copy in the selected SAF folder.
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

1. User enters a new recording name in a simple text input.
2. Test Rename File sanitizes the new name.
3. The filename preserves the .m4a extension.
4. The filename preserves the product format:
YYYY-MM-DD – Meeting Name.m4a
5. The spike first determines whether the current file URI supports direct rename/move.
6. If direct rename works, it moves the file and verifies the new file exists and the old file is gone.
7. If direct rename does not work, it uses copy-and-replace:
   - create a new actual audio file in the selected Meeting Recall folder
   - copy audio bytes into the new file
   - verify the new file exists
   - verify the new file size is greater than 0
   - attempt to delete the old exported/prepared file
   - update app metadata to point to the new file URI
8. The spike updates the app display/debug name only after the new file exists.
9. Invalid filename characters are sanitized.
10. Empty names are rejected.
11. Duplicate file creation is handled by adding a safe suffix when needed.

Debug output includes:

- old filename
- new filename
- old URI/path
- new URI/path
- rename strategy used: direct rename or copy-and-replace
- new file size
- old file deleted true/false
- final active file URI
- rename success/failure
- file exists checks

Required product behavior:

Renaming in the app must rename the actual visible file in Documents / Meeting Recall because NotebookLM upload happens through the system file picker.

Real Android observation:

- Direct rename failed on the tested Android build.
- The app display name could change while the actual visible filename did not change.
- That is not acceptable for production.

Android limitation:

Storage Access Framework does not behave like a normal filesystem path rename. The spike validates rename by creating a new SAF file, copying the audio bytes, and deleting the old file.

This is acceptable for validation, but production should wrap it carefully so users experience it as a rename.

Old file deletion:

- The spike now attempts to delete the old file after the replacement file is verified.
- The debug panel reports whether the old file was confirmed deleted.
- Old-file deletion still needs real-device validation across Android document providers.

Production recommendation:

- Do not rely on direct rename for Android SAF files.
- Treat copy-and-replace as the production fallback when direct rename is unavailable.
- Only update the app's active recording metadata after the replacement file exists and has a non-zero size.
- If the old file cannot be deleted, show that clearly in logs/debug during development and consider a cleanup path before launch.
- The final product requirement is that the visible filename in the Meeting Recall folder matches the user's renamed title, regardless of whether that happens through direct rename or copy-and-replace.

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
- Selected SAF folder URI can be displayed
- Storage method can be displayed
- Native share sheet API is available
- NotebookLM can be opened with Linking
- Android SAF export uses binary-safe base64 read/write instead of copyAsync
- Prepare for NotebookLM creates a fresh export-ready copy
- Rename test now validates direct rename first, then falls back to copy-and-replace when direct rename is unavailable

---

# What Does Not Work Yet

Not validated yet:

- whether Android copied file appears in the system file picker
- whether the selected SAF folder remains accessible after app restart
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

## User-Selected Folder Is More Reliable

Based on testing so far, a user-selected folder is more reliable for validation than automatic folder creation.

Recommended production direction:

- ask the user to choose or create Meeting Recall inside Documents during setup
- save the selected SAF folder URI
- always show the exact folder and filename before NotebookLM handoff
- never rely only on Recents

## Meeting Recall Folder Creation

The app attempts to create a Meeting Recall folder inside the selected parent folder.

If folder creation fails because the folder already exists, the spike falls back to the selected folder. This is acceptable for testing but not final product behavior.

Current concern:

Automatic folder creation may not produce a folder that is obvious or findable enough in Android Files across devices.

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

Rename synchronization is now represented in the spike and direct rename failed on the tested Android build.

The fallback strategy is:

- create a replacement file with the renamed title
- copy the audio bytes into it
- verify the replacement exists and is larger than 0 bytes
- attempt to delete the old file
- update app metadata to the replacement file URI

The required final behavior is:

- app display name updates
- actual file name in Documents / Meeting Recall updates
- old file is removed
- new file remains playable
- NotebookLM can find the renamed file

Remaining validation:

- confirm old file deletion reports true on the tested Android provider
- confirm the renamed replacement file appears visibly in Android Files
- confirm the renamed replacement file remains playable
- confirm NotebookLM sees the renamed filename in the picker

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
3. In Android Files, create a visible Documents / Meeting Recall folder if needed.
4. Tap Choose Meeting Recall Folder in the app.
5. Select the visible Meeting Recall folder.
6. Tap Copy to Selected Folder.
7. Confirm the exported file exists.
8. Open Android Files and manually find the exact recording.
9. Play the exported file from Android Files.
10. Tap Test Rename Actual File.
11. Confirm the renamed file exists.
12. Confirm the old file no longer exists if applicable.
13. Play the renamed file from Android Files.
14. Tap Prepare for NotebookLM.
15. Try uploading the prepared file from NotebookLM.
16. If Recents does not show the file, browse to Documents / Meeting Recall.
17. Confirm whether NotebookLM accepts the prepared file.
18. Confirm whether the filename is preserved.

After Android validation, update this document with actual device results.

Then run an iOS-specific file accessibility spike.
