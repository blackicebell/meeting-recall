# Meeting Recall Google Calendar Implementation Plan

## Purpose

This document plans Google Calendar read-only integration for the current Expo development build.

Calendar exists only to reduce naming friction:

Connect Google Calendar -> show today's meetings -> tap meeting -> prefill recording title.

Meeting Recall should not become a scheduling app.

---

# Current App Context

## Current Stack

- Expo React Native TypeScript app
- Expo development build already required
- Google Sign-In dependency added:
  - @react-native-google-signin/google-signin
- Native modules already in use:
  - expo-audio
  - expo-file-system
  - expo-sharing
  - expo-dev-client
- Navigation:
  - React Navigation native stack
- Local persistence:
  - simple app-local JSON/file storage
- Current Android package:
  - com.meetingrecall.app
- Current app scheme:
  - meetingrecall
- iOS bundle identifier:
  - com.meetingrecall.app
- Google Sign-In config plugin:
  - added to app.json
- Google OAuth config placeholders:
  - constants/google.ts
- Android OAuth client ID:
  - added in constants/google.ts
- iOS OAuth client ID:
  - 246712386244-j4mt2dd5ja7n241gi09c3acoo62vshca.apps.googleusercontent.com
- iOS URL scheme:
  - com.googleusercontent.apps.246712386244-j4mt2dd5ja7n241gi09c3acoo62vshca
- Google Sign-In runtime configuration:
  - configured with calendar.events.readonly scope
  - webClientId is configured
  - iOS client ID is configured for iOS builds
- Settings Calendar UI:
  - Connect button triggers Google Sign-In
  - Connected account email is shown when available
  - Disconnect clears local Calendar connection metadata
- Today’s Meetings fetch:
  - implemented with Google Calendar primary events.list
  - uses Google Sign-In access token
  - fetches current-day events only
  - Home shows connected, empty, disconnected, and error states
- Tap meeting behavior:
  - opens Recording with the event title as the suggested save title
  - Save Recording still creates the final date-first filename

## Calendar Requirement

The app only needs:

- Google sign-in
- read-only calendar event access
- today's events from the primary calendar
- meeting title and time
- connected/disconnected state
- disconnect in Settings

The app does not need:

- write access
- event creation
- scheduling
- attendee management
- calendar editing

---

# Options Compared

## Option 1: @react-native-google-signin/google-signin

### Fit

Best fit for the production app.

This is the recommended approach because Meeting Recall only needs Google account auth and Google API authorization. A Google-specific library reduces custom OAuth plumbing and gives a more native account experience.

Expo's own Google authentication guidance points to this library for Google authentication in Expo apps, and the library supports requesting additional Google API scopes.

### Required Dependencies

Add:

- @react-native-google-signin/google-signin

Potentially add later:

- expo-secure-store for token/account metadata storage

### New Dev Build Required

Yes.

This library uses native code and cannot be used in Expo Go. The current app already uses development builds, so this is acceptable, but every developer/tester needs a new dev build after adding the config plugin.

### Google Cloud Console Setup

Required:

1. Create or use a Google Cloud project.
2. Enable Google Calendar API.
3. Configure OAuth consent screen.
4. Add app name, support email, developer contact.
5. Add calendar scope:
   - https://www.googleapis.com/auth/calendar.events.readonly
6. Add test users while app is in testing mode.
7. Create OAuth client IDs for Android and iOS.

### OAuth Client IDs

Required:

- Android OAuth client ID
- iOS OAuth client ID
- Web client ID may be needed if offline access or server auth code is used later

For MVP, prefer online access only and avoid backend token exchange.

Current Android client ID:

246712386244-dv9r6taeedo7i6ji8kat6fembml23ssk.apps.googleusercontent.com

Current Web client ID passed to GoogleSignin.configure():

246712386244-lrdeep9efn801ae52rh6cfqqeqk3ju5r.apps.googleusercontent.com

Important:

