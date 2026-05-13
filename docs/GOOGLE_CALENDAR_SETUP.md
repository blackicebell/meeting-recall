# Meeting Recall Google Calendar Setup

## Purpose
Google Calendar integration exists only to reduce naming friction.

The MVP goal is:
Connect Google Calendar → show today’s meetings → tap meeting → prefill recording title.

Meeting Recall should NOT become a scheduling app.

---

# Scope

## MVP Calendar Features
- Google sign-in
- Read-only calendar access
- Show Today’s Meetings on Home
- Tap event to start recording with prefilled title
- Disconnect calendar in Settings

---

# Out of Scope
- Creating calendar events
- Editing events
- Deleting events
- Scheduling meetings
- Attendee management
- Meeting reminders
- Calendar productivity features

---

# OAuth Scope

Preferred minimum scope:
https://www.googleapis.com/auth/calendar.events.readonly

Alternative broader read-only scope:
https://www.googleapis.com/auth/calendar.readonly

Use the least powerful scope that supports reading today’s events.

---

# Calendar API Behavior

Fetch events for the current day only.

Required event data:
- event id
- summary/title
- start time
- end time
- calendar id if needed

Ignore:
- event descriptions
- attendees
- attachments
- conference links
- private details unless already included in event summary

---

# Home Screen Behavior

If connected:
Show Today’s Meetings section.

Each meeting row should show:
- meeting title
- time

Tap meeting:
- opens Recording screen
- pre-fills save title with event title
- final filename remains date-first

Example:
2026-05-12 – Meeting Yoshi.m4a

---

# Empty States

## No Meetings Today
Show:
“No meetings today.”

## Calendar Not Connected
Show:
“Connect Google Calendar to name recordings from your meetings.”

CTA:
“Connect Calendar”

## Calendar Loading
Use a quiet loading state.

## Calendar Error
Show:
“Unable to load calendar events.”

Manual recording must still work.

---

# Settings Behavior

Settings should show:
- Calendar connected state
- Connected account email if available
- Disconnect option

---

# Privacy Position

Calendar access is used only for meeting titles and times.

Meeting Recall does not:
- modify calendar events
- create calendar events
- delete calendar events

---

# App Store / Google Play Notes

Explain calendar permission simply:
“Calendar access helps name recordings from your meetings.”

---

# Success Definition

Calendar integration succeeds when users can:
1. connect Google Calendar
2. see today’s meetings
3. tap a meeting
4. record
5. save with date-first meeting name
