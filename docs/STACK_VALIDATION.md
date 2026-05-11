# Meeting Recall Stack Validation

## Purpose

This document validates whether the current technical stack is suitable for Meeting Recall.

The goal is to identify:
- stack strengths
- stack risks
- missing native capabilities
- audio recording limitations
- file system limitations
- platform-specific concerns
- whether the project is ready for production implementation

This document should be updated after reviewing the current codebase and testing on real devices.

---

# Product Requirements That Affect Stack Choice

Meeting Recall requires:

- Reliable audio recording
- Pause/resume recording
- Long recording stability
- Local file storage
- User-accessible file folders
- Actual filename renaming
- Native share sheet support
- NotebookLM browser/app opening
- Google Calendar integration
- iOS and Android support

These requirements are more native-heavy than a simple UI app.

---

# Validation Date

May 11, 2026

---

# Current Codebase Finding

The current repository is not yet an application codebase.

It currently contains:
- product documentation
- UX documentation
- architecture documentation
- QA documentation
- design screenshot exports
- README.md
- AGENTS.md

It does not currently contain:
- package.json
- Expo config
- React Native app source
- iOS project
- Android project
- source code folders
- navigation setup
- state management
- audio implementation
- file system implementation
- calendar integration
- app store build configuration

## Direct Conclusion

The current project can become the production app repository, but the current codebase is not yet a production app.

The Lovable UI/design exports should be treated as a prototype and visual implementation reference, not as the production technical base unless actual exported code is added and audited separately.

---

# Current Stack

## Frontend Framework
None currently implemented.

## Runtime
None currently implemented.

## Navigation
None currently implemented.

## Styling System
None currently implemented.

The design direction is documented in COMPONENT_SYSTEM.md, DESIGN_HANDOFF.md, and the screenshot exports, but no code-level theme system exists yet.

## State Management
None currently implemented.

## Audio Library
None currently implemented.

## File System Library
None currently implemented.

## Calendar/Auth Library
None currently implemented.

---

# Existing Dependencies

No application dependencies are currently present.

Not found:
- npm dependencies
- native dependencies
- Expo dependencies
- lockfiles
- CocoaPods files
- Gradle files

This is good from a bloat perspective, but it means every stack decision still needs to be made.

---

# Audio Recording Capability

## Current Capability
Not implemented.

The current project cannot currently:
- record audio
- pause/resume recording
- produce .m4a files
- handle long recordings
- handle background recording
- handle audio interruptions
- play audio
- render waveform data

## Production Requirement
Audio is the highest-risk technical system and should be validated before visual polish.

## Expo Managed Assessment

Expo can be a reasonable starting point, especially with modern Expo audio APIs and development builds. Expo's audio tooling supports recording, playback, pause, metering/audio state, and configurable background recording behavior.

However, Meeting Recall should not rely on Expo Go as the production validation environment.

Likely requirement:
- Expo development build or prebuild
- config plugins for permissions/background modes
- real-device testing on iOS and Android

## Background Recording Risk

Background recording is supported by some Expo/native configurations, but it is still risky enough to require early device testing.

Risks:
- Android foreground service behavior and persistent notification
- iOS background audio mode requirements
- battery impact
- OS interruption handling
- phone call interruptions
- headphones/Bluetooth disconnects
- long recording memory and file stability

## Recommendation

Start with an Expo development build only if the recording spike proves:
- long recordings are stable
- pause/resume works correctly
- background behavior is acceptable
- interruptions are recoverable
- output format and file naming are controllable

If these fail, move to a more native-friendly setup or add custom native modules.

---

# File System Capability

## Current Capability
Not implemented.

The current project cannot currently:
- create a Meeting Recall folder
- save recordings locally
- expose files to the system file picker
- rename actual files
- confirm file visibility in Recents
- share files with native share sheets
- recover from missing files

## Production Requirement
File accessibility is not just storage. It is part of the product UX.

Meeting Recall must make users confident that files:
- exist
- are findable
- are named clearly
- are usable in NotebookLM upload flows

## Expo Managed Assessment

Expo file APIs can support app-local file access and Android Storage Access Framework flows. Expo sharing APIs can support native sharing of local files on iOS and Android.

The hardest requirement is not basic saving. The hard requirement is user-visible, predictable file placement across iOS and Android.

## iOS Reality

On iOS, apps are sandboxed. Making files visible in the Files app is realistic, but the exact UX depends on app document sharing configuration, file provider behavior, document picker/share behavior, and where the file is stored.

Risk:
- A file may exist locally but not be obvious to the user in the Files app.
- "Meeting Recall folder" visibility needs device validation.
- Recents ordering may not be fully controllable.

## Android Reality

On Android, scoped storage makes a user-visible folder realistic but nuanced.

