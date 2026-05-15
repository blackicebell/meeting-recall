# Meeting Recall iOS Storage Behavior

## Purpose

This document defines how Meeting Recall handles saved recordings on iOS.

The important platform difference:

- Android uses Storage Access Framework for a user-selected folder.
- iOS does not support Android-style folder picking through Storage Access Framework.

---

# iOS Storage Decision

Meeting Recall saves recordings to app-controlled document storage on iOS.

Current iOS recording location:

Meeting Recall app document storage

User-facing copy:

"Recordings are saved inside Meeting Recall on this device."

iOS document sharing is enabled through app configuration:

- UIFileSharingEnabled
- LSSupportsOpeningDocumentsInPlace

This may make Meeting Recall document storage available through iOS Files/Finder-style access, depending on iOS behavior and device settings.

Share remains the most reliable handoff path.

To reduce browsing friction, new iOS recordings are saved directly in the visible Meeting Recall app folder instead of inside a second nested Meeting Recall folder.

App metadata is stored separately in an internal `.meeting-recall-data` folder so users primarily see recording files, not app bookkeeping files.

Known saved recordings from the older nested folder path are migrated up to the app document root when the recordings list loads, when the source file is still available.

---

# Why iOS Is Different

iOS apps are sandboxed.

That means Meeting Recall should not promise that users can browse to:

Documents / Meeting Recall

the same way they can on Android.

Even with iOS document sharing enabled, users may still experience file browsing differently from Android. The app should continue to make Share obvious and reliable.

---

# iOS NotebookLM Handoff

On iOS, users should use the Share flow when NotebookLM cannot find a recording through its file picker.

Expected iOS handoff:

1. Save the recording.
2. Open the recording detail screen.
3. Tap Share if needed.
4. Send or upload the `.m4a` recording to NotebookLM or another app.

The app may still open NotebookLM, but the reliable file handoff on iOS is Share.

If Files access shows Meeting Recall as a location, users can also try selecting the saved `.m4a` from there. Do not make this the only path.

---

# Android Behavior

Android remains different.

Android uses:

- Storage Access Framework
- user-selected Meeting Recall folder
- recommended location: Documents / Meeting Recall

Android users can browse to that folder from compatible file pickers.

---

# QA Requirements

On iOS, test:

- onboarding does not show Choose Folder
- storage setup says recordings are saved inside Meeting Recall
- recording saves successfully
- saved recordings play back in Meeting Recall
- Share can send the `.m4a` file to another app
- Meeting Recall document storage appears in Files/Finder if iOS exposes it
- New `.m4a` recordings appear directly inside the Meeting Recall app folder when Files/Finder exposes app documents
- Older known recordings from the nested Meeting Recall folder are moved up one level when possible
- App metadata JSON files do not appear next to user recordings after migration
- Files/Finder access is treated as helpful but not required for the MVP handoff
- NotebookLM handoff copy does not rely on browsing to Documents / Meeting Recall

On Android, test:

- Choose Folder still appears
- Storage Access Framework still opens
- Documents / Meeting Recall remains the recommended folder
- saved files remain visible from Android Files

---

# Product Rule

Do not use Android file-system language on iOS.

Avoid:

"Browse to Documents / Meeting Recall"

on iOS screens unless an iOS file-provider approach is implemented and validated.
