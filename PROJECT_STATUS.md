# NeuroNest — Project Status

## Overview
**NeuroNest** is an AI-powered, accessible, personalized platform for neurodiverse individuals (supporting ASD, ADHD, Dyslexia, Dyscalculia, and diverse cognitive profiles). It features an interactive learning corner, 8 educational games (Phaser 3), daily routine and task management, progress tracking, and custom accessibility settings ("My Comfort").

- **Repository**: [https://github.com/vamsikiran1234/NeuroNest.git](https://github.com/vamsikiran1234/NeuroNest.git)
- **Current Phase**: Phase 1 — Project Foundation & Setup
- **Last Updated**: 2026-11-19

---

## Phase Roadmap & Current State

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Project Foundation, Monorepo Setup (Frontend + Backend + PostgreSQL + Docker Compose), Git Init | ✅ Completed |
| **Phase 2** | Design System, Accessible Themes, Typography tokens, Radix UI Primitives | ✅ Completed |
| **Phase 3** | Authentication & User Management (Spring Security, JWT, Refresh Tokens, Roles) | 🔄 In Progress |
| **Phase 4** | Personalization & Multi-Step Onboarding (3 Presentation Profiles) | ⏳ Pending |
| **Phase 5** | Educational Game Hub & Reusable Game Engine (8 Phaser 3 Playable Games) | ⏳ Pending |
| **Phase 6** | Learning Corner (Text Simplification, TTS) & Daily Journey (Routines/Tasks) | ⏳ Pending |
| **Phase 7** | Spring AI Integration (Gemini, Structured DTOs, Deterministic Fallbacks) | ⏳ Pending |
| **Phase 8** | Guardian & Administration Dashboards (Consent, RBAC, Monitoring) | ⏳ Pending |
| **Phase 9** | Comprehensive Testing (JUnit 5, Mockito, Vitest, Playwright, Accessibility Checks) | ⏳ Pending |
| **Phase 10** | Production Hardening, DevOps (Docker, GitHub Actions), Documentation | ⏳ Pending |

---

## Technical Architecture Summary

- **Frontend**: React 18+ / TypeScript, Vite, Tailwind CSS, Radix UI, Motion, Phaser 3, Zustand, TanStack Query, React Router v6, React Hook Form, Zod, Lucide React, Recharts.
- **Backend**: Java 21 LTS, Spring Boot 3.3+, Spring Web, Spring Security, Spring Data JPA, Hibernate, Flyway, Spring AI (Gemini), Spring Boot Actuator, Maven.
- **Database**: PostgreSQL 16 with Flyway migrations.
- **Authentication**: JWT access token + HttpOnly SameSite refresh token cookie, BCrypt password hashing.
- **AI Integration**: Spring AI `ChatClient` with Gemini 1.5/2.0, non-blocking fallback mechanisms for offline/unconfigured environments.
