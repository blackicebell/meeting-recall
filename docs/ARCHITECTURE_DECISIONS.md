# Meeting Recall Architecture Decisions

## Purpose

This document defines important architectural decisions for Meeting Recall.

The goal is to:
- reduce inconsistent implementation
- document technical philosophy
- prevent unnecessary complexity
- guide future development decisions
- help AI agents reason consistently

This document should evolve as architecture decisions become finalized.

---

# Core Architecture Philosophy

Meeting Recall should remain:
- lightweight
- local-first
- reliable
- maintainable
- simple to reason about

The architecture should prioritize:
1. recording reliability
2. file accessibility
3. UX clarity
4. maintainability

over:
- unnecessary abstraction
- premature optimization
- enterprise complexity

---

# Product Scope Reminder

Meeting Recall is NOT:
- a cloud platform
- an AI assistant
- a collaboration suite
- a transcription system
- a SaaS dashboard

The architecture should reinforce this simplicity.

---

# Preferred Development Approach

Prefer:
- modular components
- predictable flows
- reusable systems
- straightforward logic

Avoid:
- excessive architectural patterns
- deeply nested abstractions
- over-engineered systems

---

# Platform Direction

## Primary Platforms
- iOS
- Android

---

# Local-First Philosophy

## Decision
Recordings should remain local-first.

---

## Reasoning
- lower infrastructure costs
- simpler implementation
- stronger privacy perception
- easier file accessibility
- simpler MVP launch

---

## Implications
- no cloud sync for MVP
- user-managed backups
- direct file visibility important

---

# Audio Recording Philosophy

## Priority
Recording reliability is the highest technical priority.

---

## Requirements
- stable long-form recording
- pause/resume support
- playback support
- interruption handling
- low corruption risk

---

## Important Rule
Avoid experimental audio architectures that increase instability risk.

---

# File System Philosophy

## Decision
Files are part of the user experience.

---

## Requirements
Recordings must:
- remain user-accessible
- save predictably
- use human-readable names
- work with system file pickers

---

# File Naming Convention

Required format:

YYYY-MM-DD – Meeting Name.m4a

Examples:
2026-04-29 – Meeting Yoshi.m4a
2026-04-29 – Client Strategy Call.m4a

---

# Rename Rule

Renaming inside the app must rename the actual device file.

This is a critical product behavior.

---

# NotebookLM Integration Philosophy

## Decision
Do not architect around hypothetical NotebookLM APIs.

---

## Current Workflow
Meeting Recall:
- records
- saves
- prepares files

NotebookLM:
- handles AI understanding

---

## Important Rule
Do not build fake or fragile automation layers pretending to deeply integrate with NotebookLM.

---

# UI Architecture Philosophy

## Decision
UI should remain component-driven and minimal.

---

## Requirements
Prefer:
- reusable components
- consistent spacing
- typography-led hierarchy
- lightweight visual systems

Avoid:
- complex dashboard layouts
- deeply custom one-off screens
- inconsistent interaction patterns

---

# State Management Philosophy

## Requirements
State should remain:
- predictable
- debuggable
- understandable

---

## Important Rule
Avoid unnecessary global state.

Only globalize state that truly needs app-wide access.

---

# Navigation Philosophy

## Requirements
Navigation should feel:
- simple
- linear
- predictable

The app should avoid:
- deep navigation trees
- complex routing
- hidden flows

---

# Dependency Philosophy

## Important Rule
Prefer fewer dependencies.

---

## Avoid
- large unnecessary libraries
- abandoned packages
- highly experimental packages
- duplicate functionality packages

---

## Before Adding Dependency
Ask:
Does this significantly improve:
- reliability
- maintainability
- development speed
without adding unnecessary complexity?

---

# Performance Philosophy

## Requirements
The app should feel:
- fast
- lightweight
- responsive

---

## Avoid
- excessive animations
- unnecessary re-renders
- bloated startup logic
- memory-heavy visual systems

---

# Error Handling Philosophy

## Requirements
Errors should:
- reduce panic
- explain clearly
- avoid technical jargon
- provide recovery guidance

---

# Accessibility Philosophy

## Requirements
Support:
- readable typography
- accessible touch targets
- screen readers
- clear visual hierarchy

Accessibility should not be treated as optional polish.

---

# Offline Philosophy

## Decision
Core recording functionality should work offline.

---

## Requirements
Offline support for:
- recording
- playback
- local file access

Internet may still be required for:
- NotebookLM
- calendar sync

---

# Google Calendar Philosophy

## Decision
Calendar integration exists only to reduce naming friction and improve organization.

---

## Important Rule
Do not evolve calendar integration into:
- scheduling system
- productivity suite
- meeting management platform

---

# MVP Protection Philosophy

## Important Rule
Avoid building future-scale systems before they are needed.

---

## Examples
Do NOT prematurely build:
- enterprise architectures
- plugin systems
- advanced cloud infrastructure
- collaboration systems
- multi-tenant abstractions

---

# Architecture Success Definition

Architecture succeeds when:
- the codebase remains understandable
- recordings remain reliable
- files remain accessible
- UX remains simple
- developers can move quickly without chaos
- AI agents can reason clearly about the project
