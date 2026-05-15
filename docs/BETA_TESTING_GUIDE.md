# Meeting Recall Beta Testing Guide

## Purpose

This guide helps internal beta testers evaluate whether Meeting Recall feels clear, safe, and useful in real meeting workflows.

The beta goal is not to test every future feature.

The goal is to confirm the MVP workflow:

Record -> Save -> Open NotebookLM -> Upload -> Get Insights

---

# Ideal Tester Profiles

## Recommended Tester Count

Start with 5 to 8 internal beta testers.

That is enough to reveal the biggest UX problems without creating too much feedback noise.

After the core workflow feels stable, expand to 15 to 25 testers before public launch.

---

## Primary Testers

- People who record meetings or calls regularly
- People who already use Google Calendar
- People who are curious about NotebookLM
- Non-technical users who need a simple workflow
- Android users comfortable checking the Files app

---

## Helpful Secondary Testers

- Heavy meeting users
- Consultants, coaches, students, founders, or operators
- People who take messy notes and want cleaner follow-up
- Users who have never used NotebookLM before

---

# What Testers Should Do

## First Launch

1. Install the beta build.
2. Open Meeting Recall.
3. Complete onboarding.
4. Grant microphone access.
5. Choose Documents / Meeting Recall as the save folder.

Observe:
- Is the app immediately understandable?
- Does the NotebookLM role feel clear?
- Does local storage feel reassuring?
- Does setup feel calm, or does it feel like work?

---

## Core Recording Flow

1. Tap the floating record button.
2. Record for 30 seconds.
3. Pause and resume.
4. Stop.
5. Save with the suggested title.
6. Confirm the recording appears in Recent Recordings.

Observe:
- Is it obvious that recording is active?
- Does the timer/waveform build confidence?
- Does Save Recording feel simple?
- Does the filename make sense?

---

## NotebookLM Flow

1. Open a saved recording.
2. Confirm the exact filename is visible.
3. Tap Open NotebookLM.
4. Upload the recording in NotebookLM.
5. If the file is not in Recents, browse to Documents / Meeting Recall.

Observe:
- Does the user know which file to upload?
- Does the folder location help?
- Does the browser/app handoff feel fast?
- Does the flow need extra explanation?

---

## Old Recording Flow

1. Close Meeting Recall.
2. Reopen it.
3. Tap an older recording from Recent Recordings.
4. Play it.
5. Tap Open NotebookLM.

Observe:
- Do old recordings feel just as useful as new ones?
- Is file location still clear?
- Does playback still work?

---

## Calendar Flow

1. Open Settings.
2. Connect Google Calendar.
3. Return Home.
4. Tap a meeting under Today’s Meetings.
5. Start recording when ready.
6. Save the recording.

Observe:
- Does the meeting title prefill correctly?
- Is it clear that tapping a meeting prepares recording but does not auto-start?
- Does manual recording still feel easy?

---

## Share and Delete

1. Open a saved recording.
2. Tap Share and send it to one target.
3. Return to the recording.
4. Tap the trash icon.
5. Cancel once.
6. Tap the trash icon again and delete.

Observe:
- Does Share feel lightweight?
- Does Delete feel safe without being annoying?
- Does the recording disappear from Home after deletion?

---

# Questions to Ask Testers

- What did you think this app was for after the first screen?
- Did you understand that NotebookLM creates the insights, not Meeting Recall?
- Did you trust that your recording was saved?
- Could you find the file without help?
- Was Open NotebookLM clear?
- Did anything feel unfinished or confusing?
- Were any buttons hard to find?
- Did any screen feel too wordy?
- What would make you nervous about using this in a real meeting?

---

# Feedback Prioritization

## Feedback That Matters Most

Prioritize feedback about:

- recording trust
- save confidence
- file discoverability
- NotebookLM upload confusion
- onboarding clarity
- permission or folder setup friction
- crashes or dead ends
- unsupported file/share behavior
- moments where users hesitate

These issues affect the core product promise.

---

## Feedback to Treat Carefully

Do not rush to act on:

- requests for transcription
- requests for built-in AI summaries
- requests for cloud sync
- requests for dashboards or team features
- requests for advanced editing
- visual preferences from only one tester
- feature ideas that do not improve Record -> Save -> Open NotebookLM -> Upload

These may be useful later, but they should not pull the MVP away from its focused workflow.

---

## Feedback That Can Be Ignored for This Beta

Ignore or defer:

- “Can it replace NotebookLM?”
- “Can it summarize directly?”
- “Can I collaborate with my team?”
- “Can it manage my calendar?”
- “Can it transcribe live?”
- “Can it sync across devices?”

Those are outside the current product strategy.

---

# Known MVP Limitations

These are expected for the internal beta:

- Recording works best while Meeting Recall stays open and active.
- True background recording is not supported yet.
- Locking the screen or switching apps may interrupt recording.
- Post-save file rename is deferred.
- The final filename should be correct at initial save.
- NotebookLM may open in a browser instead of the installed app.
- File picker Recents visibility is not guaranteed.
- If Recents does not show the file, browse to Documents / Meeting Recall.
- iOS behavior still needs real-device validation.

---

# What Counts as a Beta Problem

Treat these as important issues:

- tester cannot tell whether recording is active
- tester cannot find the saved file
- tester does not know what to do in NotebookLM
- recording fails or saves as an empty file
- playback fails on a saved recording
- share target rejects the file type
- delete feels unsafe or confusing
- Calendar failure blocks manual recording
- onboarding creates wrong expectations about built-in AI
- any production screen shows debug or test controls

---

# Tester Feedback Format

Ask testers to report:

- device model
- Android or iOS version
- whether Google Calendar was connected
- whether NotebookLM opened in app or browser
- whether they found the file in Recents or had to browse folders
- what confused them
- what felt smooth
- screenshots or screen recordings if possible

---

# Beta Success Definition

The internal beta is successful when testers can:

1. understand the app without explanation
2. record a meeting
3. save it with a clear filename
4. find it later
5. open NotebookLM
6. upload the correct recording
7. play, share, and delete recordings safely

without hitting a dead end.
