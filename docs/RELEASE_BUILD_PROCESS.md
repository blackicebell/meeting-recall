# Meeting Recall Release Build Process

## Purpose

This document defines how Meeting Recall should be built for development testing, internal preview testing, and production store submission.

Release builds should not depend on Metro, should not show the dev menu, and should behave like the app users will install from Google Play or the App Store.

---

# Build Profiles

Meeting Recall uses EAS Build profiles in `eas.json`.

---

## Development Build

Purpose:
- local development
- native module testing
- Google Sign-In testing
- device debugging

Profile:
`development`

Behavior:
- includes Expo dev client
- distribution is internal
- Android output is APK
- depends on Metro while actively developing
- not for beta testers or store submission

Command:

```bash
eas build -p android --profile development
```

```bash
eas build -p ios --profile development
```

---

## Preview Build

Purpose:
- internal beta testing
- real-user APK installs
- pre-store QA

Profile:
`preview`

Behavior:
- standalone internal build
- no dev menu
- no Metro dependency
- Android output is APK for easier tester distribution
- should feel close to production

Command:

```bash
eas build -p android --profile preview
```

```bash
eas build -p ios --profile preview
```

---

## Production Build

Purpose:
- Google Play submission
- Apple App Store submission
- final release validation

Profile:
`production`

Behavior:
- standalone production build
- no dev menu
- no Metro dependency
- optimized release bundle
- Android output is App Bundle
- EAS auto-increments store build versions

Command:

```bash
eas build -p android --profile production
```

```bash
eas build -p ios --profile production
```

---

# App Identity

## Android

Package:
`com.meetingrecall.app`

Production output:
Android App Bundle (`.aab`)

Current version code:
`1`

---

## iOS

Bundle identifier:
`com.meetingrecall.app`

Current build number:
`1`

---

# Versioning

App version is set in `app.json`:

```json
"version": "0.1.0"
```

Store build numbers are set in platform config:

```json
"android": {
  "versionCode": 1
}
```

```json
"ios": {
  "buildNumber": "1"
}
```

EAS is configured with:

```json
"appVersionSource": "remote"
```

and production builds use:

```json
"autoIncrement": true
```

Recommended release approach:
- increment `version` for user-visible releases
- let EAS auto-increment build numbers for production submissions
- confirm the final build number in EAS before submitting

---

# App Config Verification

Before a production build, verify `app.json` references:

- app icon: `./assets/icons/app-icon.png`
- Android adaptive icon: `./assets/icons/adaptive-icon-foreground.png`
- splash image: `./assets/splash/splash.png`
- splash background: `#ffffff`
- Android package: `com.meetingrecall.app`
- iOS bundle identifier: `com.meetingrecall.app`

---

# Permissions

## Microphone

Required for recording.

Android:
`RECORD_AUDIO`

iOS:
`NSMicrophoneUsageDescription`

Current iOS copy:
“Microphone access is needed to record your meetings.”

---

## Calendar

Google Calendar access is handled through Google OAuth and the Calendar API.

Meeting Recall does not need native device calendar permission for the current implementation.

Required OAuth scope:
`https://www.googleapis.com/auth/calendar.events.readonly`

---

## Storage / Files

Meeting Recall uses the platform file picker / Storage Access Framework where needed.

Current Android app config does not declare broad storage permissions.

This is intentional unless testing proves a specific permission is required.

---

# Android Release Build Steps

1. Confirm `app.json` package is `com.meetingrecall.app`.
2. Confirm production Google OAuth SHA-1 fingerprints are added in Google Cloud Console.
3. Confirm Google Calendar API is enabled.
4. Confirm screenshots, privacy policy, and Data Safety answers are ready.
5. Run:

```bash
eas build -p android --profile production
```

6. Download the `.aab`.
7. Upload to Google Play Console internal testing first.
8. Test install from Play Console before promoting.

---

# iOS Release Build Steps

1. Confirm bundle identifier is `com.meetingrecall.app`.
2. Create the iOS OAuth client in Google Cloud Console.
3. Add the real reversed Google Sign-In iOS client ID as the iOS URL scheme in `app.json`.
4. Confirm Apple Developer signing is configured in EAS.
5. Confirm Privacy Policy and App Privacy details are ready.
6. Run:

```bash
eas build -p ios --profile production
```

7. Submit through EAS Submit or upload in App Store Connect.
8. Test through TestFlight before public release.

---

# Release Checklist

Before submitting:

- TypeScript check passes
- Android production build completes
- iOS production build completes
- App opens without Metro
- No dev menu appears
- No debug UI appears
- Recording works on a physical device
- Save to Meeting Recall folder works
- Playback works
- Open NotebookLM works
- Share works with `.m4a` audio
- Delete works safely
- Google Calendar sign-in works
- Today’s Meetings load
- No-meetings state works
- No-recordings state works
- Onboarding works from fresh install
- Microphone denied state works
- App icon and splash screen display correctly
- Store screenshots are final
- Privacy Policy, Terms, and Support URLs are live

---

# Current Submission Blockers

These must be resolved before public store submission:

- iOS Google OAuth client ID is still needed.
- iOS Google Sign-In URL scheme has been removed from `app.json` until the real reversed iOS client ID is available.
- Do not submit a build with a placeholder URL scheme. Apple rejects invalid placeholder schemes.
- iOS physical-device validation is still required.
- Production Google Play signing SHA-1 must be added to Google Cloud Console.
- Legal URLs must be hosted and verified.
- Public store copy must be finalized.

---

# Success Definition

Release build readiness means Meeting Recall can be installed from a store-style build, run without Metro, and complete the core workflow:

Record -> Save -> Open NotebookLM -> Upload

without debug surfaces, crashes, or confusing dead ends.
