# Meeting Recall Decision Log

## Purpose

This document records product and technical decisions that affect Meeting Recall implementation.

---

# Decision: Avoid Memory-Heavy Public File Copy/Rename

## Date

2026-05-12

## Context

Android testing showed that direct rename is unreliable in the current setup.

Testing also showed that memory-heavy copy behavior can trigger:

"couldn't complete previous operation due to low memory."

This is especially risky because Meeting Recall is designed for meeting-length recordings, not tiny audio clips.

---

## Decision

Do not rely on direct rename as the primary strategy.

Do not copy full audio files through JS memory for save, rename, or NotebookLM preparation.

The preferred MVP save flow is:

1. Record to a temporary app-controlled URI.
2. User enters or accepts title.
3. Sanitize title.
4. Create final filename:
YYYY-MM-DD – Meeting Name.m4a
5. Create the final public file once in Documents / Meeting Recall with that filename.
6. Use a safe native/platform file operation if available.
7. Verify the final file exists.
8. Verify file size is greater than 0.
9. Save app metadata pointing to the final public URI.
10. Delete temporary file if safe.

---

## Rename Decision

Post-save rename is deferred for MVP unless a safe native file operation is validated.

If MVP supports editing a display title without changing the visible file name, the UI must clearly communicate that limitation.

Preferred MVP behavior remains:

The visible file in Meeting Recall folder has the correct name at initial save.

---

## Rationale

Reliable save is more important than rename flexibility.

Users need confidence that recordings are saved and findable. A rename feature that risks failed saves or low-memory behavior damages trust.

---

## Production Implication

If Expo cannot safely write the temporary recording into an Android SAF destination without loading the full file into JS memory, Meeting Recall may need:

- a native Android storage module
- a custom development build with native file APIs
- a different storage architecture

This must be validated before full MVP implementation.
