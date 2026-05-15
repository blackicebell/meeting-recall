# Meeting Recall Known MVP Limitations

## Purpose

This document keeps beta testers and internal reviewers aligned on what the MVP intentionally does and does not support yet.

These limitations should not block internal beta testing unless they prevent the core workflow from working.

---

# Recording Requires the App to Stay Open

Recording works best while Meeting Recall stays open and active.

Current MVP behavior:

- locking the screen may interrupt recording
- switching apps may interrupt recording
- true background recording is not implemented yet

This should be explained calmly to testers.

---

# Outlook Calendar Is Not Implemented Yet

Google Calendar is the current calendar provider.

Outlook Calendar is planned for a later phase, but it is not part of the current MVP beta.

---

# NotebookLM May Open in the Browser

Meeting Recall opens NotebookLM directly after validating the recording file.

Depending on Android or iOS app-link behavior, NotebookLM may open in:

- the NotebookLM app
- the browser

Browser fallback is acceptable for MVP.

The app should not promise app-only opening unless testing proves it works reliably.

---

# No Cloud Sync

Meeting Recall does not sync recordings to the cloud.

Recordings are local-first and stay on the user’s device unless the user shares or uploads them somewhere else.

---

# Local-First Storage

Recordings are saved locally to the Meeting Recall folder.

Current intended location:

Documents / Meeting Recall

This supports the core NotebookLM workflow because users can browse to the folder when uploading recordings.

---

# Recording Finalization Is Required

Meeting Recall should not mark a recording as saved until the exported audio file is validated.

Current save expectations:

- source recording exists
- source recording size is greater than 0
- source recording is readable
- final exported file exists
- final exported file size is greater than 0
- final exported file can initialize for playback when feasible

If validation fails, the app should show:

Recording could not be finalized.

This is a launch-blocking reliability area because visible files that cannot play or upload break user trust.

---

# Post-Save Rename Is Deferred

The expected filename should be created during the initial Save Recording step.

Renaming already-saved files is deferred until safe native file operations are validated.

---

# Recents Visibility Is Not Guaranteed

Android or NotebookLM may not always show a newly saved recording in Recents.

Reliable fallback:

Browse to Documents / Meeting Recall and select the exact filename shown in Meeting Recall.

---

# MVP Success Standard

The MVP is successful if users can:

1. record a meeting
2. save it with a clear filename
3. find it in the Meeting Recall folder
4. open NotebookLM
5. upload the recording
6. get insights without confusion