@react-native-google-signin/google-signin does not accept androidClientId as a runtime configure() option. Android sign-in is tied to the Google Cloud Android OAuth client through package name and SHA-1. The Android client ID is still documented in constants/google.ts for setup clarity, but it must not be passed to GoogleSignin.configure().

GoogleSignin.configure() should use:

- webClientId
- calendar.events.readonly scope

### Android Requirements

Required:

- Android package name:
  - com.meetingrecall.app
- SHA-1 fingerprint for the development build signing certificate
- Later, SHA-1 fingerprints for production/upload/app-signing certificates

Risk:

Using the wrong SHA-1 causes Google sign-in failures such as developer configuration errors.

### iOS Requirements

Required:

- iOS bundle identifier must be finalized in app.json.
- Recommended:
  - com.meetingrecall.app
- iOS OAuth client ID
- reversed iOS client ID as the iOS URL scheme in the config plugin

Current iOS config:

- app.json defines ios.bundleIdentifier as com.meetingrecall.app.
- app.json includes the Google Sign-In config plugin with the real reversed iOS client ID as iosUrlScheme.

### Calendar Scope

Preferred scope:

https://www.googleapis.com/auth/calendar.events.readonly

Fallback scope if event listing behavior requires broader read-only access:

https://www.googleapis.com/auth/calendar.readonly

Use the least powerful scope that supports listing today's events from the primary calendar.

### Token Storage Approach

Recommended MVP approach:

- Store only minimal connection metadata locally:
  - connected true/false
  - account email
  - granted scopes
  - last successful sync timestamp
- Do not persist access tokens in plain text.
- Use the Google sign-in library to retrieve fresh tokens when needed.
- If token persistence is required later, use expo-secure-store.

### Calendar Fetch Approach

Use the access token to call:

GET https://www.googleapis.com/calendar/v3/calendars/primary/events

Query:

- timeMin: start of current local day as RFC3339
- timeMax: start of next local day as RFC3339
- singleEvents: true
- orderBy: startTime
- maxResults: small value such as 20

Store only normalized event data in app state:

- id
- title
- start time
- end time
- calendar id: primary

### Risks

- Requires a new development build.
- Requires correct Google Cloud Console setup.
- Android requires the correct SHA-1 for each signing environment.
- iOS cannot be finished cleanly until bundle identifier is defined.
- Calendar scopes may trigger Google OAuth verification before public launch.
- Google sign-in package has native configuration complexity.
- Access token refresh behavior must be tested on real devices.

---

## Option 2: Expo AuthSession

### Fit

Acceptable for a lightweight spike, but not the preferred production path.

AuthSession is a general OAuth tool. It can open a browser-based OAuth flow and return to the app through a redirect URI. It is flexible, but it means Meeting Recall owns more of the OAuth details:

- redirect URI setup
- token exchange
- token refresh
- revocation
- edge cases around browser sessions
- secure token storage

This adds complexity for a feature that should remain small and boring.

### Required Dependencies

Likely add:

- expo-auth-session
- expo-web-browser
- expo-secure-store

Depending on implementation:

- expo-crypto
- expo-linking

### New Dev Build Required

Likely yes.

Even though AuthSession is Expo-native, adding new native Expo modules to the current development client generally requires a rebuilt dev build.

### Google Cloud Console Setup

Required:

1. Enable Google Calendar API.
2. Configure OAuth consent screen.
3. Add read-only calendar scope.
4. Create OAuth clients for native app redirect behavior.
5. Configure redirect URI / app scheme handling.

### OAuth Client IDs

Required:

- Android OAuth client ID or web/native OAuth setup depending on the chosen AuthSession flow
- iOS OAuth client ID

Important:

Do not put a client secret in the mobile app.

### Android Requirements

Required:

- Android package:
  - com.meetingrecall.app
- App scheme:
  - meetingrecall
- Correct redirect URI handling
- SHA-1 if using Android OAuth client

### iOS Requirements

Required:

- iOS bundle identifier
- App scheme / redirect handling
- iOS OAuth client ID

Current status:

ios.bundleIdentifier is defined as com.meetingrecall.app.

