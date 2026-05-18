# Meeting Recall UX Rules

## Purpose
This document defines the user experience rules for Meeting Recall.

These rules should guide every screen, interaction, component, and future feature decision.

---

# 1. Reduce User Thinking

The user should never wonder:
- Where is my recording?
- What do I do next?
- How do I get this into NotebookLM?
- Did my file save correctly?

Every screen should make the next action obvious.

---

# 2. NotebookLM Is the Main Workflow

Meeting Recall does not provide AI summaries inside the app.

The core value is:
Record here. Understand in NotebookLM.

Because of this:
- “Open NotebookLM” should be the primary CTA on recording detail screens.
- Share should be secondary.
- The app should always guide the user toward making the recording easy to upload.
- Recording Detail should provide the needed filename, location, and short upload guidance.
- Open NotebookLM should open directly after file validation.
- Do not add confirmation modals for this non-destructive action.
- Reserve modals or alerts for errors, fallback states, and destructive actions.

---

# 2A. Onboarding And Setup

First-run onboarding should quickly explain:
- Meeting Recall records meetings
- NotebookLM provides insights after upload
- Recordings save locally
- Files live in the Meeting Recall folder

Onboarding should use short, confident copy.
Avoid tutorials, long paragraphs, and technical explanations.

Microphone permission should always have a calm explainer before the OS prompt.

Use:
Meeting Recall uses the microphone to record your meetings.

Pre-permission buttons must use neutral wording such as:
Continue

If permission is denied, recovery should be clear:
Microphone access is off.
Turn it on in Settings to record meetings.

Folder setup should explain the practical benefit:
Documents / Meeting Recall makes files easier to find when uploading to NotebookLM.

Onboarding completion should persist locally so returning users go directly to Home.

---

# 3. Old Recordings Must Work Like New Recordings

Users may not send a recording to NotebookLM immediately.

Any old recording should be just as easy to open, prepare, and upload later.

The app should never treat NotebookLM handoff as a one-time post-recording step.

---

# 4. File Visibility Is Core UX

The file system is part of the user experience.

Recordings must:
- Save to a visible Meeting Recall folder
- Use clean date-first file names
- Be easy to identify later
- Rename both in the UI and on the device
- Be easy to find when uploading into NotebookLM

---

# 5. Recording Is Sacred

The recording screen should be calm and focused.

During recording, do not show:
- Share actions
- Delete actions
- Rename actions
- NotebookLM actions
- Extra settings

Only show what is needed to record, pause, resume, and stop.

---

# 6. Keep the App Lean

Do not add features that turn Meeting Recall into:
- A transcription app
- An AI assistant
- A meeting dashboard
- A notes app
- A collaboration tool

If a feature does not directly support recording, saving, finding, playing, or opening in NotebookLM, it should probably not be in the MVP.

---

# 7. Typography Carries the Design

The UI should feel premium through:
- Strong typography
- Generous spacing
- Clean alignment
- Minimal visual noise

Avoid relying on:
- Heavy shadows
- Too many cards
- Decorative gradients
- Excessive color

---

# 8. Visual Style

Meeting Recall should feel:
- Calm
- Minimal
- Premium
- Clear
- Utility-focused

Design direction:
- Light-only for MVP
- Primary blue: #4b7de6
- Red for active recording states and recording-screen controls
- Dividers over cards
- Gradient only for the most important CTA

Recording color hierarchy:
- Red should make recording feel immediate, tactile, and important.
- Use red for active recording indicators, the circular microphone/stop control on the Recording screen, and destructive confirmation states.
- Do not use red for general navigation, the Home record CTA, or NotebookLM actions.
- Blue remains reserved for Open NotebookLM, main navigation CTAs, and the Home record button.

---

# 9. Buttons and Actions

Primary action:
Open NotebookLM

Secondary actions:
- Share
- Rename
- Delete

Rules:
- Only one dominant CTA per screen.
- Secondary actions should not visually compete with the primary action.
- Destructive actions like Delete should be visually quiet until selected.
- The Home record CTA should be a blue primary button near thumb reach.
- The actual Recording screen should use a red circular microphone/stop control.
- Save Recording should feel compact and balanced, with clear filename/location affordances instead of paragraphs.

Preferred recording limitation copy:
Keep Meeting Recall open during recording.

---

# 10. Copywriting Rules

Copy should be:
- Short
- Plainspoken
- Helpful
- Non-technical

Avoid:
- Corporate language
- Long explanations
- Overpromising AI
- Saying Meeting Recall creates summaries

Use language like:
- “Your recording is ready.”
- “Saved to Meeting Recall folder.”
- “Open NotebookLM.”
- “Upload this file as a source.”
- “Record here. Understand in NotebookLM.”

---

# 11. Error Handling

Errors should:
- Explain what happened
- Tell the user what to do next
- Avoid blame
- Avoid technical jargon

Bad:
“File system write exception.”

Good:
“Unable to save recording. Please try again.”

---

# 12. Success Standard

A non-technical user should be able to use the app without instructions.

If the user needs a tutorial to understand the main workflow, the UX is not clear enough.

---

# 13. Home Screen UX

Home should remain provider-agnostic and focused on the next useful action.

The user should be able to:
- start a manual recording quickly
- tap a meeting to prefill a recording title
- reopen an old recording

The floating record button should sit centered in a comfortable thumb zone and remain the clearest action on the screen.

Fast Capture:
- tapping the floating record button should open Recording and start recording immediately

Intentional Meeting Capture:
- tapping a calendar meeting should open Recording with the meeting title visible
- it should not auto-start recording
- the user stays in control of when the meeting recording begins

Today's Meetings and Recent Recordings should use dividers, typography, and spacing instead of heavy cards.

Avoid:
- debug panels
- raw provider output
- dense dashboard layouts
- excessive metadata
- competing primary actions
