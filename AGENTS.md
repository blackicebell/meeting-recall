# Meeting Recall — AGENTS.md

## Project Overview

Meeting Recall is a local-first mobile app for recording meetings and making those recordings easy to use with Google NotebookLM.

The app is intentionally minimal.
It is not an AI assistant.
It is not a transcription platform.
It is not a SaaS dashboard.

The core workflow is:
Record → Save → Open NotebookLM → Upload → Get Insights

The product should feel calm, premium, obvious, and frictionless.

---

# Core Product Philosophy

Meeting Recall does not compete by adding more AI features.

Meeting Recall competes by:
- reducing friction
- simplifying workflows
- improving file accessibility
- making NotebookLM usage feel seamless

Always optimize for:
- clarity
- simplicity
- predictability
- speed
- calm UX

Avoid feature creep.

---

# Most Important UX Principle

The user should never wonder:
- what to do next
- where their file is
- how to upload the recording
- whether their recording saved correctly

Every implementation decision should reduce uncertainty.

---

# Technical Philosophy

## Local-First Architecture

Prioritize:
- local storage
- fast interactions
- lightweight architecture
- minimal backend dependencies

Avoid unnecessary cloud systems.

---

# AI Philosophy

Meeting Recall does NOT:
- generate summaries
- transcribe meetings
- perform AI processing

NotebookLM is the AI workflow.

Do not implement unnecessary AI systems inside the app.

---

# UI Philosophy

The app should feel:
- clean
- typography-led
- spacious
- minimal
- premium
- calm

Inspired by:
- Zune HD
- Metro UI
- Apple Voice Memos
- Linear
- Notion

---

# Visual Rules

## Colors
Primary blue:
#4b7de6

Recording red:
Use only during active recording states.

Avoid excessive color usage.

---

# Layout Rules

Prefer:
- whitespace
- typography
- dividers

Avoid:
- heavy cards
- excessive shadows
- dashboard-style layouts
- visual clutter

---

# Gradients

Use gradients sparingly.

Only use gradients on:
- the most important CTA
- hero actions if necessary

Never overuse gradients.

---

# Typography

Typography carries the hierarchy.

Prioritize:
- readable sizing
- strong spacing
- clean alignment
- consistent rhythm

Avoid:
- tiny labels
- crowded layouts
- decorative typography

---

# Recording Screen Rules

The recording screen is sacred.

While recording:
- do not show Share
- do not show Delete
- do not show Rename
- do not show NotebookLM actions
- do not clutter the UI

Only show:
- timer
- waveform
- pause
- stop
- recording state

The screen should feel focused and distraction-free.

---

# NotebookLM Workflow Rules

NotebookLM is the primary workflow.

“Open NotebookLM” should:
- be visually dominant
- be easier to access than Share
- guide the user naturally

Share is secondary.

---

# File System Rules

Files are part of the UX.

Recordings must:
- save locally
- save to visible “Meeting Recall” folder
- remain accessible outside the app
- use clean naming conventions
- be easy to identify inside file pickers

---

# File Naming Convention

All recordings should follow:

YYYY-MM-DD – Meeting Name.m4a

Examples:
2026-04-29 – Meeting Yoshi.m4a
2026-04-29 – Client Call.m4a

---

# Rename Rules

Renaming inside the app must also rename the actual device file.

This behavior is critical.

---

# Old Recording Rules

Old recordings must work just as smoothly as new recordings.

The app should never imply that NotebookLM upload only happens immediately after recording.

Users must always be able to:
- open old recordings
- find files easily
- upload without confusion

---

# Copywriting Rules

Copy should be:
- short
- calm
- direct
- non-technical

Avoid:
- corporate language
- hype
- AI buzzwords
- long explanations

Good examples:
- “Your recording is ready.”
- “Saved to Meeting Recall folder.”
- “Open NotebookLM.”
- “Upload your recording.”

---

# Error Handling Rules

Errors should:
- explain clearly
- reduce panic
- avoid technical jargon
- provide next-step guidance

Bad:
“File system write exception.”

Good:
“Unable to save recording. Please try again.”

---

# Development Priorities

Prioritize:
1. Stability
2. Recording reliability
3. File accessibility
4. UX clarity
5. Performance
6. Visual polish

Visual polish should never compromise usability.

---

# Performance Expectations

The app should feel:
- fast
- lightweight
- responsive
- stable

Avoid:
- unnecessary animations
- bloated dependencies
- over-engineering

---

# Architecture Guidance

Prefer:
- simple architecture
- maintainable code
- reusable UI components
- predictable state management

Avoid:
- unnecessary abstraction
- premature optimization
- overly clever implementations

---

# Decision-Making Rule

When uncertain between:
- adding more functionality
or
- simplifying the experience

Choose simplicity.

---

# Product Success Definition

Meeting Recall succeeds when a non-technical user can:

1. Record a meeting
2. Save the recording
3. Open NotebookLM
4. Immediately find the file
5. Upload it without confusion
6. Get AI insights quickly

with minimal thought or friction.
