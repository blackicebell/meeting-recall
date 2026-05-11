# Meeting Recall

Meeting Recall is a local-first mobile app designed to help users record meetings and easily use those recordings with Google NotebookLM for AI-powered insights.

The app focuses on simplicity, reliability, and reducing friction between:
recording conversations → understanding conversations.

Meeting Recall does not attempt to replace AI tools.
Instead, it creates the smoothest possible workflow for using tools like NotebookLM.

---

# Core Workflow

Record Meeting

↓

Save Recording Locally

↓

Open NotebookLM

↓

Upload Recording

↓

Get AI Insights

---

# Product Philosophy

Meeting Recall is intentionally focused.

The app should feel:
- calm
- premium
- lightweight
- obvious to use
- local-first

The product avoids:
- unnecessary AI features
- cloud complexity
- dashboard clutter
- feature bloat

---

# Core Features

- Audio meeting recording
- Local-first storage
- Visible “Meeting Recall” device folder
- Google Calendar integration
- Date-first recording naming
- Playback controls
- Rename recordings
- Open NotebookLM workflow
- Native share support

---

# Core UX Principles

## Reduce User Thinking
The user should never wonder:
- where the file is
- what to do next
- how to upload the recording

---

## NotebookLM Is the Primary Workflow
Meeting Recall records meetings.
NotebookLM provides AI understanding.

---

## File Visibility Is Critical
Files must:
- save predictably
- remain accessible
- be easy to locate
- work with system file pickers

---

# Visual Direction

The UI is:
- typography-led
- spacious
- minimal
- clean
- premium

Inspired by:
- Zune HD
- Metro UI
- Apple Voice Memos
- Linear
- Notion

---

# Primary Color

Blue:
#4b7de6

Recording red should only appear during active recording states.

---

# Tech Philosophy

Prefer:
- local-first systems
- maintainable architecture
- lightweight dependencies
- reusable UI components
- predictable behavior

Avoid:
- over-engineering
- unnecessary backend systems
- unnecessary AI integrations

---

# Project Structure

/docs
Contains product, UX, technical, QA, and launch documentation.

/design
Contains UI exports, screenshots, and design references.

/app
Application source code.

/components
Reusable UI components.

---

# Important Documentation

## Product
/docs/MEETING_RECALL_PRODUCT_LOCK.md

Defines:
- product scope
- core philosophy
- feature boundaries

---

## UX Flows
/docs/APP_FLOW.md

Defines:
- screen flows
- interaction flows
- edge cases

---

## UX Rules
/docs/UX_RULES.md

Defines:
- interaction philosophy
- UI behavior rules
- product consistency expectations

---

## Technical Expectations
/docs/TECHNICAL_EXPECTATIONS.md

Defines:
- storage expectations
- file handling
- recording behavior
- NotebookLM workflow expectations

---

## NotebookLM Workflow
/docs/NOTEBOOKLM_HANDOFF.md

Defines:
- NotebookLM UX
- handoff behavior
- file accessibility expectations

---

## Component System
/docs/COMPONENT_SYSTEM.md

Defines:
- typography
- spacing
- buttons
- layout rules
- component consistency

---

## QA Plan
/docs/QA_TEST_PLAN.md

Defines:
- testing flows
- edge-case testing
- launch QA requirements

---

## Launch Checklist
/docs/APP_STORE_LAUNCH_CHECKLIST.md

Defines:
- App Store readiness
- launch requirements
- branding assets
- legal requirements

---

# Core Success Definition

Meeting Recall succeeds when a non-technical user can:

1. Record a meeting
2. Save it
3. Open NotebookLM
4. Find the correct recording immediately
5. Upload it without confusion
6. Get AI insights with minimal friction

---

# Product Integrity Rule

If a proposed feature:
- adds complexity
- increases cognitive load
- shifts the app toward SaaS/dashboard behavior
- distracts from the core NotebookLM workflow

it should probably not be added.

Meeting Recall wins through:
- simplicity
- clarity
- reliability
- focused execution