### Calendar Scope

Preferred:

https://www.googleapis.com/auth/calendar.events.readonly

Fallback:

https://www.googleapis.com/auth/calendar.readonly

### Token Storage Approach

Required:

- Store token response securely with expo-secure-store.
- Store expiration timestamp.
- Refresh token if available.
- If refresh token is not available, require reconnect when token expires.

### Risks

- More custom OAuth code.
- Browser-based flow can feel less native.
- Token refresh may be brittle without a backend.
- Redirect URI setup can be easy to misconfigure.
- Google OAuth policies may make refresh-token behavior inconsistent without careful setup.
- More app-owned security responsibility.

---

# Recommendation

Use @react-native-google-signin/google-signin for the production Calendar integration.

## Why

- Meeting Recall only needs Google account authorization, not a generic auth system.
- The current app already depends on development builds, so the native-module requirement is not a blocker.
- The Google-specific library is better aligned with Google account selection and Google API scopes.
- It keeps Calendar integration contained and avoids turning the app into a custom OAuth/token-management project.
- It supports the product principle: calendar should reduce naming friction, not become a major architecture pillar.

Expo AuthSession remains useful as a fallback or spike path if native Google configuration blocks progress, but it should not be the first production choice.

---

# Required Setup Before Implementation

## App Config

Current app.json preparation:

- ios.bundleIdentifier:
  - com.meetingrecall.app
- Keep android.package as:
  - com.meetingrecall.app
- @react-native-google-signin/google-signin native dependency added.
- iOS URL scheme is configured through the @react-native-google-signin/google-signin Expo config plugin.
- constants/google.ts contains the Android OAuth client ID, iOS OAuth client ID, iOS URL scheme, and Web OAuth client ID.
- lib/googleSignIn.ts configures Google Sign-In with:
  - calendar.events.readonly scope
  - iOS client ID when available
  - web client ID when available

Important:

Do not add OAuth client secrets to the app. OAuth client IDs are public identifiers.

## Google Cloud Console

1. Create/select Google Cloud project.
2. Enable Google Calendar API.
3. Configure OAuth consent screen.
4. Add app support/developer emails.
5. Add scope:
   - https://www.googleapis.com/auth/calendar.events.readonly
6. Add test users.
7. Create Android OAuth client:
   - package name: com.meetingrecall.app
   - SHA-1 for development build
8. Create iOS OAuth client:
   - bundle ID: com.meetingrecall.app
9. Keep client IDs documented outside code if possible.

## Build

Create a new development build after the dependency and config plugin changes:

eas build -p android --profile development

Later:

eas build -p ios --profile development

---

# Proposed Implementation Shape

## Files Added

- lib/googleCalendarApi.ts
- lib/calendarStore.ts
- types/calendar.ts
- lib/googleSignIn.ts

## UI Touchpoints Later

Home:

- Today’s Meetings section implemented
- Connect Calendar/disconnected empty state implemented
- No meetings today state implemented
- Calendar loading state implemented
- Calendar error state implemented

Settings:

- Calendar connected state implemented
- Account email implemented when available
- Disconnect Calendar implemented

Recording:

- Accepts optional prefilled title from selected calendar event

Save Recording:

- Default title uses the selected event title
- User can still edit before saving

## State Model

Store minimal local calendar connection metadata:

- connected
- email
- grantedScopes
- lastSyncAt

Do not store full calendar event history.

Only keep today's fetched meetings in memory unless caching is needed for perceived speed.

---

# Implementation Order

1. Confirm the Android OAuth client has package com.meetingrecall.app and the correct development SHA-1.
2. Replace placeholder iOS OAuth client ID and iOS URL scheme after Google Cloud Console setup. Completed.
3. Add/confirm Google Cloud project setup.
4. Build new Android development build.
5. Build new iOS development build when ready to test iPhone.
6. Implement sign-in and disconnect in isolation.
7. Request calendar.events.readonly scope. Completed.
8. Fetch today's primary calendar events. Completed.
9. Add Home states. Completed:
   - disconnected
   - loading
   - no meetings
   - events
   - error