Likely approaches:
- Storage Access Framework for user-selected folders
- app-specific external storage for simpler persistence
- MediaStore or custom native handling if stronger public folder behavior is needed

Risk:
- The simplest app-local storage may not satisfy NotebookLM upload discoverability.
- Direct writes to public Documents-like locations may require platform-specific handling.
- Recents optimization may be inconsistent.

## Recommendation

Do a file-system spike before building the full UI.

The spike must prove:
- save a recording-like file
- show it in a user-accessible location
- rename the actual file
- share the file
- select/upload it from a file picker flow
- repeat on both iOS and Android

If Expo managed APIs cannot satisfy this cleanly, use Expo prebuild/custom native modules or a bare/native approach.

---

# NotebookLM Handoff Capability

## Current Capability
Not implemented.

The current project cannot currently:
- open NotebookLM
- fallback to browser
- prepare files before handoff
- verify a file exists before opening NotebookLM
- guide users through upload

## Production Requirement
Meeting Recall should not pretend to directly upload into NotebookLM.

Required behavior:
1. Ensure recording exists.
2. Ensure file is accessible.
3. Prepare the file for visibility if needed.
4. Show helper instructions.
5. Open NotebookLM app or browser.
6. Provide fallback if NotebookLM cannot open.

## Stack Assessment

This is feasible in React Native/Expo using linking and browser APIs, plus native share/file APIs.

The risky part is not opening a URL. The risky part is making sure the correct file is easy to find after the user lands in NotebookLM.

## Recommendation

NotebookLM handoff should be built only after file accessibility is proven.

---

# Google Calendar/Auth Capability

## Current Capability
Not implemented.

The current project cannot currently:
- sign into Google
- request calendar access
- fetch today's meetings
- prefill recording names
- handle disconnected calendar states

## Production Requirement
Calendar integration exists only to reduce naming friction.

It should not become:
- a scheduling system
- a calendar dashboard
- a meeting management tool

## Expo Managed Assessment

Google auth and Calendar API access are feasible in an Expo/React Native stack using OAuth/auth libraries and direct Google Calendar API calls.

Likely production needs:
- Google OAuth flow
- secure token storage
- read-only calendar scope
- token refresh handling
- disconnected/denied states

## Risk

Calendar auth can add meaningful complexity. It should come after recording and file storage are proven.

## Recommendation

Treat Google Calendar as Phase 6, as defined in IMPLEMENTATION_PLAN.md.

---

# App Store Readiness

## Current Capability
Not ready.

Missing:
- app source
- native permissions config
- iOS bundle ID
- Android package name
- icons
- splash implementation
- privacy labels
- release signing
- build pipeline
- physical-device test results

## Expo Managed Assessment

Expo/EAS can support production iOS and Android builds, but this app likely needs development builds and config plugins rather than Expo Go-only development.

Expo managed workflow may be enough if:
- audio recording passes real-device tests
- background recording works acceptably
- file accessibility works acceptably
- Google auth is stable
- app store permissions can be configured cleanly

Expo managed workflow may not be enough if:
- a truly visible persistent Meeting Recall folder requires native code
- Recents optimization requires platform-specific file timestamp/indexing behavior
- background recording needs deeper native lifecycle control
- NotebookLM handoff requires more advanced document provider behavior

## Recommendation

Use Expo only with a production-minded setup:
- Expo development builds
- EAS Build
- config plugins
- early iOS and Android physical-device testing

Do not validate core behavior only in Expo Go.

---

# Potential Stack Risks

## Expo Managed Limitations

Expo managed can move quickly, but Meeting Recall has native-heavy requirements. The risk is discovering late that file visibility or background recording needs deeper native control.

## Native Module Requirements

Custom native modules may be needed for:
- stronger public folder behavior
- better Recents/file-indexing behavior
- background recording lifecycle control
- platform-specific audio interruption recovery

## iOS File Access Restrictions

iOS sandboxing may make the "visible Meeting Recall folder" less straightforward than the product promise sounds. This is solvable, but it must be designed and tested early.

## Android Scoped Storage Restrictions

Android file access varies by OS version and storage API. A simple local file path is not enough to guarantee user-visible NotebookLM upload discoverability.

## Background Audio Limitations

Background recording is possible but should be treated as a high-risk behavior. It needs explicit permission/configuration and real-world interruption testing.

## Permission Differences

Microphone, calendar, storage/file access, notifications/foreground service behavior, and background modes differ across platforms.

## Package Maintenance Concerns

Avoid abandoned recording or waveform packages. Audio recording is too central to depend on fragile libraries.

## App Store Review Risks

App review may scrutinize:
- microphone usage
- calendar access
- privacy wording
- local file access
- background recording behavior
- misleading NotebookLM claims

Keep copy honest: Meeting Recall records and organizes. NotebookLM provides AI insights.

---

# Recommended Libraries / Systems

