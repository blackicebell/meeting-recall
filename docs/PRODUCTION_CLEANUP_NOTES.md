# Meeting Recall Production Cleanup Notes

## Purpose

This document summarizes the production cleanup pass completed before adding Outlook Calendar or preparing broader app store testing.

The goal was to remove spike leftovers, reduce diagnostic clutter, and make the current production code easier to maintain without changing the core user flows.

---

# What Was Removed

- Removed the unused Google Calendar API compatibility wrapper:
  - /lib/googleCalendarApi.ts
- Removed unused Google Sign-In diagnostic/test helpers from production code:
  - GoogleSignInDiagnostic type
  - check Play Services test helper
  - direct test sign-in helper
  - latest diagnostic getter
  - diagnostic formatting/export helpers
- Removed the undocumented NotebookLM experimental app-link check from the normal code path.
- Replaced the old production default title:
  - Test Recording
with:
  - Meeting Recording

No file accessibility spike UI, audio spike buttons, temporary test-file actions, or rename/copy experiment UI remain in production-facing screens.

---

# What Was Consolidated

- Added a shared development logging utility:
  - /lib/devLog.ts

Dev logging now goes through this helper instead of scattered `console.info` / `console.warn` calls.

- Google Sign-In is now focused on production responsibilities:
  - initialize Google Sign-In
  - connect Google Calendar
  - retrieve a Calendar access token
  - disconnect Google Calendar

- Recording CTA styling is shared through:
  - /components/recording/RecordingActionButton.tsx

Home quick-record and Recording screen start/stop controls now use the same visual system.

---

# Intentionally Dev-Only

The following logging remains intentionally available in development builds:

- Calendar service fetch results and provider errors
- NotebookLM file validation/open attempts
- Share payload metadata
- Google Sign-In configuration status

These logs are behind /lib/devLog.ts and do not create production-facing UI.

---

# Known Technical Debt

- Calendar connection metadata currently supports only Google as the active provider, though event models now support future Outlook events.
- Post-save rename remains deferred because safe native file replacement still needs validation.
- Saving audio to Android SAF currently relies on Base64 write behavior. This passed the current spike path but should be stress-tested with long recordings before launch.
- True background recording is not implemented. The app now attempts interruption recovery instead.
- iOS Google OAuth client ID and URL scheme still need final Google Cloud setup.
- Some older documentation still preserves spike history for decision traceability.

---

# Next Recommended Task

Run a real-device regression pass on Android:

1. Onboarding and folder setup
2. Home quick-record auto-start
3. Calendar meeting recording prep
4. Save to Meeting Recall folder
5. Recent Recordings persistence
6. Playback
7. Open NotebookLM
8. Share
9. Delete
10. App switch/screen lock interruption behavior

After that, prepare the Outlook Calendar provider plan using the shared calendar provider architecture.
