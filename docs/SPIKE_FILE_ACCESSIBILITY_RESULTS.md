# Meeting Recall File Accessibility Spike Results

## Purpose

This document captures the current status of SPIKE 2: Local File Accessibility.

The current goal is intentionally narrow:

Record → save one file to the visible Meeting Recall folder → verify the file exists.

Rename, NotebookLM handoff, Recents optimization, sharing, and extra export flows are deferred until the basic save path is stable again.

---

# Current Priority

Reliable save is the current priority.

The spike became unstable after rename/copy/replace experiments. A low-memory warning appeared during copy behavior, and saving became unreliable.

The spike has been rolled back to the simplest possible validation flow.

---

# Library / System Used

Used:

- expo-audio
- expo-file-system
- expo-file-system Storage Access Framework on Android

Versions:

- expo-file-system ~19.0.22

Reason:

- expo-audio records the temporary app-controlled audio file.
- Android Storage Access Framework lets the user choose a visible folder.
- expo-file-system validates whether the saved file exists and reports size when available.

---

# Current Spike Flow

1. Record audio.
2. Stop recording.
3. Capture the temporary recording URI.
4. Choose a visible Meeting Recall folder through Android Storage Access Framework.
5. Enter or accept the test title.
6. Create one final filename:
YYYY-MM-DD – Meeting Name.m4a
7. Save/copy one file into the selected Meeting Recall folder.
8. Show the saved URI/path.
9. Verify the saved file exists.
10. Show file size if available.

---

# Current Debug Output

The spike screen now shows:

- recording temp URI
- selected/public folder URI
- final saved URI
- final filename
- save success true/false
- file exists true/false
- file size
- error message if save fails

---

# File Save Debug Results

Added a dedicated File Save Debug section to isolate the failing layer.

The debug section includes:

- target folder URI
- target file URI
- operation attempted
- success/failure
- exact error message
- file exists result
- file size result

## Create Test Text File

Purpose:

Validate basic Android Storage Access Framework folder permission and file creation.

Expected pass:

- A small `.txt` file appears in the selected Meeting Recall folder.
- Debug shows success true.
- File exists is true.
- File size is greater than 0.

If this fails, the likely issue is:

- folder permission
- selected folder URI
- Android Storage Access Framework limitation
- file visibility mismatch

Result:

Real-device test result:

- Text file creation works.
- Folder permission works.
- Storage Access Framework access works.
- Basic file creation works.

## Create Test Audio Placeholder

Status:

Removed.

Reason:

Placeholder audio files are no longer useful for the current failure. Target file creation works. The failure is transferring actual recorded audio bytes into the target file.

## Copy Latest Recording to Folder

Purpose:

Validate only the recording copy/save step.

Expected pass:

- The latest recorded audio file copies to the selected Meeting Recall folder.
- Debug shows success true.
- File exists is true.
- File size is greater than 0.

If text and placeholder files work but recording copy fails, the likely issue is:

- app internal recording URI
- `FileSystem.copyAsync`
- Android SAF destination behavior
- Expo file-system limitation

Result:

Pending real-device test.

Important:

Do not claim file accessibility works until a visible test file appears in Android Files under Meeting Recall.

---

# Audio Recording Copy Debug

Current finding:

- Text file creation works.
- Audio copy/save is the failure point.
- Exported audio files are being created as 0B files.

This means the issue is probably not basic folder permission or basic SAF file creation.

Observed:

- Source recording playback works inside the app.
- Target file creation works in the Meeting Recall folder.
- Byte transfer/write into the target audio file is failing or incomplete.

The spike now includes detailed debug output for the latest recording:

- recording URI
- recording file exists true/false
- recording file size
- MIME/type if available
- extension
- whether the URI is readable

## Test Read Recording

Purpose:

Verify the app can read the recorded audio file before copying it.

Expected pass:

- Recording file exists.
- File size is greater than 0.
- Read test succeeds.

Warning:

This read test may read the full recording into memory. Use only a very short 3-5 second test recording.

Result:

This is now part of the export guard.

Before creating a target file, the spike verifies:

- source recording URI exists
- source file exists
- source file size is greater than 0
- source can be read

If the source is empty or unreadable, the spike does not create a target file and shows:

"Source recording file is empty or unreadable."

Final result:

Pending real-device retest.

## Copy Recording as Binary/Base64 Test

Purpose:

Check whether the audio bytes can be read and written into a SAF-created `.m4a` file.

Warning:

This is not production-safe for long recordings. It exists only to isolate the failure with a 3-5 second test recording.

Expected pass:

- Target file URI is created.
- Target file exists.
- Target file size is greater than 0.

If this works but native copy fails, the likely issue is Expo/native copy handling with SAF targets.

Result:

This is now the attempted fix for the simplified export path.

Before creating the target file, the spike verifies:

- source recording URI exists
- source file exists
- source file size is greater than 0
- source can be read

After export, the spike verifies:

- target URI exists
- target file size is greater than 0
- export success true/false
- exact error if failed

If the target file is missing or 0B, the spike attempts to delete the failed SAF file.

Final result:

Pending real-device retest.

## Copy Recording Using FileSystem API

Purpose:

Test the safest native file copy method currently available in the Expo stack:

FileSystem.copyAsync

Expected pass:

- Target file URI is created.
- Target file exists.
- Target file size is greater than 0.

If this fails while text and placeholder creation work, the likely issue is:

- app internal recording URI behavior
- `FileSystem.copyAsync`
- Android SAF destination behavior
- Expo file-system limitation

Result:

Previous real-device result:

- Target audio files were created as 0B files.

Current behavior:

- Source file is validated before creating a target.
- If `FileSystem.copyAsync` still creates a missing or empty target, the spike attempts to delete the failed target file and reports the exact error/debug state.

Final result:

Pending real-device retest.

## Copy Method Debug Output

Each copy method now reports:

- source URI
- target URI
- target filename
- success/failure
- exact error
- target file exists
- target file size

Recommended production-safe method:

Pending test results.

Current best candidate in the Expo-only spike is byte write through Storage Access Framework for very short recordings, but this is not production-safe for long meetings until memory behavior is proven.

Do not choose a production method until we know which copy method succeeds without 0B output and without memory warnings.

---

# What Was Removed / Disabled

Removed or disabled:

- post-save rename tests
- direct rename experiments
- copy-and-replace rename experiments
- base64 read/write copy experiments
- memory-heavy file operations
- NotebookLM open
- NotebookLM preparation copy
- share sheet
- Recents optimization
- extra exported/prepared file states
- audio placeholder creation

Reason:

These experiments made the spike unstable and distracted from the core question:

Can Meeting Recall reliably save one recording to a visible folder?

---

# File Naming

The spike uses:

YYYY-MM-DD – Test Recording.m4a

The title can be edited before saving.

Invalid filename characters are sanitized.

---

# Android Testing Notes

Observed:

- Recording worked.
- Saving to the Meeting Recall folder worked at one point.
- Rename/copy experiments caused failures.
- A low-memory warning appeared:
"couldn't complete previous operation due to low memory."
- Saving became unreliable after the extra file operations were added.

Conclusion:

The spike should not attempt rename/copy/replace behavior until the basic save path is stable.

---

# Current Save Method

The current spike creates the final SAF file in the selected folder, then attempts a native file copy with:

StorageAccessFramework.writeAsStringAsync with Base64 data for short test recordings.

This is being used only to determine whether actual audio bytes can be written into the SAF URI.

Important:

This method is not production-safe for long meeting recordings until memory behavior is proven.

If Expo cannot safely write recording bytes to SAF destinations, the project may need a native Android storage module or a different file architecture.

---

# Rename Status

Rename is deferred.

Direct rename is unreliable on the tested Android setup.

Copy-and-replace rename is also deferred because previous copy behavior risked low-memory failures.

Preferred MVP behavior:

- Get the filename right at initial save.
- Avoid needing to rename public files whenever possible.

---

# Recents Status

Recents optimization is deferred.

Do not attempt to force Android or NotebookLM Recents behavior until reliable save is confirmed.

---

# Current Pass Condition

The spike passes only when this works reliably on a real Android device:

1. Record audio.
2. Stop recording.
3. Choose/select the visible Meeting Recall folder.
4. Save one file to that folder.
5. Confirm the debug output says save success is true.
6. Confirm the saved file exists.
7. Confirm file size is greater than 0.
8. Confirm the file is visible in Android Files.

---

# Current Fail Condition

The spike fails if:

- save throws an error
- low-memory warning appears
- saved file is missing
- saved file size is 0 or unknown in a way we cannot verify
- file cannot be found in the chosen visible folder

---

# Recommended Next Step

Run only the simple save flow on Android.

Do not test rename.

Do not test Recents.

Do not test NotebookLM.

If the simple save flow fails, stop and evaluate whether Expo's file APIs are sufficient for this product or whether a native storage module is required.