These are recommendations to validate, not final locked decisions.

## App Framework
Recommended starting point:
- Expo React Native with TypeScript
- Expo development build, not Expo Go-only
- EAS Build for iOS/Android

Reason:
- good development speed
- strong app store path
- supports config plugins
- can move toward prebuild/native code if needed

## Navigation
Recommended:
- React Navigation native stack

Reason:
- standard React Native navigation
- simple enough for this app
- supports linear flows without overcomplication

## Recording
Recommended first spike:
- expo-audio

Validation required:
- .m4a/AAC output
- pause/resume
- background recording
- interruption handling
- long recording stability
- metering for waveform feedback

Fallback options if spike fails:
- native iOS AVAudioRecorder module
- native Android MediaRecorder/AudioRecord module
- well-maintained React Native native audio library

## Playback
Recommended first spike:
- expo-audio

Needs:
- play/pause
- seek
- duration/progress state
- interruption handling

## Waveform
Recommended:
- start with lightweight metering visualization during recording
- use generated or sampled waveform data only after recording/playback needs are stable

Avoid making waveform fidelity a blocker before recording reliability.

## File System
Recommended first spike:
- expo-file-system
- Android Storage Access Framework where needed
- validate iOS Files visibility approach

Potential native fallback:
- platform-specific file/document handling module
- Android MediaStore or SAF-focused native helper
- iOS document folder/file sharing configuration

## Sharing
Recommended:
- expo-sharing for outbound native share

Validation required:
- local file URI sharing on iOS
- local file URI sharing on Android
- filename preservation

## Calendar Auth
Recommended:
- Google OAuth using Expo AuthSession or Google sign-in library
- secure token storage
- direct Google Calendar API read-only access

Validation required:
- app store acceptable permission copy
- token refresh flow
- disconnect/reconnect flow

## Deep Linking / Opening NotebookLM
Recommended:
- React Native Linking
- Expo WebBrowser as browser fallback if using Expo

Validation required:
- NotebookLM app open behavior
- browser fallback
- failure messaging

## State Management
Recommended:
- React state/context for simple screen-local concerns
- Zustand or a small store only if app-wide recording/file state becomes awkward
- AsyncStorage or SQLite for recording metadata persistence

Avoid heavy state frameworks unless the app grows beyond MVP scope.

## Metadata Persistence
Recommended:
- start with a small persistent recording metadata store
- keep file path/URI, filename, title, duration, created date, file size, and missing-file status

Potential choices:
- AsyncStorage for simple MVP
- SQLite if metadata grows or querying becomes important

---

# Decision Needed

After stack review, decide:

## Option A
Continue with current stack as-is.

Not possible. There is no implemented app stack.

## Option B
Continue with current stack but add required native modules.

Not applicable yet. There is no current app stack to extend.

## Option C
Move to a more native-friendly setup.

Potentially valid if early Expo spikes fail on file visibility or background recording.

## Option D
Rebuild production app separately from Lovable UI prototype.

Recommended.

The Lovable/design exports should remain the visual prototype and UI reference. The production app should be built in a native-capable mobile stack from the project docs and screenshots.

---

# Decision Criteria

Choose the approach that best supports:

1. Recording reliability
2. File accessibility
3. iOS/Android launch readiness
4. Maintainability
5. Development speed
6. Low complexity

---

# Recommended Path

Recommended path:

1. Keep this repository as the production repository.
2. Treat current Lovable screenshots as design reference, not production code.
3. Scaffold a new Expo React Native TypeScript app in this repo.
4. Use Expo development builds from the beginning.
5. Validate audio recording and file accessibility before building all screens.
6. If Expo APIs pass validation, continue with Expo/EAS.
7. If file visibility or background recording fail, move to Expo prebuild/custom native modules or a more native setup.

## First Technical Spike

Before building full UI, prove:
- record a 30-minute audio file
- pause/resume works
- save as .m4a or acceptable AAC container
- store file accessibly
- rename actual file
- share the file
- locate file through system picker
- open NotebookLM/browser helper flow

## Production Readiness Gate

Do not consider the stack validated until the spike passes on:
- one real iPhone
- one real Android device

---

# Final Stack Success Definition

The stack is acceptable only if it can support:

1. Reliable recording
2. Local accessible file storage
3. Actual file renaming
4. NotebookLM handoff
5. Google Calendar integration
6. App Store release builds

without fragile hacks or excessive complexity.

---

# Final Validation Summary

Current status:
- No production stack exists yet.
- No dependencies exist yet.
- No app code exists yet.
- Lovable/design exports should remain prototype/reference assets.

Best next move:
- scaffold a production-minded Expo React Native TypeScript app
- use development builds
- run audio and file-system spikes immediately
- only commit to Expo managed long term if those native-heavy requirements pass real-device testing