10. Tap meeting -> Recording screen with prefilled title. Completed.
11. Save flow uses prefilled title to create date-first filename. Completed.
12. Add Settings connected/disconnect UI. Completed.
13. Run QA on real Android.
14. Repeat setup and QA on real iPhone.

---

# Risks To Watch

## Current Debug Status

Google Sign-In now connects successfully and returns an access token.

Current observed issue:

- Home shows:
Unable to load calendar events.

This means the remaining problem is inside the Google Calendar events.list request or Google Cloud Calendar API setup.

Latest fetch error discovered:

- HTTP status: 400
- Error: Invalid field selection
- Cause: request used an invalid partial response selector:
fields=items(id,summary,start,end),error

Fix applied:

- Removed the fields parameter completely.
- Kept the required events.list query params:
  - timeMin
  - timeMax
  - singleEvents=true
  - orderBy=startTime
  - maxResults=20
- Kept Authorization: Bearer ACCESS_TOKEN.

Current Calendar fetch diagnostic approach:

- Home shows dev-only Calendar Fetch Debug output.
- Console logging keeps the raw fetch error available during development.

The next real-device test should capture:

- access token present true/false
- request URL
- timeMin
- timeMax
- HTTP status code
- raw error response body
- parsed error message
- scope being used
- number of events returned if successful

Expected interpretations:

- 401 means the token is invalid or expired, so the user should reconnect Google Calendar.
- 403 may mean Calendar API is not enabled, the OAuth scope is insufficient, the app/test user setup is incomplete, or Google Cloud permission configuration is blocking the request.
- 200 with zero events should show:
No meetings today.

Remaining setup gaps:

- The Android dev build must include @react-native-google-signin/google-signin.
- Android OAuth client must match package com.meetingrecall.app and the signing SHA-1 used by the installed development build.
- iOS client ID is configured in app code.
- iOS URL scheme is configured in app.json with the real reversed iOS client ID.
- Calendar event fetching is implemented and should be tested on real Android with a connected account.
- Exact Calendar fetch failure is pending the next device test.

## OAuth Verification

calendar.events.readonly may require Google OAuth verification before public launch. This is a product launch risk, not just an engineering task.

## Android SHA-1

Different signing keys can require different SHA-1 fingerprints:

- local development
- EAS development build
- preview/internal build
- production upload key
- Google Play app signing key

## iOS Identifier Status

iOS bundle identifier is defined as:

com.meetingrecall.app

The iOS Google OAuth client and reversed client ID URL scheme are now configured. A new iOS build is required before testing this on TestFlight.

## Token Freshness

Access tokens expire. The app must handle token refresh/re-auth calmly:

Unable to load calendar events.

Manual recording must still work.

## Scope Creep

Do not add scheduling, reminders, event creation, attendee display, conference links, or productivity-dashboard behavior.

---

# Final Decision

Recommended path:

Use @react-native-google-signin/google-signin with a new Expo development build.

Use the minimum Calendar event read-only scope first:

https://www.googleapis.com/auth/calendar.events.readonly

Only broaden to calendar.readonly if real device testing proves events.list cannot meet the MVP requirement.

The integration is production-appropriate only when:

- Android sign-in works on a real development build
- iOS sign-in works on a real development build
- today’s events load from the primary calendar
- disconnected/denied/error states are calm
- manual recording always remains available
- tap meeting -> record -> save uses the meeting title correctly

---

# Calendar Provider Architecture Update

Google Calendar is now treated as a calendar provider behind a shared service.

Provider module:

lib/calendar/providers/googleCalendarProvider.ts

Shared service:

lib/calendar/calendarService.ts

Home should fetch meetings through the shared service and should not import Google Calendar request logic directly.

All providers normalize events into MeetingEvent:

- id
- provider
- title
- startTime
- endTime
- raw

Current provider:

- google

Future provider:

- outlook

Outlook Calendar should be added later through its own provider module without changing the Home screen contract.
