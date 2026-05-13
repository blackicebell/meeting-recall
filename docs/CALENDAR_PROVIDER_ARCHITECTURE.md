# Meeting Recall Calendar Provider Architecture

## Purpose

This document defines the calendar provider architecture for Meeting Recall.

The goal is to keep calendar integration simple, provider-agnostic, and focused on naming recordings from meetings.

Calendar should reduce friction.
It should not turn Meeting Recall into a scheduling app.

---

# Provider Philosophy

Meeting Recall should support calendar providers through small provider modules that normalize events into one shared app model.

The UI should not know whether an event came from Google Calendar or Outlook Calendar.

The Home screen should only receive clean meeting data.

---

# Current Provider

## Google Calendar

Google Calendar is the current implemented provider.

It handles:
- Google Sign-In access token usage
- Google Calendar events.list requests
- current-day event fetching
- Google event normalization
- Google-specific error/debug details

Provider module:
/lib/calendar/providers/googleCalendarProvider.ts

---

# Future Provider

## Outlook Calendar

Outlook Calendar is planned for a future phase.

It should follow the same provider pattern:
- authenticate with Microsoft
- fetch current-day events
- normalize events into MeetingEvent
- keep Outlook-specific logic out of Home

Do not implement Outlook until Google Calendar is stable and MVP recording flows remain reliable.

---

# Normalized MeetingEvent

All calendar providers should return:

- id
- provider
- title
- startTime
- endTime
- raw

Provider values:
- google
- outlook

The raw field is optional and should only be used for debugging or provider-specific troubleshooting.
It should not drive UI behavior.

---

# Shared Calendar Service

Shared service:
/lib/calendar/calendarService.ts

Responsibilities:
- check connected calendar providers
- fetch today's meetings from connected providers
- normalize provider results
- sort meetings by start time
- return a clean array to the Home screen

The Home screen should depend on this service instead of importing provider-specific APIs.

---

# UI Rule

Do not clutter the UI with provider details unless the user needs them for connection or troubleshooting.

Home should show:
- Today's Meetings
- meeting title
- meeting time

Tapping a meeting should prefill the recording title regardless of provider.

---

# Product Boundary

Calendar integration exists only to reduce naming friction.

Do not add:
- event creation
- event editing
- reminders
- attendee management
- scheduling workflows
- meeting productivity dashboards

---

# Success Definition

Calendar architecture succeeds when:
- Google Calendar works through the provider service
- Home remains provider-agnostic
- Outlook can be added later without rewriting Home
- meeting tap behavior remains simple
- the app stays focused on recording and NotebookLM handoff
